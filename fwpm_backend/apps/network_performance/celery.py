from celery import Celery
from django.conf import settings
from datetime import timedelta
from . import settings as app_settings

app = Celery('network_performance')

# Configure Celery using our settings
app.conf.update(
    broker_url=app_settings.REDIS_URL,
    result_backend=app_settings.REDIS_URL,
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour
    worker_max_tasks_per_child=1000,
    worker_prefetch_multiplier=1,
)

# Configure the Celery beat schedule
app.conf.beat_schedule = {
    'fetch-metrics': {
        'task': 'network_performance.tasks.fetch_and_store_metrics',
        'schedule': timedelta(minutes=15),
        'options': {'expires': 900}  # 15 minutes
    },
    'refresh-cache': {
        'task': 'network_performance.tasks.refresh_cache',
        'schedule': timedelta(hours=1),
        'options': {'expires': 3600}  # 1 hour
    },
    'cleanup-old-metrics': {
        'task': 'network_performance.tasks.cleanup_old_metrics',
        'schedule': timedelta(days=1),
        'kwargs': {'days': app_settings.METRICS_RETENTION_DAYS},
        'options': {'expires': 86400}  # 24 hours
    },
}

# Auto-discover tasks in all installed apps
app.autodiscover_tasks() 