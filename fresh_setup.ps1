# PowerShell script to set up a fresh Git repository
# Initialize a new Git repository
git init

# Add the remote origin
git remote add origin https://github.com/benagdipa/fwpm.git

# Add all files to staging
git add .

# Create an initial commit
git commit -m "Initial commit of the new framework"

# Push to the remote repository
git push -u origin master --force 