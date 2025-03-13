from django.contrib import admin
from .models import Configuration, Tool, ToolUsageLog

# Register your models here.
@admin.register(Configuration)
class ConfigurationAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'updated_at')
    search_fields = ('key', 'value', 'description')
    date_hierarchy = 'updated_at'

class ToolUsageLogInline(admin.TabularInline):
    model = ToolUsageLog
    extra = 0
    readonly_fields = ('user', 'timestamp', 'notes')
    can_delete = False

@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'updated_at')
    search_fields = ('name', 'version', 'description')
    date_hierarchy = 'updated_at'
    inlines = [ToolUsageLogInline]

@admin.register(ToolUsageLog)
class ToolUsageLogAdmin(admin.ModelAdmin):
    list_display = ('tool', 'user', 'timestamp')
    list_filter = ('tool', 'user')
    search_fields = ('tool__name', 'user__username', 'notes')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)
