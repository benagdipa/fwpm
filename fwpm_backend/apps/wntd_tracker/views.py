from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.db import transaction
import csv, io
from .models import WNTD, WNTDHistory
from .serializers import WNTDSerializer, WNTDHistorySerializer
from django.http import HttpResponse
from django.db import models

# Create your views here.

class WNTDViewSet(viewsets.ModelViewSet):
    queryset = WNTD.objects.all()
    serializer_class = WNTDSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        'loc_id', 'wntd_id', 'imsi', 'site_name', 'status', 
        'owner', 'action_owner', 'rsp', 'utran_cell_id', 
        'issue', 'findings', 'remarks'
    ]
    ordering_fields = [
        'loc_id', 'wntd_id', 'site_name', 'status', 
        'last_updated', 'owner', 'action_owner',
        'hst_days', 'hst_start'
    ]
    
    def perform_update(self, serializer):
        # Save the user who made the change
        serializer.save()
        if hasattr(self.request, 'user'):
            latest_history = self.get_object().history.first()
            if latest_history:
                latest_history.modified_by = self.request.user
                latest_history.save()
    
    @action(detail=False, methods=['get'])
    def status_summary(self, request):
        """Get summary counts of WNTD by status"""
        summary = WNTD.objects.values('status').annotate(count=Count('status'))
        return Response(summary)
    
    @action(detail=False, methods=['get'])
    def solution_types(self, request):
        """Get unique solution types and counts"""
        types = WNTD.objects.values('solution_type').annotate(count=Count('solution_type'))
        return Response(types)
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get the change history for a specific WNTD"""
        wntd = self.get_object()
        history = wntd.history.all()
        serializer = WNTDHistorySerializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        """
        Import WNTD records from CSV file
        """
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check file type
        if not file.name.endswith('.csv'):
            return Response({"error": "File must be a CSV"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Process CSV file
        data = file.read().decode('utf-8')
        io_string = io.StringIO(data)
        reader = csv.DictReader(io_string)
        
        results = {
            'success': 0,
            'failed': 0,
            'errors': []
        }
        
        # Field name mapping to handle different column names in CSV
        field_mapping = {
            'FWP Engineer': 'owner',
            'Location ID': 'loc_id',
            'WNTD ID': 'wntd_id',
            'IMSI': 'imsi',
            'WNTD Version': 'wntd_version',
            'BW Profile': 'bw_profile',
            'RSP': 'rsp',
            'Site': 'site_name',
            'Home Cell': 'utran_cell_id',
            'HST Start Date': 'hst_start',
            'HST days': 'hst_days',
            'Issue': 'issue',
            'Status': 'status',
            'Action Owner': 'action_owner',
            'Opti Remarks': 'remarks'
        }
        
        with transaction.atomic():
            for row in reader:
                try:
                    # Clean the data and map field names
                    cleaned_row = {}
                    for k, v in row.items():
                        if not v:  # Skip empty values
                            continue
                        # Normalize field name (lowercase, remove spaces, underscores)
                        normalized_key = k.lower().strip().replace('  ', ' ')
                        # Map to correct field name
                        field_name = field_mapping.get(normalized_key, normalized_key.replace(' ', '_'))
                        cleaned_row[field_name] = v.strip() if isinstance(v, str) else v
                    
                    # Check for required fields
                    if 'loc_id' not in cleaned_row:
                        raise ValueError("Location ID is required")
                    
                    # Handle type conversions
                    # Convert hst_days to integer
                    if 'hst_days' in cleaned_row and cleaned_row['hst_days']:
                        try:
                            cleaned_row['hst_days'] = int(cleaned_row['hst_days'])
                        except ValueError:
                            cleaned_row['hst_days'] = None
                    
                    # Convert hst_start to date format
                    if 'hst_start' in cleaned_row and cleaned_row['hst_start']:
                        try:
                            # Try different date formats
                            from datetime import datetime
                            date_formats = ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%d-%m-%Y', '%m-%d-%Y']
                            for fmt in date_formats:
                                try:
                                    date_obj = datetime.strptime(cleaned_row['hst_start'], fmt).date()
                                    cleaned_row['hst_start'] = date_obj
                                    break
                                except ValueError:
                                    continue
                            else:
                                # If no format works, set to None
                                cleaned_row['hst_start'] = None
                        except Exception:
                            cleaned_row['hst_start'] = None
                    
                    # Convert lat/lon to float if present
                    for coord_field in ['lat', 'lon']:
                        if coord_field in cleaned_row and cleaned_row[coord_field]:
                            try:
                                cleaned_row[coord_field] = float(cleaned_row[coord_field])
                            except ValueError:
                                cleaned_row[coord_field] = None
                    
                    # Check status value is valid
                    if 'status' in cleaned_row:
                        status_val = cleaned_row['status'].capitalize()
                        valid_statuses = [choice[0] for choice in WNTD.STATUS_CHOICES]
                        if status_val not in valid_statuses:
                            if status_val.lower() in ['homefast', 'home', 'home_fast', 'home fast']:
                                cleaned_row['status'] = 'HomeFast'
                            elif status_val.lower() in ['superfast', 'super_fast', 'super fast', 'super']:
                                cleaned_row['status'] = 'SuperFast'
                            elif status_val.lower() in ['failed', 'fail', 'error', 'failure']:
                                cleaned_row['status'] = 'Failed'
                            else:
                                cleaned_row['status'] = 'HomeFast'  # Default to HomeFast
                    
                    # Check if WNTD exists
                    wntd, created = WNTD.objects.get_or_create(
                        loc_id=cleaned_row['loc_id'],
                        defaults=cleaned_row
                    )
                    
                    if not created:
                        # Update fields
                        for key, value in cleaned_row.items():
                            if hasattr(wntd, key):
                                setattr(wntd, key, value)
                        wntd.save()
                    
                    results['success'] += 1
                    
                except Exception as e:
                    results['failed'] += 1
                    results['errors'].append({
                        'row': row.get('loc_id', f"Row {results['success'] + results['failed']}"),
                        'error': str(e)
                    })
        
        return Response(results, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """
        Export WNTD records to CSV
        """
        # Get all WNTD objects
        wntds = WNTD.objects.all()
        
        # Create a CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="wntd_data.csv"'
        
        # Define fields to export (excluding history)
        fields = [
            'owner', 'loc_id', 'wntd_id', 'imsi', 'wntd_version', 
            'bw_profile', 'rsp', 'site_name', 'utran_cell_id', 
            'hst_start', 'hst_days', 'issue', 'status', 
            'action_owner', 'remarks'
        ]
        
        # Create writer and write header
        writer = csv.writer(response)
        writer.writerow([
            'FWP Engineer', 'Location ID', 'WNTD ID', 'IMSI', 'WNTD Version',
            'BW Profile', 'RSP', 'Site', 'Home Cell',
            'HST Start Date', 'HST Days', 'Issue', 'Status',
            'Action Owner', 'Opti Remarks'
        ])
        
        # Write data rows
        for wntd in wntds:
            row = []
            for field in fields:
                value = getattr(wntd, field)
                if value is None:
                    value = ''
                row.append(value)
            writer.writerow(row)
        
        return response

    @action(detail=False, methods=['post'])
    def bulk_import(self, request):
        """
        Bulk import WNTD records from JSON
        Skips invalid records and continues with valid ones
        """
        data = request.data
        results = {
            'success': 0,
            'failed': 0,
            'errors': []
        }
        
        # Field name mapping similar to CSV import
        field_mapping = {
            'location_id': 'loc_id',
            'location id': 'loc_id',
            'version': 'wntd_version',
            'wntd version': 'wntd_version',
            'home_cell': 'utran_cell_id',
            'home cell': 'utran_cell_id',
            'utran cell id': 'utran_cell_id',
            'fwp_engineer': 'owner',
            'fwp engineer': 'owner',
            'action_owner': 'action_owner',
            'action owner': 'action_owner',
            'hst_start_date': 'hst_start',
            'hst start date': 'hst_start',
            'hst_start': 'hst_start',
            'hst_days': 'hst_days',
            'hst days': 'hst_days',
            'opti_remarks': 'remarks',
            'opti remarks': 'remarks',
            'bw_profile': 'bw_profile',
            'bw profile': 'bw_profile',
            'solution_type': 'solution_type',
            'solution type': 'solution_type',
            'site_name': 'site_name',
            'site name': 'site_name',
            'site': 'site_name',
            'home_pci': 'home_pci',
            'home pci': 'home_pci',
            'longitude': 'lon',
            'latitude': 'lat'
        }

        with transaction.atomic():
            for record in data:
                try:
                    # Map fields if needed
                    cleaned_record = {}
                    for key, value in record.items():
                        # Get the correct field name
                        field_name = field_mapping.get(key, key)
                        cleaned_record[field_name] = value
                    
                    # Check for required fields
                    if 'loc_id' not in cleaned_record:
                        raise ValueError("Location ID is required")
                    
                    # Handle type conversions
                    # Convert hst_days to integer
                    if 'hst_days' in cleaned_record and cleaned_record['hst_days'] not in (None, ''):
                        try:
                            cleaned_record['hst_days'] = int(cleaned_record['hst_days'])
                        except (ValueError, TypeError):
                            cleaned_record['hst_days'] = None
                    
                    # Convert hst_start to date format if it's a string
                    if 'hst_start' in cleaned_record and cleaned_record['hst_start'] and isinstance(cleaned_record['hst_start'], str):
                        try:
                            from datetime import datetime
                            date_formats = ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%d-%m-%Y', '%m-%d-%Y']
                            for fmt in date_formats:
                                try:
                                    date_obj = datetime.strptime(cleaned_record['hst_start'], fmt).date()
                                    cleaned_record['hst_start'] = date_obj
                                    break
                                except ValueError:
                                    continue
                            else:
                                # If no format works, leave as is (Django will handle conversion or error)
                                pass
                        except Exception:
                            # Keep as is, let Django handle it
                            pass
                    
                    # Check status value is valid
                    if 'status' in cleaned_record and cleaned_record['status']:
                        status_val = str(cleaned_record['status']).capitalize()
                        valid_statuses = [choice[0] for choice in WNTD.STATUS_CHOICES]
                        if status_val not in valid_statuses:
                            if status_val.lower() in ['homefast', 'home', 'home_fast', 'home fast']:
                                cleaned_record['status'] = 'HomeFast'
                            elif status_val.lower() in ['superfast', 'super_fast', 'super fast', 'super']:
                                cleaned_record['status'] = 'SuperFast'
                            elif status_val.lower() in ['failed', 'fail', 'error', 'failure']:
                                cleaned_record['status'] = 'Failed'
                            else:
                                cleaned_record['status'] = 'HomeFast'  # Default to HomeFast
                    
                    # Check if WNTD with this loc_id exists
                    wntd, created = WNTD.objects.get_or_create(
                        loc_id=cleaned_record['loc_id'],
                        defaults=cleaned_record
                    )
                    
                    if not created:
                        # Update existing record
                        for key, value in cleaned_record.items():
                            if hasattr(wntd, key) and key != 'loc_id':  # Skip changing the loc_id
                                setattr(wntd, key, value)
                        wntd.save()
                    
                    results['success'] += 1
                except Exception as e:
                    results['failed'] += 1
                    results['errors'].append({
                        'loc_id': record.get('loc_id', 'Unknown'),
                        'error': str(e)
                    })
                    continue

        return Response(results, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def csv_template(self, request):
        """
        Provide a CSV template for WNTD data import
        """
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="wntd_template.csv"'
        
        # Define fields for the template
        fields = [
            'FWP Engineer', 'Location ID', 'WNTD ID', 'IMSI', 'WNTD Version',
            'BW Profile', 'RSP', 'Site', 'Home Cell',
            'HST Start Date', 'HST Days', 'Issue', 'Status',
            'Action Owner', 'Opti Remarks'
        ]
        
        # Create writer and write header
        writer = csv.writer(response)
        writer.writerow(fields)
        
        # Add a sample row with example data
        sample_row = [
            'John Doe', 'LOC123', 'WNTD456', '123456789012345', '2.1.5',
            '100M', 'Provider X', 'Site A', 'CELL123',
            '2023-01-15', '30', 'Connection issues', 'HomeFast',
            'Jane Smith', 'Pending optimization'
        ]
        writer.writerow(sample_row)
        
        return response

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get WNTD statistics"""
        total_wntd = WNTD.objects.count()
        resolved = WNTD.objects.filter(status='Pass').count()
        in_progress = WNTD.objects.filter(status__in=['Under Testing', 'Under Opti']).count()
        pending = WNTD.objects.filter(status='Under Assurance').count()
        
        # Get recent WNTD reports
        recent_reports = WNTD.objects.order_by('-last_updated')[:5]
        recent_reports_data = WNTDSerializer(recent_reports, many=True).data

        # Get WNTDs by status
        status_breakdown = {}
        for status_choice in WNTD.STATUS_CHOICES:
            status_code = status_choice[0]
            status_breakdown[status_code] = WNTD.objects.filter(status=status_code).count()

        return Response({
            'total_wntd': total_wntd,
            'resolved': resolved,
            'in_progress': in_progress,
            'pending': pending,
            'status_breakdown': status_breakdown,
            'recent_reports': recent_reports_data,
        })
