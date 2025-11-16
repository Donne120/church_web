# 🔧 Fix Report Display Issues

## 🎯 Problem

Reports are created but:
1. ❌ Don't show correct information on report detail page
2. ❌ Don't reflect on the public homepage (KPIs)

---

## 🔍 Diagnose First

### **Step 1: Run Diagnostic SQL**

1. Open Supabase: https://uhpmjlgvxcfvmrxzrspo.supabase.co
2. Go to **SQL Editor**
3. Copy and paste `DIAGNOSE_REPORT_ISSUE.sql`
4. Click **Run**
5. Check the results:

**What to look for:**
- ✅ Are there any reports? (total_reports > 0)
- ✅ Are there **approved** reports? (Only approved reports show on homepage)
- ✅ Does `public_kpis` view exist?
- ✅ Does `public_kpis` have `prayer_hours` column?
- ✅ Is "Christian Youth and Students Missionary Fellowship" in universities?

---

## 🚨 Common Issues & Fixes

### **Issue 1: Reports Not Showing on Homepage**

**Cause:** Only **approved** reports show on the public homepage.

**Fix:**
1. Go to: http://localhost:3000/portal/reports
2. Find your report
3. Click on it
4. If status is "SUBMITTED", you need to approve it
5. If you're an admin, you'll see "Approve" button
6. Click "Approve"
7. Now it will show on homepage!

**Status Flow:**
```
DRAFT → SUBMITTED → APPROVED ✅ (shows on homepage)
```

---

### **Issue 2: Prayer Hours Not Showing**

**Cause:** The `public_kpis` view might not include `prayer_hours`.

**Fix:** Run this SQL in Supabase:

```sql
-- Recreate the public_kpis view with prayer_hours
DROP VIEW IF EXISTS public_kpis;

CREATE VIEW public_kpis AS
SELECT
  month,
  SUM(universities_reached) AS universities_reached,
  SUM(tracts_given) AS tracts_given,
  SUM(souls_saved) AS souls_saved,
  SUM(integrations_count) AS integrations,
  SUM(meetings_count) AS meetings,
  SUM(hours_invested) AS hours_invested,
  SUM(literature_count) AS literature_count,
  SUM(literature_money) AS literature_money,
  SUM(
    COALESCE(prayer_hours_friday, 0) +
    COALESCE(prayer_hours_literature, 0) +
    COALESCE(prayer_hours_media, 0) +
    COALESCE(prayer_hours_intercession, 0) +
    COALESCE(prayer_hours_worship, 0) +
    COALESCE(prayer_hours_evangelism, 0)
  ) AS prayer_hours
FROM monthly_reports
WHERE status = 'approved'
GROUP BY month
ORDER BY month DESC;

-- Grant access
GRANT SELECT ON public_kpis TO anon, authenticated;
```

---

### **Issue 3: University Not Showing in Dropdown**

**Cause:** University not added to database.

**Fix:** Run `ADD_CYSMF_UNIVERSITY.sql` (already created)

---

### **Issue 4: Report Detail Page Shows Wrong Data**

**Possible Causes:**
1. Report not saved correctly
2. Database columns missing
3. RLS policies blocking data

**Fix:**

1. **Check if data was saved:**
   ```sql
   SELECT * FROM monthly_reports 
   WHERE id = 'YOUR_REPORT_ID'
   ORDER BY created_at DESC 
   LIMIT 1;
   ```

2. **Check if all columns exist:**
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'monthly_reports'
   ORDER BY ordinal_position;
   ```

3. **Verify RLS policies allow reading:**
   - Make sure you ran `FIX_SUPABASE_RLS.sql`

---

## ✅ Complete Fix Checklist

Run these SQL scripts in order:

```
1. ✅ FIX_SUPABASE_RLS.sql (if not already done)
2. ✅ ADD_PRAYER_HOURS.sql (if not already done)
3. ✅ ADD_CYSMF_UNIVERSITY.sql (to add CYSMF as school)
4. ✅ CREATE_JOIN_REQUESTS_SYSTEM.sql (if not already done)
5. ✅ DIAGNOSE_REPORT_ISSUE.sql (to check current state)
```

---

## 🧪 Test After Fixing

### **1. Test Report Creation:**
1. Go to: http://localhost:3000/portal/reports/new
2. Fill in all fields
3. Click "Save as Draft"
4. Check report detail page - all data should show

### **2. Test Report Approval:**
1. Go to: http://localhost:3000/portal/reports
2. Click on your draft report
3. Click "Submit for Review"
4. If admin, click "Approve"
5. Check homepage - KPIs should update

### **3. Test Homepage:**
1. Go to: http://localhost:3000
2. Check "Our Impact" section
3. All KPIs should show:
   - Universities Reached
   - Tracts Given
   - Souls Saved
   - Integrations
   - Prayer Hours ← NEW!

---

## 🔍 Debug Steps

If still not working:

### **1. Check Browser Console:**
- Press F12
- Go to "Console" tab
- Look for red errors
- Share the error messages

### **2. Check Network Tab:**
- Press F12
- Go to "Network" tab
- Reload page
- Look for failed requests (red)
- Check what data is returned

### **3. Check Supabase Logs:**
- Go to Supabase Dashboard
- Click "Logs" in sidebar
- Check for errors

---

## 📊 Expected Behavior

### **Report Detail Page Should Show:**
- ✅ Month and year
- ✅ University name
- ✅ Region
- ✅ All metrics (meetings, hours, universities, etc.)
- ✅ Prayer hours breakdown
- ✅ Social media uploads
- ✅ Remarks
- ✅ Status badge
- ✅ Edit button (if draft and you're the owner)
- ✅ Approve/Reject buttons (if admin and submitted)

### **Homepage Should Show:**
- ✅ Latest KPIs from approved reports
- ✅ Universities Reached
- ✅ Tracts Given
- ✅ Souls Saved
- ✅ Integrations
- ✅ Prayer Hours (total)
- ✅ Last updated month

---

## 🎯 Quick Fix Summary

**Most Common Issue:** Reports are in "DRAFT" or "SUBMITTED" status.

**Quick Fix:**
1. Approve the report (if admin)
2. Wait a few seconds
3. Refresh homepage
4. KPIs should update!

**Remember:** Only **APPROVED** reports show on the public homepage! 🎉

---

## 📞 Still Having Issues?

Run `DIAGNOSE_REPORT_ISSUE.sql` and share the results.

The diagnostic will tell us exactly what's wrong!

