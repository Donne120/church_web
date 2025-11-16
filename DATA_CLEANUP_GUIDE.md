# 🧹 Data Cleanup Guide - Remove Mock Data Safely

## 🎯 Goal
Remove test/mock data while keeping the system working perfectly so you can add real data.

---

## ✅ What Will Be KEPT (Safe):
- ✅ All database tables and structure
- ✅ All RLS policies (security)
- ✅ All views (public_kpis)
- ✅ Your user account and login
- ✅ Universities (optional - you choose)
- ✅ All features and functionality

## 🗑️ What Will Be REMOVED:
- ❌ Test monthly reports
- ❌ Test media entries
- ❌ Test events
- ❌ Test user profiles (optional)

---

## 📋 Step-by-Step Instructions

### **Step 1: Backup Check (Optional but Recommended)**

Before clearing, check what data you have:

1. Go to Supabase Dashboard: https://uhpmjlgvxcfvmrxzrspo.supabase.co
2. Go to **SQL Editor**
3. Run this query:

```sql
SELECT 
  'monthly_reports' as table_name, 
  COUNT(*) as count
FROM monthly_reports
UNION ALL
SELECT 'media', COUNT(*) FROM media
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'universities', COUNT(*) FROM universities
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;
```

4. Note down the counts (just in case)

---

### **Step 2: Choose Your Cleanup Level**

#### **🟢 OPTION A: Conservative (Recommended)**
**Removes:** Reports, media, events  
**Keeps:** Universities, all profiles

```sql
DELETE FROM monthly_reports;
DELETE FROM media;
DELETE FROM events;
```

**Best for:** First-time cleanup, when you want to keep all user accounts

---

#### **🟡 OPTION B: Moderate**
**Removes:** Reports, media, events, test profiles  
**Keeps:** Universities, YOUR profile only

1. First, find your profile ID:
```sql
SELECT id, email, full_name, role FROM profiles;
```

2. Copy your ID (the long UUID string)

3. Run cleanup (replace `YOUR_ID_HERE` with your actual ID):
```sql
DELETE FROM monthly_reports;
DELETE FROM media;
DELETE FROM events;
DELETE FROM profiles WHERE id != 'YOUR_ID_HERE';
```

**Best for:** When you have test accounts you want to remove

---

#### **🔴 OPTION C: Full Reset (Use with Caution)**
**Removes:** Everything  
**Keeps:** Only structure

```sql
DELETE FROM monthly_reports;
DELETE FROM media;
DELETE FROM events;
DELETE FROM universities;
DELETE FROM profiles;
```

**Best for:** Starting completely fresh (you'll need to re-login and re-add universities)

---

### **Step 3: Run Your Chosen Cleanup**

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the SQL from your chosen option above
4. Paste it
5. Click **Run**
6. You should see "Success" messages

---

### **Step 4: Verify the Cleanup**

Run this verification query:

```sql
SELECT 
  'monthly_reports' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) = 0 THEN '✅ Empty' ELSE '⚠️ Has data' END as status
FROM monthly_reports
UNION ALL
SELECT 'media', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '✅ Empty' ELSE '⚠️ Has data' END FROM media
UNION ALL
SELECT 'events', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '✅ Empty' ELSE '⚠️ Has data' END FROM events
UNION ALL
SELECT 'universities', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '⚠️ Empty' ELSE '✅ Has data' END FROM universities
UNION ALL
SELECT 'profiles', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '⚠️ Empty' ELSE '✅ Has data' END FROM profiles;
```

**Expected Results:**
- monthly_reports: ✅ Empty (0)
- media: ✅ Empty (0)
- events: ✅ Empty (0)
- universities: ✅ Has data (or Empty if you deleted them)
- profiles: ✅ Has data (at least 1 - yours)

---

### **Step 5: Refresh Your App**

1. Go to http://localhost:3000
2. Refresh the page (F5)
3. You should see:
   - ✅ Homepage loads (may show 0 for metrics - that's correct!)
   - ✅ Login still works
   - ✅ Portal dashboard loads (empty - ready for real data)
   - ✅ "New Report" button works

---

## 🎉 You're Ready!

Your system is now clean and ready for real data:

### **Next Steps:**

1. **Add Universities** (if you deleted them):
   - Go to Supabase → Table Editor → universities
   - Add your real universities

2. **Invite Real Users**:
   - They can sign up at http://localhost:3000/auth
   - Assign them proper roles

3. **Create Real Reports**:
   - Go to http://localhost:3000/portal/reports/new
   - Fill in real data
   - Submit for approval

4. **Approve Reports**:
   - Admin/Secretariat can review and approve
   - Data will appear on public homepage

---

## 🆘 Troubleshooting

### **Problem: Can't login after cleanup**
**Solution:** You deleted your profile. Run Option C to reset, then re-signup.

### **Problem: No universities in dropdown**
**Solution:** You deleted universities. Re-add them in Supabase Table Editor.

### **Problem: Homepage shows errors**
**Solution:** This is normal when there's no approved data yet. Add and approve a report.

### **Problem: Want to undo the cleanup**
**Solution:** Unfortunately, deleted data can't be recovered. That's why we recommended Option A first!

---

## 📝 Quick Reference

**Files Created:**
- `CLEAR_MOCK_DATA.sql` - Simple cleanup script
- `SAFE_CLEAR_DATA.sql` - Detailed cleanup with options
- `DATA_CLEANUP_GUIDE.md` - This guide

**Recommended:** Use **OPTION A (Conservative)** from `SAFE_CLEAR_DATA.sql`

**Support:** If something goes wrong, you can always re-run the setup scripts to restore structure.

