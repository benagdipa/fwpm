from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Configuration, Tool, ToolUsageLog

class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class ToolUsageLogSerializer(serializers.ModelSerializer):
    tool = ToolSerializer(read_only=True)
    tool_id = serializers.PrimaryKeyRelatedField(
        queryset=Tool.objects.all(),
        source='tool',
        write_only=True
    )
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ToolUsageLog
        fields = '__all__'
        read_only_fields = ['timestamp', 'user'] 