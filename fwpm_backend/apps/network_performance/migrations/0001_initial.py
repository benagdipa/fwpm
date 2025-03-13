# Generated manually on 2025-03-15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NetworkPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                # Core fields
                ('metrics_date_local', models.DateTimeField(db_index=True)),
                ('site', models.CharField(db_index=True, max_length=100)),
                ('cell_id', models.CharField(db_index=True, max_length=100)),
                
                # Performance Metrics
                ('cell_availability', models.FloatField(null=True)),
                ('abnormal_release', models.FloatField(null=True)),
                ('erab_retainability', models.FloatField(null=True)),
                ('erab_establishment_attempts', models.IntegerField(null=True)),
                ('erab_establishment_successes', models.IntegerField(null=True)),
                ('avg_rrc_conn_ue', models.FloatField(null=True)),
                ('avg_active_ue_dl', models.FloatField(null=True)),
                ('avg_active_ue_ul', models.FloatField(null=True)),
                ('dl_cell_capacity', models.FloatField(null=True)),
                ('ul_cell_capacity', models.FloatField(null=True)),
                ('dl_cell_throughput', models.FloatField(null=True)),
                ('ul_cell_throughput', models.FloatField(null=True)),
                ('dl_ue_throughput', models.FloatField(null=True)),
                ('ul_ue_throughput', models.FloatField(null=True)),
                ('pdcp_volume_dl', models.FloatField(null=True)),
                ('pdcp_volume_ul', models.FloatField(null=True)),
                ('dl_prb_usage', models.FloatField(null=True)),
                ('ul_prb_usage', models.FloatField(null=True)),
                ('dl_latency', models.FloatField(null=True)),
                
                # Meta fields
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Network Performance Metric',
                'verbose_name_plural': 'Network Performance Metrics',
                'ordering': ['-metrics_date_local'],
            },
        ),
        migrations.AddIndex(
            model_name='networkperformance',
            index=models.Index(fields=['metrics_date_local', 'site'], name='network_per_metrics_06f4c6_idx'),
        ),
        migrations.AddIndex(
            model_name='networkperformance',
            index=models.Index(fields=['metrics_date_local', 'cell_id'], name='network_per_metrics_64ea23_idx'),
        ),
        migrations.AddIndex(
            model_name='networkperformance',
            index=models.Index(fields=['site', 'cell_id'], name='network_per_site_id_a5f8a7_idx'),
        ),
    ] 