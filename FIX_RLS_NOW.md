# 🔧 Fix RLS Infinite Recursion - DO THIS NOW

## ❌ The Problem:
You're getting: `infinite recursion detected in policy for relation "profiles"`

This happens when RLS policies reference the same table they're protecting.

---

## ✅ The Solution (2 minutes):

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)

### Step 2: Run This SQL

Copy and paste this ENTIRE block and click **RUN**:

```sql
-- Fix infinite recursion in profiles RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
DROP POLICY IF EXISTS "profiles_read_all_for_admins" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;

-- Create new, simpler policies that avoid recursion

-- 1. Anyone can read their own profile
CREATE POLICY "profiles_read_own" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can insert their own profile
CREATE POLICY "profiles_insert_own" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "profiles_update_own" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);
```

### Step 3: Verify
You should see: **Success. No rows returned**

---

## ✅ Now Try Signing In Again

1. **Refresh** your browser: http://localhost:3000/auth
2. **Enter**:
   - Email: `admin@cysmf.org`
   - Password: `Admin123!`
3. **Click**: "Sign In"
4. **Result**: You should be signed in and redirected to `/portal` 🎉

---

## 🎯 What This Fixed:

**Before**: RLS policies were checking the `profiles` table while inserting into the `profiles` table → infinite loop

**After**: RLS policies only check `auth.uid()` (from JWT token) → no recursion

---

## 📝 If You Still Have Issues:

### Check 1: Make sure the SQL ran successfully
- Go back to SQL Editor
- Look for green "Success" message

### Check 2: Clear browser cache
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or open an incognito window

### Check 3: Verify the user exists
Run this in SQL Editor:
```sql
SELECT id, email, role FROM profiles WHERE email = 'admin@cysmf.org';
```

You should see:
- id: (some UUID)
- email: admin@cysmf.org
- role: ADMIN

---

## 🚀 Once Fixed, You'll See:

### Portal Dashboard:
- ✅ KPI cards with real data
- ✅ Charts (line, bar, pie)
- ✅ 14 monthly reports
- ✅ Navigation to all portal pages

### Your Profile:
- ✅ Name: CYSMF Admin
- ✅ Role: ADMIN
- ✅ Email: admin@cysmf.org

---

## ⚡ Quick Reference:

**Supabase Dashboard**: https://supabase.com/dashboard  
**SQL Editor**: Dashboard → SQL Editor (left sidebar)  
**Auth Page**: http://localhost:3000/auth  
**Portal**: http://localhost:3000/portal  

**Credentials**:
- Email: `admin@cysmf.org`
- Password: `Admin123!`

---

Let me know once you've run the SQL and tried signing in again! 🎊







