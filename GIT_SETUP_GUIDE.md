# 🔗 Connect to Git Repository - Complete Guide

## Step 1: Initialize Git (if not already done)

Open your terminal in the project folder and run:

```bash
git init
```

## Step 2: Check Git Status

```bash
git status
```

This shows all files that will be committed. Make sure `.env` is NOT listed (it should be ignored).

## Step 3: Add All Files

```bash
git add .
```

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit - Collabory platform with red theme"
```

## Step 5: Create GitHub Repository

1. Go to [https://github.com](https://github.com)
2. Click the "+" icon in top right → "New repository"
3. Fill in:
   - **Repository name:** `collabory` (or your preferred name)
   - **Description:** "Professional collaboration platform for creators"
   - **Visibility:** Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## Step 6: Connect to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/collabory.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 7: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.env` is NOT visible (it should be ignored)

---

## 🎯 Quick Commands Reference

### First Time Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/collabory.git
git branch -M main
git push -u origin main
```

### Making Updates Later
```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

---

## 🔒 Security Check

Before pushing, verify these files are in `.gitignore`:
- ✅ `.env` (contains secrets)
- ✅ `.env.local` (contains secrets)
- ✅ `node_modules/` (too large)
- ✅ `dist/` (build output)

**NEVER commit `.env` files to Git!**

---

## 🚀 After Connecting to Git

Once your code is on GitHub, you can:

1. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import from Git"
   - Select your GitHub repository
   - Add environment variables
   - Deploy!

2. **Collaborate:**
   - Share repository with team members
   - Create branches for features
   - Use pull requests for code review

3. **Automatic Deployments:**
   - Every push to `main` branch triggers Netlify deployment
   - No manual deployment needed

---

## 📝 Common Git Commands

```bash
# See current status
git status

# See commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# See remote URL
git remote -v

# Change remote URL
git remote set-url origin NEW_URL
```

---

## ⚠️ Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/collabory.git
```

### "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Accidentally committed .env file
```bash
# Remove from Git but keep locally
git rm --cached .env
git commit -m "Remove .env from tracking"
git push origin main
```

---

## 🎉 You're Connected!

Your project is now:
- ✅ Version controlled with Git
- ✅ Backed up on GitHub
- ✅ Ready for Netlify deployment
- ✅ Ready for collaboration

**Next Step:** Deploy to Netlify using the GitHub repository!
