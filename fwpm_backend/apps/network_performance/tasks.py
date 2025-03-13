import logging
from celery import shared_task
from django.core.cache import cache
from django.db import transaction
from datetime import datetime, timedelta
import pandas as pd
from .models import NetworkPerformance
from .starburst_connector import execute_query, LTE_QUERY, NR_QUERY

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def fetch_and_store_metrics(self, start_date=None, end_date=None, site=None):
    """
    Fetch metrics from Starburst and store in database
    """
    try:
        # Set default date range if not provided
        if not start_date:
            start_date = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        # Prepare query parameters
        params = {
            'StartDate': start_date,
            'EndDate': end_date
        }
        if site:
            params['SITE'] = site
        
        # Execute query
        df = execute_query(LTE_QUERY, params)
        
        if df.empty:
            logger.warning(f"No data found for period {start_date} to {end_date}")
            return
        
        # Process data in chunks to avoid memory issues
        chunk_size = 1000
        for i in range(0, len(df), chunk_size):
            chunk_df = df.iloc[i:i+chunk_size]
            
            # Prepare bulk create data
            metrics = []
            for _, row in chunk_df.iterrows():
                metric = NetworkPerformance(
                    metrics_date_local=row['metrics_date_local'],
                    site=row['site'],
                    cell_id=row['cell_id'],
                    cell_availability=row.get('cell_availability'),
                    abnormal_release=row.get('abnormal_release'),
                    erab_retainability=row.get('erab_retainability'),
                    erab_establishment_attempts=row.get('erab_establishment_attempts'),
                    erab_establishment_successes=row.get('erab_establishment_successes'),
                    avg_rrc_conn_ue=row.get('avg_rrc_conn_ue'),
                    avg_active_ue_dl=row.get('avg_active_ue_dl'),
                    avg_active_ue_ul=row.get('avg_active_ue_ul'),
                    dl_cell_capacity=row.get('dl_cell_capacity'),
                    ul_cell_capacity=row.get('ul_cell_capacity'),
                    dl_cell_throughput=row.get('dl_cell_throughput'),
                    ul_cell_throughput=row.get('ul_cell_throughput'),
                    dl_ue_throughput=row.get('dl_ue_throughput'),
                    ul_ue_throughput=row.get('ul_ue_throughput'),
                    pdcp_volume_dl=row.get('pdcp_volume_dl'),
                    pdcp_volume_ul=row.get('pdcp_volume_ul'),
                    dl_prb_usage=row.get('dl_prb_usage'),
                    ul_prb_usage=row.get('ul_prb_usage'),
                    dl_latency=row.get('dl_latency')
                )
                metrics.append(metric)
            
            # Bulk create metrics
            with transaction.atomic():
                NetworkPerformance.objects.bulk_create(
                    metrics,
                    batch_size=100,
                    ignore_conflicts=True
                )
        
        # Invalidate relevant caches
        cache_patterns = [
            "network_perf:*",
            f"network_perf:{site}:*" if site else None
        ]
        for pattern in cache_patterns:
            if pattern:
                cache.delete_pattern(pattern)
        
        logger.info(f"Successfully processed {len(df)} metrics")
        return len(df)
        
    except Exception as e:
        logger.error(f"Error in fetch_and_store_metrics: {str(e)}")
        raise self.retry(exc=e)

@shared_task
def cleanup_old_metrics(days=90):
    """
    Remove metrics older than specified days
    """
    try:
        cutoff_date = datetime.now() - timedelta(days=days)
        deleted_count = NetworkPerformance.objects.filter(
            metrics_date_local__lt=cutoff_date
        ).delete()
        
        logger.info(f"Deleted {deleted_count} old metrics")
        return deleted_count
    except Exception as e:
        logger.error(f"Error in cleanup_old_metrics: {str(e)}")
        raise

@shared_task
def refresh_cache():
    """
    Refresh commonly accessed cache entries
    """
    try:
        # Get active sites
        sites = NetworkPerformance.objects.values_list(
            'site', flat=True
        ).distinct()
        
        # Refresh cache for each site
        for site in sites:
            NetworkPerformance.get_cached_metrics(
                site=site,
                start_date=datetime.now() - timedelta(days=7)
            )
        
        logger.info(f"Successfully refreshed cache for {len(sites)} sites")
        return len(sites)
    except Exception as e:
        logger.error(f"Error in refresh_cache: {str(e)}")
        raise 