from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class WNTD(models.Model):
    STATUS_CHOICES = [
        ('Pass', 'Pass'),
        ('Under Testing', 'Under Testing'),
        ('Under Opti', 'Under Opti'),
        ('Under Assurance', 'Under Assurance'),
        ('Products', 'Products'),
        ('Fail', 'Fail'),
    ]

    # Basic information
    loc_id = models.CharField(max_length=50, unique=True, verbose_name="Location ID")
    wntd_id = models.CharField(max_length=50, verbose_name="WNTD ID")
    imsi = models.CharField(max_length=20, verbose_name="IMSI")
    
    # Technical details
    wntd_version = models.CharField(max_length=20, verbose_name="WNTD Version")
    bw_profile = models.CharField(max_length=50, blank=True, null=True, verbose_name="BW Profile")
    solution_type = models.CharField(max_length=50, verbose_name="Solution Type", default="Fixed")
    
    # Location information
    lon = models.FloatField(null=True, blank=True, verbose_name="Longitude")
    lat = models.FloatField(null=True, blank=True, verbose_name="Latitude")
    site_name = models.CharField(max_length=100, verbose_name="Site")
    
    # Cell information
    utran_cell_id = models.CharField(max_length=50, blank=True, null=True, verbose_name="Home Cell")
    home_pci = models.CharField(max_length=50, blank=True, null=True, verbose_name="Home PCI")
    
    # Status and ownership
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='HomeFast', verbose_name="Status")
    owner = models.CharField(max_length=100, blank=True, null=True, verbose_name="FWP Engineer")
    action_owner = models.CharField(max_length=100, blank=True, null=True, verbose_name="Action Owner")
    rsp = models.CharField(max_length=100, blank=True, null=True, verbose_name="RSP")
    
    # HST information
    hst_start = models.DateField(null=True, blank=True, verbose_name="HST Start Date")
    hst_days = models.IntegerField(null=True, blank=True, verbose_name="HST Days")
    
    # Issue and remarks
    issue = models.TextField(blank=True, null=True, verbose_name="Issue")
    findings = models.TextField(blank=True, null=True, verbose_name="Findings")
    remarks = models.TextField(blank=True, null=True, verbose_name="Opti Remarks")
    
    # System fields
    avc = models.CharField(max_length=50, blank=True, null=True, verbose_name="AVC")
    last_updated = models.DateTimeField(auto_now=True, verbose_name="Last Updated")
    
    def __str__(self):
        return f"WNTD {self.loc_id} - {self.site_name}"
    
    def save(self, *args, **kwargs):
        # Create history entry before saving
        if self.pk:  # If this is an update
            old_instance = WNTD.objects.get(pk=self.pk)
            changed_fields = []
            for field in self._meta.fields:
                if getattr(old_instance, field.name) != getattr(self, field.name):
                    changed_fields.append(field.name)
            
            if changed_fields:  # Only create history if there are changes
                history = WNTDHistory(
                    wntd=self,
                    changed_fields=", ".join(changed_fields),
                    old_values=", ".join(f"{f}: {getattr(old_instance, f)}" for f in changed_fields),
                    new_values=", ".join(f"{f}: {getattr(self, f)}" for f in changed_fields)
                )
                history.save()
        
        super().save(*args, **kwargs)

class WNTDHistory(models.Model):
    wntd = models.ForeignKey(WNTD, on_delete=models.CASCADE, related_name='history')
    timestamp = models.DateTimeField(default=timezone.now)
    changed_fields = models.TextField()
    old_values = models.TextField()
    new_values = models.TextField()
    modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'WNTD histories'
    
    def __str__(self):
        return f"Change to {self.wntd.loc_id} at {self.timestamp}"
