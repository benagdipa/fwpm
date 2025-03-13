from django.contrib import admin
from .models import Implementation, ImplementationTask

# Register your models here.
class ImplementationTaskInline(admin.TabularInline):
    model = ImplementationTask
    extra = 1

@admin.register(Implementation)
class ImplementationAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'status', 'progress', 'start_date', 'end_date', 'project_manager')
    list_filter = ('status', 'project_manager')
    search_fields = ('project_name', 'description')
    date_hierarchy = 'start_date'
    inlines = [ImplementationTaskInline]

@admin.register(ImplementationTask)
class ImplementationTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'implementation', 'due_date', 'completed', 'assigned_to')
    list_filter = ('completed', 'implementation', 'assigned_to')
    search_fields = ('title', 'description', 'implementation__project_name')
    date_hierarchy = 'due_date'
