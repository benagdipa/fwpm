from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import UserProfile
from .serializers import UserSerializer, LoginSerializer, UserProfileSerializer, EmailLoginSerializer

# Create your views here.

class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'login':
            return LoginSerializer
        elif self.action == 'email_login':
            return EmailLoginSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action in ['login', 'register', 'email_login']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Set role and department if provided
            profile = UserProfile.objects.get(user=user)
            role_data = {}
            
            # Only super-admin and admin can set specific roles
            if 'role' in request.data:
                # If user is authenticated and has permissions
                if request.user.is_authenticated and request.user.userprofile.role in ['super-admin', 'admin']:
                    # Super-admin role can only be assigned by another super-admin
                    if request.data['role'] == 'super-admin' and request.user.userprofile.role != 'super-admin':
                        return Response({'error': 'Only super-admins can assign super-admin role'}, 
                                      status=status.HTTP_403_FORBIDDEN)
                    role_data['role'] = request.data['role']
                # For unauthenticated registration, default to 'user'
                else:
                    role_data['role'] = 'user'
            
            # Set department if provided
            if 'department' in request.data:
                role_data['department'] = request.data['department']
                
            # Update profile if we have data to update
            if role_data:
                profile_serializer = UserProfileSerializer(profile, data=role_data, partial=True)
                if profile_serializer.is_valid():
                    profile_serializer.save()
                else:
                    return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        # Check if this is an email-only login
        if 'email' in request.data and 'password' not in request.data:
            return self.email_login(request)
            
        # Regular username/password login
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            
            if user:
                # Ensure timpheb is always super-admin
                if user.username == "timpheb":
                    profile = UserProfile.objects.get(user=user)
                    if profile.role != "super-admin":
                        profile.role = "super-admin"
                        profile.department = "management"  # Optional: set a default department
                        profile.save()
                
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': UserSerializer(user).data
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def email_login(self, request):
        serializer = EmailLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Handle NBN email login
            if email.endswith('@nbnco.com.au'):
                try:
                    # Try to find user by exact email
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    # If not found and it's an NBN email, auto-create the user
                    username = email.split('@')[0]  # Use part before @ as username
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=User.objects.make_random_password()  # Generate a random password
                    )
                    # Create profile with default role
                    profile = UserProfile.objects.get(user=user)
                    profile.role = 'user'
                    profile.department = 'nbn'
                    profile.save()
                
                # Special handling for timpheb
                if user.username == "timpheb":
                    profile = UserProfile.objects.get(user=user)
                    if profile.role != "super-admin":
                        profile.role = "super-admin"
                        profile.department = "management"
                        profile.save()
                
                # Create token and return response
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': UserSerializer(user).data
                })
            else:
                # For non-NBN emails, require exact match
                try:
                    user = User.objects.get(email=email)
                    token, created = Token.objects.get_or_create(user=user)
                    return Response({
                        'token': token.key,
                        'user': UserSerializer(user).data
                    })
                except User.DoesNotExist:
                    return Response({'error': 'No user found with this email'}, 
                                status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        user = request.user
        
        # Handle profile update (PUT request)
        if request.method == 'PUT':
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # Update profile if department is provided
                if 'department' in request.data:
                    profile = UserProfile.objects.get(user=user)
                    profile_serializer = UserProfileSerializer(profile, data={'department': request.data['department']}, partial=True)
                    if profile_serializer.is_valid():
                        profile_serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle GET request
        user = request.user
        
        # Ensure timpheb is always super-admin
        if user.username == "timpheb":
            profile = UserProfile.objects.get(user=user)
            if profile.role != "super-admin":
                profile.role = "super-admin"
                profile.department = "management"  # Optional: set a default department
                profile.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'])
    def update_role(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            profile = UserProfile.objects.get(user=user)
            
            # Only super-admin and admin users can update roles
            if request.user.userprofile.role not in ['super-admin', 'admin']:
                return Response({'error': 'You do not have permission to update roles'}, 
                              status=status.HTTP_403_FORBIDDEN)
                
            # Super-admin role can only be assigned by another super-admin
            if 'role' in request.data and request.data['role'] == 'super-admin' and request.user.userprofile.role != 'super-admin':
                return Response({'error': 'Only super-admins can assign super-admin role'}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def list_users(self, request):
        # Only super-admin, admin, and manager can view all users
        if request.user.userprofile.role not in ['super-admin', 'admin', 'manager']:
            return Response({'error': 'You do not have permission to view all users'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


