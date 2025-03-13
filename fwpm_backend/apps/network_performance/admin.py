from django.contrib import admin
from .models import NetworkPerformance

# Register your models here.
@admin.register(NetworkPerformance)
class NetworkPerformanceAdmin(admin.ModelAdmin):
    list_display = (
        'metrics_date_local', 'site', 'cell_id', 
        'cell_availability', 'dl_cell_throughput', 
        'ul_cell_throughput', 'dl_latency'
    )
    list_filter = (
        'site', 
        'is_active',
        ('metrics_date_local', admin.DateFieldListFilter),
    )
    search_fields = ('site', 'cell_id')
    date_hierarchy = 'metrics_date_local'
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('metrics_date_local', 'site', 'cell_id', 'is_active')
        }),
        ('Performance Metrics', {
            'fields': (
                'cell_availability', 'abnormal_release', 'erab_retainability',
                'erab_establishment_attempts', 'erab_establishment_successes'
            )
        }),
        ('User Equipment Metrics', {
            'fields': (
                'avg_rrc_conn_ue', 'avg_active_ue_dl', 'avg_active_ue_ul'
            )
        }),
        ('Throughput and Capacity', {
            'fields': (
                'dl_cell_capacity', 'ul_cell_capacity',
                'dl_cell_throughput', 'ul_cell_throughput',
                'dl_ue_throughput', 'ul_ue_throughput'
            )
        }),
        ('Volume and Usage', {
            'fields': (
                'pdcp_volume_dl', 'pdcp_volume_ul',
                'dl_prb_usage', 'ul_prb_usage'
            )
        }),
        ('Latency', {
            'fields': ('dl_latency',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view"""
        return super().get_queryset(request).select_related()
