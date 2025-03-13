from django.contrib import admin
from .models import WNTD, WNTDHistory

@admin.register(WNTD)
class WNTDAdmin(admin.ModelAdmin):
    list_display = ('loc_id', 'wntd_id', 'site_name', 'owner', 'status', 'wntd_version', 'solution_type', 'last_updated')
    list_filter = ('status', 'solution_type', 'owner', 'rsp')
    search_fields = ('loc_id', 'wntd_id', 'site_name', 'imsi', 'owner')
    readonly_fields = ('last_updated',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('loc_id', 'wntd_id', 'site_name', 'status', 'solution_type', 'owner', 'rsp')
        }),
        ('Technical Details', {
            'fields': ('imsi', 'wntd_version', 'avc', 'bw_profile', 'utran_cell_id', 'home_pci')
        }),
        ('Location', {
            'fields': ('lat', 'lon')
        }),
        ('HST Information', {
            'fields': ('hst_start', 'hst_days', 'findings')
        }),
        ('Additional Information', {
            'fields': ('remarks', 'last_updated')
        })
    )

@admin.register(WNTDHistory)
class WNTDHistoryAdmin(admin.ModelAdmin):
    list_display = ('wntd', 'timestamp', 'changed_fields')
    list_filter = ('timestamp',)
    search_fields = ('wntd__loc_id', 'wntd__site_name', 'changed_fields')
    readonly_fields = ('wntd', 'timestamp', 'changed_fields', 'old_values', 'new_values', 'modified_by')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
