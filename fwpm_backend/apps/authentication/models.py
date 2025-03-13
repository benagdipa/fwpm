from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('super-admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('engineer', 'Engineer'),
        ('user', 'User'),
    ]
    
    DEPARTMENT_CHOICES = [
        ('management', 'Management'),
        ('engineering', 'Engineering'),
        ('operations', 'Operations'),
        ('support', 'Support'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES, default='other')
    date_modified = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.role})"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Hardcode user "timpheb" as super-admin
    if instance.username == "timpheb":
        instance.userprofile.role = "super-admin"
        instance.userprofile.department = "management"  # Optional: set a default department
    
    instance.userprofile.save()
