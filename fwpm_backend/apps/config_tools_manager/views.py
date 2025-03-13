from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Configuration, Tool, ToolUsageLog
from .serializers import ConfigurationSerializer, ToolSerializer, ToolUsageLogSerializer

# Create your views here.

class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['key', 'value', 'description']
    ordering_fields = ['key', 'created_at', 'updated_at']

class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'version', 'description']
    ordering_fields = ['name', 'version', 'created_at', 'updated_at']
    
    @action(detail=True, methods=['post'])
    def log_usage(self, request, pk=None):
        """Log usage of a tool by the current user"""
        tool = self.get_object()
        log = ToolUsageLog.objects.create(
            tool=tool,
            user=request.user,
            notes=request.data.get('notes', '')
        )
        serializer = ToolUsageLogSerializer(log)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def usage_history(self, request, pk=None):
        """Get usage history for a specific tool"""
        tool = self.get_object()
        logs = tool.usages.all().order_by('-timestamp')
        serializer = ToolUsageLogSerializer(logs, many=True)
        return Response(serializer.data)

class ToolUsageLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ToolUsageLog.objects.all().order_by('-timestamp')
    serializer_class = ToolUsageLogSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['tool__name', 'user__username', 'notes']
    ordering_fields = ['timestamp', 'tool__name', 'user__username']
    
    def get_queryset(self):
        """Filter logs to only show those created by the current user unless admin"""
        user = self.request.user
        if hasattr(user, 'userprofile') and user.userprofile.role == 'admin':
            return ToolUsageLog.objects.all().order_by('-timestamp')
        return ToolUsageLog.objects.filter(user=user).order_by('-timestamp')
