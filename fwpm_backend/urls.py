"""
URL configuration for fwpm_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from fwpm_backend.apps.api_views import health_check
from fwpm_backend.apps.authentication.views import AuthViewSet
from fwpm_backend.apps.user_management.views import UserManagementViewSet
from fwpm_backend.apps.network_performance.views import NetworkPerformanceViewSet
from fwpm_backend.apps.wntd_tracker.views import WNTDViewSet
from fwpm_backend.apps.implementation_tracker.views import ImplementationViewSet, ImplementationTaskViewSet
from fwpm_backend.apps.config_tools_manager.views import ConfigurationViewSet, ToolViewSet, ToolUsageLogViewSet

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'users', UserManagementViewSet)
router.register(r'network-performance', NetworkPerformanceViewSet)
router.register(r'wntd', WNTDViewSet)
router.register(r'implementations', ImplementationViewSet)
router.register(r'implementation-tasks', ImplementationTaskViewSet)
router.register(r'configurations', ConfigurationViewSet)
router.register(r'tools', ToolViewSet)
router.register(r'tool-usage-logs', ToolUsageLogViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/health-check/', health_check, name='health_check'),
    path('api/auth/email-login/', AuthViewSet.as_view({'post': 'email_login'}), name='email_login'),
    path('api-auth/', include('rest_framework.urls')),
]
