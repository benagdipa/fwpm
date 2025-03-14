from django.db import migrations

def grant_superadmin_to_specific_users(apps, schema_editor):
    # Get the UserProfile model from the app registry
    User = apps.get_model('auth', 'User')
    UserProfile = apps.get_model('authentication', 'UserProfile')
    
    # Grant superadmin rights to specific users only
    # First find users by username or specific email
    superadmin_users = list(User.objects.filter(username='timpheb'))
    benedick_users = list(User.objects.filter(email='benedickagdipa1@nbnco.com.au'))
    
    # Combine the lists for super-admin users
    users_to_update_as_superadmin = superadmin_users + benedick_users
    
    # Update super-admin profiles
    for user in users_to_update_as_superadmin:
        try:
            profile = UserProfile.objects.get(user=user)
            profile.role = 'super-admin'
            profile.department = 'management'
            profile.save()
        except UserProfile.DoesNotExist:
            UserProfile.objects.create(
                user=user,
                role='super-admin',
                department='management'
            )
    
    # Find other NBN users and update them to engineer role (if they're not already super-admin)
    nbn_users = User.objects.filter(email__endswith='@nbnco.com.au').exclude(email='benedickagdipa1@nbnco.com.au')
    
    for user in nbn_users:
        try:
            profile = UserProfile.objects.get(user=user)
            # Only update if they're not already a super-admin (don't downgrade)
            if profile.role == 'user':
                profile.role = 'engineer'
                profile.department = 'engineering'
                profile.save()
        except UserProfile.DoesNotExist:
            UserProfile.objects.create(
                user=user,
                role='engineer',
                department='engineering'
            )


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_userprofile_role'),
    ]

    operations = [
        migrations.RunPython(grant_superadmin_to_specific_users),
    ] 