from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from fwpm_backend.apps.authentication.models import UserProfile

class Command(BaseCommand):
    help = 'Ensures the user "timpheb" exists and has super-admin role.'

    def handle(self, *args, **kwargs):
        username = "timpheb"
        email = "timpheb@example.com"  # You can change this to the actual email if needed
        password = "superadminpass"  # You can change this to a secure password

        # Check if user exists
        try:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.SUCCESS(f'User "{username}" already exists.'))
        except User.DoesNotExist:
            # Create user if it doesn't exist
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'Created user "{username}".'))
        
        # Ensure user has super-admin privileges
        profile = UserProfile.objects.get(user=user)
        if profile.role != "super-admin":
            profile.role = "super-admin"
            profile.department = "management"
            profile.save()
            self.stdout.write(self.style.SUCCESS(f'Set "{username}" as super-admin.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'User "{username}" is already a super-admin.'))

        # Make sure the user is a staff and superuser in Django's auth system too
        if not user.is_staff or not user.is_superuser:
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Set "{username}" as staff and superuser.'))
            
        self.stdout.write(self.style.SUCCESS('Super-admin user setup complete!')) 