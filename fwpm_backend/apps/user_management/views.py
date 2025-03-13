from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from fwpm_backend.apps.authentication.serializers import UserSerializer
from fwpm_backend.apps.authentication.models import UserProfile

class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'userprofile') and request.user.userprofile.role == 'admin'

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined']
    
    @action(detail=True, methods=['post'])
    def set_role(self, request, pk=None):
        """Set the role of a user (admin or user)"""
        user = self.get_object()
        role = request.data.get('role')
        
        if role not in ['admin', 'user']:
            return Response({'error': 'Invalid role. Must be "admin" or "user".'}, status=400)
        
        profile = UserProfile.objects.get(user=user)
        profile.role = role
        profile.save()
        
        return Response({'success': f'Role updated to {role}'})
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user account"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'success': 'User activated'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user account"""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'success': 'User deactivated'})
