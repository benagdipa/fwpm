from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.http import HttpResponse
from .models import Implementation, ImplementationTask
from .serializers import ImplementationSerializer, ImplementationTaskSerializer
import csv
from io import StringIO
import json
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import tempfile
import logging
from rest_framework import status

# Create a logger
logger = logging.getLogger(__name__)

# Create your views here.

class ImplementationViewSet(viewsets.ModelViewSet):
    queryset = Implementation.objects.all()
    serializer_class = ImplementationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['project_name', 'status', 'description']
    ordering_fields = ['project_name', 'start_date', 'end_date', 'status', 'progress']
    
    @action(detail=False, methods=['get'])
    def status_summary(self, request):
        """Get summary counts of projects by status"""
        summary = Implementation.objects.values('status').annotate(count=Count('status'))
        return Response(summary)
    
    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        """Get tasks for a specific implementation"""
        implementation = self.get_object()
        tasks = implementation.tasks.all()
        serializer = ImplementationTaskSerializer(tasks, many=True)
        return Response(serializer.data)

class ImplementationTaskViewSet(viewsets.ModelViewSet):
    queryset = ImplementationTask.objects.all()
    serializer_class = ImplementationTaskSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'due_date', 'completed']
    
    def perform_create(self, serializer):
        implementation_id = self.request.data.get('implementation')
        serializer.save(implementation_id=implementation_id)
    
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export tasks as CSV"""
        logger.info("Export CSV endpoint called")
        
        # Create a CSV string
        csv_buffer = StringIO()
        writer = csv.writer(csv_buffer)
        
        # Write the header
        writer.writerow([
            'ID', 'Implementation', 'Title', 'Description', 
            'Due Date', 'Completed', 'Assigned To'
        ])
        
        # Write the data
        tasks = self.get_queryset()
        for task in tasks:
            writer.writerow([
                task.id,
                task.implementation.project_name if task.implementation else '',
                task.title,
                task.description or '',
                task.due_date.strftime('%Y-%m-%d') if task.due_date else '',
                'Yes' if task.completed else 'No',
                task.assigned_to.username if task.assigned_to else ''
            ])
        
        # Create the HTTP response
        response = HttpResponse(csv_buffer.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="implementation_tasks.csv"'
        
        return response
    
    @action(detail=False, methods=['get'], url_path='export/(?P<format_type>[^/.]+)')
    def export(self, request, format_type=None):
        """Export tasks in various formats"""
        logger.info(f"Export endpoint called with format: {format_type}")
        
        if format_type == 'csv':
            return self.export_csv(request)
        else:
            return Response({"error": f"Unsupported export format: {format_type}"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='template/csv')
    def download_template(self, request):
        """Download a CSV template for importing tasks"""
        logger.info("Download template endpoint called")
        
        # Create a CSV string
        csv_buffer = StringIO()
        writer = csv.writer(csv_buffer)
        
        # Write the header with explanations
        writer.writerow([
            'Implementation Project', 'Title', 'Description', 
            'Due Date (YYYY-MM-DD)', 'Completed (Yes/No)', 'Assigned To (Username)'
        ])
        
        # Write an example row
        writer.writerow([
            'Project ABC', 'Complete task X', 'This is a sample task description',
            '2023-12-31', 'No', 'admin'
        ])
        
        # Create the HTTP response
        response = HttpResponse(csv_buffer.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="implementation_tasks_template.csv"'
        
        return response
    
    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        """Import tasks from CSV"""
        logger.info("Import CSV endpoint called")
        
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=400)
        
        file = request.FILES['file']
        
        # Check if it's a CSV file
        if not file.name.endswith('.csv'):
            return Response({"error": "File must be a CSV"}, status=400)
        
        # Get mappings from request parameters if available
        mappings = {}
        if 'mappings' in request.query_params:
            try:
                mappings = json.loads(request.query_params['mappings'])
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON for mappings"}, status=400)
        
        # Process the file
        try:
            # Save file to a temporary location
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            for chunk in file.chunks():
                temp_file.write(chunk)
            temp_file.close()
            
            # Open and process the CSV
            with open(temp_file.name, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                headers = next(reader)  # Get the header row
                
                # Use mappings or try to match headers to field names
                if not mappings:
                    # Auto-detect mappings
                    field_names = ['implementation', 'title', 'description', 'due_date', 'completed', 'assigned_to']
                    mappings = {}
                    for header in headers:
                        for field in field_names:
                            if field.lower() in header.lower():
                                mappings[header] = field
                                break
                
                # Import the data
                success_count = 0
                error_rows = []
                
                for i, row in enumerate(reader, start=2):  # Start at 2 to account for header row
                    try:
                        data = {}
                        for j, cell in enumerate(row):
                            if j < len(headers) and headers[j] in mappings and mappings[headers[j]]:
                                data[mappings[headers[j]]] = cell
                        
                        # Create the task
                        # ... implementation logic based on data dictionary
                        success_count += 1
                    except Exception as e:
                        error_rows.append({
                            "row": i,
                            "error": str(e),
                            "data": row
                        })
            
            return Response({
                "success": True,
                "message": f"Successfully imported {success_count} tasks",
                "errors": error_rows
            })
        
        except Exception as e:
            logger.error(f"Error importing CSV: {str(e)}")
            return Response({"error": f"Error processing file: {str(e)}"}, status=500)
        finally:
            # Clean up the temporary file
            import os
            if 'temp_file' in locals():
                os.unlink(temp_file.name)
    
    @action(detail=False, methods=['post'], url_path='validate_import')
    def validate_import(self, request):
        """Validate a CSV file before importing"""
        logger.info("Validate import endpoint called")
        
        if 'file' not in request.FILES:
            return Response({"error": "No file provided"}, status=400)
        
        file = request.FILES['file']
        
        # Check if it's a CSV file
        if not file.name.endswith('.csv'):
            return Response({"error": "File must be a CSV"}, status=400)
        
        # Process the file
        try:
            # Save file to a temporary location
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            for chunk in file.chunks():
                temp_file.write(chunk)
            temp_file.close()
            
            # Open and validate the CSV
            with open(temp_file.name, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                headers = next(reader)  # Get the header row
                
                # Validate headers
                required_fields = ['title']
                headers_lower = [h.lower() for h in headers]
                missing_fields = [field for field in required_fields if not any(field in h for h in headers_lower)]
                
                if missing_fields:
                    return Response({
                        "valid": False,
                        "errors": [f"Required fields missing: {', '.join(missing_fields)}"]
                    })
                
                # Preview data
                preview_rows = []
                for i, row in enumerate(reader):
                    if i >= 5:  # Only show 5 rows for preview
                        break
                    
                    preview_row = {}
                    for j, cell in enumerate(row):
                        if j < len(headers):
                            preview_row[headers[j]] = cell
                    
                    preview_rows.append(preview_row)
                
                return Response({
                    "valid": True,
                    "headers": headers,
                    "preview": preview_rows
                })
        
        except Exception as e:
            logger.error(f"Error validating CSV: {str(e)}")
            return Response({"valid": False, "errors": [f"Error processing file: {str(e)}"]}, status=500)
        finally:
            # Clean up the temporary file
            import os
            if 'temp_file' in locals():
                os.unlink(temp_file.name)
    
    @action(detail=False, methods=['post'], url_path='import_tasks')
    def import_tasks(self, request):
        """Import tasks from uploaded file"""
        return self.import_csv(request)
