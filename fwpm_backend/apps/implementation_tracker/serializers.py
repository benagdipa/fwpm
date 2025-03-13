from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Implementation, ImplementationTask

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class ImplementationTaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='assigned_to', 
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = ImplementationTask
        fields = '__all__'
        read_only_fields = ['implementation']

class ImplementationSerializer(serializers.ModelSerializer):
    tasks = ImplementationTaskSerializer(many=True, read_only=True)
    project_manager = UserSerializer(read_only=True)
    project_manager_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='project_manager', 
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Implementation
        fields = '__all__' 