from rest_framework import serializers
from .models import NetworkPerformance

class NetworkPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkPerformance
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, data):
        """
        Custom validation for network performance metrics
        """
        # Validate percentage fields are between 0 and 100
        percentage_fields = [
            'cell_availability', 'erab_retainability', 
            'dl_prb_usage', 'ul_prb_usage'
        ]
        for field in percentage_fields:
            if field in data and data[field] is not None:
                if data[field] < 0 or data[field] > 100:
                    raise serializers.ValidationError(
                        f"{field} must be between 0 and 100"
                    )

        # Validate non-negative fields
        non_negative_fields = [
            'abnormal_release', 'erab_establishment_attempts',
            'erab_establishment_successes', 'avg_rrc_conn_ue',
            'avg_active_ue_dl', 'avg_active_ue_ul',
            'dl_cell_capacity', 'ul_cell_capacity',
            'dl_cell_throughput', 'ul_cell_throughput',
            'dl_ue_throughput', 'ul_ue_throughput',
            'pdcp_volume_dl', 'pdcp_volume_ul',
            'dl_latency'
        ]
        for field in non_negative_fields:
            if field in data and data[field] is not None:
                if data[field] < 0:
                    raise serializers.ValidationError(
                        f"{field} cannot be negative"
                    )

        # Validate establishment successes don't exceed attempts
        if ('erab_establishment_attempts' in data and 
            'erab_establishment_successes' in data):
            if (data['erab_establishment_successes'] > 
                data['erab_establishment_attempts']):
                raise serializers.ValidationError(
                    "Establishment successes cannot exceed attempts"
                )

        return data

class NetworkPerformanceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    class Meta:
        model = NetworkPerformance
        fields = (
            'metrics_date_local', 'site', 'cell_id',
            'cell_availability', 'dl_cell_throughput', 
            'ul_cell_throughput', 'dl_latency'
        )

class NetworkPerformanceAggregateSerializer(serializers.Serializer):
    """Serializer for aggregated metrics"""
    level = serializers.ChoiceField(choices=['network', 'site', 'cell'])
    time_granularity = serializers.ChoiceField(choices=['hour', 'day'])
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    metrics = serializers.DictField()

    def validate(self, data):
        """Validate date range"""
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError(
                "End date must be after start date"
            )
        return data 