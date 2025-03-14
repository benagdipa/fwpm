from django.db import models
from django.core.cache import cache
from datetime import datetime

# Create your models here.

class NetworkPerformance(models.Model):
    metrics_date_local = models.DateTimeField(db_index=True)
    site = models.CharField(max_length=100, db_index=True)
    cell_id = models.CharField(max_length=100, db_index=True)
    
    # Performance Metrics
    cell_availability = models.FloatField(null=True)
    abnormal_release = models.FloatField(null=True)
    erab_retainability = models.FloatField(null=True)
    erab_establishment_attempts = models.IntegerField(null=True)
    erab_establishment_successes = models.IntegerField(null=True)
    avg_rrc_conn_ue = models.FloatField(null=True)
    avg_active_ue_dl = models.FloatField(null=True)
    avg_active_ue_ul = models.FloatField(null=True)
    dl_cell_capacity = models.FloatField(null=True)
    ul_cell_capacity = models.FloatField(null=True)
    dl_cell_throughput = models.FloatField(null=True)
    ul_cell_throughput = models.FloatField(null=True)
    dl_ue_throughput = models.FloatField(null=True)
    ul_ue_throughput = models.FloatField(null=True)
    pdcp_volume_dl = models.FloatField(null=True)
    pdcp_volume_ul = models.FloatField(null=True)
    dl_prb_usage = models.FloatField(null=True)
    ul_prb_usage = models.FloatField(null=True)
    dl_latency = models.FloatField(null=True)
    
    # Meta fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['metrics_date_local', 'site']),
            models.Index(fields=['metrics_date_local', 'cell_id']),
            models.Index(fields=['site', 'cell_id']),
        ]
        ordering = ['-metrics_date_local']
        verbose_name = 'Network Performance Metric'
        verbose_name_plural = 'Network Performance Metrics'

    def __str__(self):
        return f"{self.site} - {self.cell_id} - {self.metrics_date_local}"

    @classmethod
    def get_cached_metrics(cls, site=None, cell_id=None, start_date=None, end_date=None):
        """Get metrics with caching"""
        cache_key = f"network_perf:{site}:{cell_id}:{start_date}:{end_date}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        queryset = cls.objects.filter(is_active=True)
        if site:
            queryset = queryset.filter(site=site)
        if cell_id:
            queryset = queryset.filter(cell_id=cell_id)
        if start_date:
            queryset = queryset.filter(metrics_date_local__gte=start_date)
        if end_date:
            queryset = queryset.filter(metrics_date_local__lte=end_date)
        
        data = list(queryset.values())
        cache.set(cache_key, data, timeout=3600)  # Cache for 1 hour
        return data

    def save(self, *args, **kwargs):
        """Override save to handle cache invalidation"""
        # Invalidate relevant caches - use direct cache keys instead of patterns
        # since Django's default cache backend doesn't support delete_pattern
        
        # Clear site-specific caches
        site_key = f"network_perf:{self.site}:{self.cell_id}:*"
        for key in [
            f"network_perf:{self.site}:{self.cell_id}:None:None",
            f"network_perf:{self.site}:None:None:None",
            f"network_perf:None:{self.cell_id}:None:None",
        ]:
            cache.delete(key)
        
        # Call the original save method
        super().save(*args, **kwargs)
