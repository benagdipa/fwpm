# Generated by Django 5.1.7 on 2025-03-13 07:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network_performance', '0001_initial'),
    ]

    operations = [
        migrations.RenameIndex(
            model_name='networkperformance',
            new_name='network_per_metrics_30d4d7_idx',
            old_name='network_per_metrics_06f4c6_idx',
        ),
        migrations.RenameIndex(
            model_name='networkperformance',
            new_name='network_per_metrics_b7baa5_idx',
            old_name='network_per_metrics_64ea23_idx',
        ),
        migrations.RenameIndex(
            model_name='networkperformance',
            new_name='network_per_site_31676b_idx',
            old_name='network_per_site_id_a5f8a7_idx',
        ),
    ]
