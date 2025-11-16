# 🚀 Push CYSMF-App to GitHub

## 📍 Pushing Only the cysmf-app Folder

Your GitHub: https://github.com/Ngum12/Report_Church-faculty.git

---

## ⚡ Quick Push Commands

Open **PowerShell** and run these commands:

```powershell
# 1. Go to the cysmf-app folder
cd "C:\Users\Ngum\Documents\church webss\cysmf-app"

# 2. Check if git is initialized
git status
```

### **If you see "fatal: not a git repository":**

```powershell
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - CYSMF Church Report System"

# Connect to GitHub
git remote add origin https://github.com/Ngum12/Report_Church-faculty.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### **If git is already initialized:**

```powershell
# Add all files
git add .

# Commit
git commit -m "Initial commit - CYSMF Church Report System"

# Check if remote exists
git remote -v

# If no remote, add it:
git remote add origin https://github.com/Ngum12/Report_Church-faculty.git

# If remote exists but wrong, update it:
git remote set-url origin https://github.com/Ngum12/Report_Church-faculty.git

# Push to GitHub
git push -u origin main
```

---

## 🔐 GitHub Authentication

When asked for credentials:
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token**

### Get Your Token:
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Check **`repo`** (full control)
4. Click **"Generate token"**
5. Copy and use as password

---

## ✅ Verify Success

After pushing, check:
https://github.com/Ngum12/Report_Church-faculty

You should see:
- ✅ app/ folder
- ✅ components/ folder
- ✅ lib/ folder
- ✅ public/ folder
- ✅ All SQL files
- ✅ package.json
- ✅ next.config.ts
- ✅ All your files!

---

## 🎉 Done!

Your CYSMF app is now on GitHub! 🚀

Next step: Deploy to Vercel (check `DEPLOYMENT_GUIDE.md`)

