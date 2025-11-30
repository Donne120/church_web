# 🔧 Troubleshooting Guide

## Issue: Can't Sign In / Keep Seeing Auth Page

### Symptom:
- You enter your email and click "Send Magic Link"
- You see "Check your email" message
- But when you try to access `/portal`, you're redirected back to `/auth`

---

## ✅ Solution Steps:

### Step 1: Check If You Received the Email

1. **Check your inbox** for an email from Supabase
2. **Check spam/junk folder**
3. **Wait 2-3 minutes** (sometimes emails are delayed)

**Subject line**: Something like "Confirm your signup" or "Magic Link"

---

### Step 2: Click the Link in the Email

The email will have a button or link like:
- "Confirm your email"
- "Sign in"
- A long URL starting with your Supabase project URL

**Click that link!**

---

### Step 3: What Should Happen

After clicking the link:
1. ✅ You're redirected to `http://localhost:3000/portal`
2. ✅ You see the portal dashboard (might be empty - that's normal!)
3. ✅ You're signed in

---

## 🚨 If You're NOT Receiving Emails:

### Possible Causes:

#### 1. Supabase Email Not Configured

**Check**: Go to your Supabase dashboard → Authentication → Email Templates

**Solution**: 
- Supabase provides default email templates
- They should work out of the box
- If not, you may need to configure SMTP

#### 2. Wrong Email Address

**Check**: Did you use a real email address you have access to?

**Solution**: Try again with a different email

#### 3. Email Provider Blocking

**Check**: Some email providers block automated emails

**Solution**: 
- Try a Gmail address
- Check spam folder
- Add noreply@mail.app.supabase.io to your contacts

---

## 🔍 Alternative: Check Supabase Dashboard

### Verify Authentication is Working:

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to**: Authentication → Users
4. **Check**: Do you see your email in the list?

If YES:
- The sign-in request was received
- Email should have been sent
- Check spam folder again

If NO:
- The request didn't reach Supabase
- Check your `.env.local` file has correct keys
- Check terminal for errors

---

## 🛠️ Verify Your Setup:

### Check 1: `.env.local` File Exists

```bash
# In your project folder:
ls -la .env.local
```

Should show the file exists.

### Check 2: Environment Variables Are Correct

Your `.env.local` should have:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoibmd1bTEyMyIsImEiOiJjbWN5OXlmMGUwNXl3Mm1xcG40bHNkYTVpIn0...
```

### Check 3: Supabase Project is Active

1. Go to https://supabase.com/dashboard
2. Make sure your project is not paused
3. Check project status

---

## 🎯 Quick Test:

### Test Authentication Manually:

1. **Open browser console** (F12)
2. **Go to**: http://localhost:3000/auth
3. **Enter email and click send**
4. **Check console** for errors
5. **Check Network tab** for failed requests

---

## 💡 Common Issues & Fixes:

### Issue: "Invalid API key"
**Fix**: Check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### Issue: "Project not found"
**Fix**: Check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`

### Issue: "Email not sent"
**Fix**: 
- Check Supabase dashboard → Authentication → Email Templates
- Make sure email provider is configured
- Try a different email address

### Issue: "Session expired"
**Fix**: 
- Request a new magic link
- Links expire after 1 hour

### Issue: "Redirected back to /auth"
**Fix**: 
- Clear browser cookies
- Try incognito/private mode
- Check middleware.ts is not blocking

---

## 🚀 If Everything Else Fails:

### Option 1: Use Supabase Dashboard to Create User

1. Go to Supabase Dashboard
2. Authentication → Users
3. Click "Add user"
4. Enter email and password
5. Use password sign-in instead of magic link

### Option 2: Disable Auth Temporarily

For testing only, you can temporarily bypass auth:

1. Comment out the middleware check
2. Access portal directly
3. Test the dashboard
4. Re-enable auth after testing

**Note**: Don't do this in production!

---

## 📞 Still Stuck?

### Check These Files:

1. **`.env.local`** - Environment variables
2. **`middleware.ts`** - Auth protection
3. **`app/(public)/auth/page.tsx`** - Sign-in page
4. **`lib/supabase/browser.ts`** - Supabase client

### Check Terminal Output:

Look for errors like:
- "Invalid API key"
- "Project not found"
- "Network error"
- "CORS error"

### Check Browser Console:

Look for errors like:
- "Failed to fetch"
- "Unauthorized"
- "Invalid token"

---

## ✅ Success Checklist:

- [ ] Supabase project created
- [ ] `.env.local` file exists with correct keys
- [ ] Dev server running (`npm run dev`)
- [ ] Email sent successfully
- [ ] Email received (check spam)
- [ ] Link clicked
- [ ] Redirected to `/portal`
- [ ] Signed in successfully

---

## 🎉 Once You're Signed In:

1. **Go to**: http://localhost:3000/portal/settings
2. **Click**: "Become Administrator"
3. **Run**: `npm run test-data`
4. **Refresh**: http://localhost:3000/portal
5. **See**: Full dashboard with charts!

---

**Last Updated**: November 14, 2025  
**Status**: Troubleshooting Guide  
**Next**: PORTAL_SETUP_GUIDE.md








