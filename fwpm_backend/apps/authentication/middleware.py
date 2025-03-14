from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from .models import UserProfile

class SuperAdminMiddleware(MiddlewareMixin):
    """
    Middleware that ensures specific users always have super-admin role:
    - timpheb (username)
    - benedickagdipa1@nbnco.com.au (email)
    """
    
    def process_request(self, request):
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return None
            
        if request.user.username == "timpheb" or request.user.email == "benedickagdipa1@nbnco.com.au":
            # Get or create user profile if it doesn't exist
            try:
                profile = UserProfile.objects.get(user=request.user)
                if profile.role != "super-admin":
                    profile.role = "super-admin"
                    profile.department = "management"
                    profile.save()
            except UserProfile.DoesNotExist:
                profile = UserProfile.objects.create(
                    user=request.user,
                    role="super-admin",
                    department="management"
                )
                
        return None 