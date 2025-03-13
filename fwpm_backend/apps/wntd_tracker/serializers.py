from rest_framework import serializers
from .models import WNTD, WNTDHistory
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class WNTDHistorySerializer(serializers.ModelSerializer):
    modified_by = UserSerializer(read_only=True)
    
    class Meta:
        model = WNTDHistory
        fields = ['timestamp', 'changed_fields', 'old_values', 'new_values', 'modified_by']

class WNTDSerializer(serializers.ModelSerializer):
    history = WNTDHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = WNTD
        fields = [
            'id', 'owner', 'loc_id', 'wntd_id', 'imsi', 'wntd_version', 'bw_profile',
            'rsp', 'site_name', 'utran_cell_id', 'hst_start', 'hst_days', 
            'issue', 'status', 'action_owner', 'remarks', 'last_updated', 'history'
        ]
        read_only_fields = ['last_updated'] 