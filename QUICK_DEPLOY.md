# ⚡ Quick Deploy - 5 Minutes

## 🎯 Deploy to Vercel (Recommended)

### **Step 1: Push to GitHub (2 min)**

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/cysmf-app.git
git push -u origin main
```

---

### **Step 2: Deploy to Vercel (3 min)**

1. **Go to:** https://vercel.com/signup
2. **Sign in** with GitHub
3. **Click:** "Add New..." → "Project"
4. **Select:** Your `cysmf-app` repository
5. **Configure:**
   - Root Directory: `cysmf-app` (if in subfolder)
   - Framework: Next.js (auto-detected)
6. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://uhpmjlgvxcfvmrxzrspo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
   ```
   *(Get from Supabase → Settings → API)*

7. **Click:** "Deploy"
8. **Wait:** 2-3 minutes
9. **Done!** 🎉

Your site: `https://your-app.vercel.app`

---

## ✅ Pre-Deployment Checklist

Make sure you've done:

```
✅ Run FIX_SUPABASE_RLS.sql in Supabase
✅ Run ADD_PRAYER_HOURS.sql in Supabase
✅ Run CREATE_JOIN_REQUESTS_SYSTEM.sql in Supabase
✅ Create storage buckets (report-attachments, profile-avatars)
✅ Set storage buckets to public
✅ Test locally (npm run dev)
```

---

## 🔧 After Deployment

1. **Update Supabase URLs:**
   - Go to Supabase → Authentication → URL Configuration
   - Add: `https://your-app.vercel.app/**`

2. **Test everything:**
   ```
   ✅ Homepage loads
   ✅ Login works
   ✅ Dashboard loads
   ✅ Create report works
   ✅ File uploads work
   ✅ Join requests work
   ```

---

## 🚨 If Something Breaks

1. **Check Vercel logs:**
   - Vercel → Your Project → Deployments → View Logs

2. **Check environment variables:**
   - Vercel → Settings → Environment Variables
   - Make sure they start with `NEXT_PUBLIC_`

3. **Redeploy:**
   - Vercel → Deployments → ... → Redeploy

---

## 🎉 That's It!

Your site is now live and free! 🚀

**Free Tier Includes:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deployments from Git

**Cost: $0/month** 💰

