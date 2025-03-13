from django.db import models
from django.contrib.auth.models import User

class Implementation(models.Model):
    project_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('planned', 'Planned'), 
        ('in_progress', 'In Progress'), 
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled')
    ])
    progress = models.IntegerField(default=0)  # percentage
    description = models.TextField(blank=True, null=True)
    project_manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_projects')
    
    def __str__(self):
        return f"{self.project_name} ({self.status})"

class ImplementationTask(models.Model):
    implementation = models.ForeignKey(Implementation, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} ({'Completed' if self.completed else 'Pending'})"
