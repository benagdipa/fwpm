from django.conf import settings

# Cache settings
CACHE_TIMEOUT = getattr(settings, 'NETWORK_PERF_CACHE_TIMEOUT', 3600)  # 1 hour
CACHE_PREFIX = getattr(settings, 'NETWORK_PERF_CACHE_PREFIX', 'network_perf')

# Query settings
MAX_QUERY_DAYS = getattr(settings, 'NETWORK_PERF_MAX_QUERY_DAYS', 31)
CHUNK_SIZE = getattr(settings, 'NETWORK_PERF_CHUNK_SIZE', 1000)
DB_BATCH_SIZE = getattr(settings, 'NETWORK_PERF_DB_BATCH_SIZE', 100)

# Celery task settings
METRICS_RETENTION_DAYS = getattr(settings, 'NETWORK_PERF_RETENTION_DAYS', 90)
FETCH_METRICS_RETRY_DELAY = getattr(settings, 'NETWORK_PERF_FETCH_RETRY_DELAY', 300)  # 5 minutes
MAX_RETRIES = getattr(settings, 'NETWORK_PERF_MAX_RETRIES', 3)

# Pagination settings
PAGE_SIZE = getattr(settings, 'NETWORK_PERF_PAGE_SIZE', 50)
MAX_PAGE_SIZE = getattr(settings, 'NETWORK_PERF_MAX_PAGE_SIZE', 1000)

# Starburst connection pool settings
POOL_SIZE = getattr(settings, 'NETWORK_PERF_POOL_SIZE', 10)
POOL_TIMEOUT = getattr(settings, 'NETWORK_PERF_POOL_TIMEOUT', 30)
QUERY_TIMEOUT = getattr(settings, 'NETWORK_PERF_QUERY_TIMEOUT', 300)  # 5 minutes

# Redis settings
REDIS_URL = getattr(settings, 'NETWORK_PERF_REDIS_URL', 'redis://127.0.0.1:6379')
REDIS_DB = getattr(settings, 'NETWORK_PERF_REDIS_DB', 1)
REDIS_PASSWORD = getattr(settings, 'NETWORK_PERF_REDIS_PASSWORD', None)

# Logging settings
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': getattr(settings, 'NETWORK_PERF_LOG_FILE', 'network_performance.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'network_performance': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
} 