from django.contrib import admin
from .models import UserProfile

# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'department', 'date_modified')
    list_filter = ('role', 'department')
    search_fields = ('user__username', 'user__email')
