# Generated manually on 2025-03-15

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='WNTD',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                # Basic information
                ('loc_id', models.CharField(max_length=50, unique=True, verbose_name='Location ID')),
                ('wntd_id', models.CharField(max_length=50, verbose_name='WNTD ID')),
                ('imsi', models.CharField(max_length=20, verbose_name='IMSI')),
                
                # Technical details
                ('wntd_version', models.CharField(max_length=20, verbose_name='WNTD Version')),
                ('bw_profile', models.CharField(blank=True, max_length=50, null=True, verbose_name='BW Profile')),
                ('solution_type', models.CharField(default='Fixed', max_length=50, verbose_name='Solution Type')),
                
                # Location information
                ('lon', models.FloatField(blank=True, null=True, verbose_name='Longitude')),
                ('lat', models.FloatField(blank=True, null=True, verbose_name='Latitude')),
                ('site_name', models.CharField(max_length=100, verbose_name='Site')),
                
                # Cell information
                ('utran_cell_id', models.CharField(blank=True, max_length=50, null=True, verbose_name='Home Cell')),
                ('home_pci', models.CharField(blank=True, max_length=50, null=True, verbose_name='Home PCI')),
                
                # Status and ownership
                ('status', models.CharField(choices=[('HomeFast', 'HomeFast'), ('SuperFast', 'SuperFast'), ('Failed', 'Failed')], default='HomeFast', max_length=20, verbose_name='Status')),
                ('owner', models.CharField(blank=True, max_length=100, null=True, verbose_name='FWP Engineer')),
                ('action_owner', models.CharField(blank=True, max_length=100, null=True, verbose_name='Action Owner')),
                ('rsp', models.CharField(blank=True, max_length=100, null=True, verbose_name='RSP')),
                
                # HST information
                ('hst_start', models.DateField(blank=True, null=True, verbose_name='HST Start Date')),
                ('hst_days', models.IntegerField(blank=True, null=True, verbose_name='HST Days')),
                
                # Issue and remarks
                ('issue', models.TextField(blank=True, null=True, verbose_name='Issue')),
                ('findings', models.TextField(blank=True, null=True, verbose_name='Findings')),
                ('remarks', models.TextField(blank=True, null=True, verbose_name='Opti Remarks')),
                
                # System fields
                ('avc', models.CharField(blank=True, max_length=50, null=True, verbose_name='AVC')),
                ('last_updated', models.DateTimeField(auto_now=True, verbose_name='Last Updated')),
            ],
        ),
        migrations.CreateModel(
            name='WNTDHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('changed_fields', models.TextField()),
                ('old_values', models.TextField()),
                ('new_values', models.TextField()),
                ('modified_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('wntd', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='wntd_tracker.wntd')),
            ],
            options={
                'verbose_name_plural': 'WNTD histories',
                'ordering': ['-timestamp'],
            },
        ),
    ] 