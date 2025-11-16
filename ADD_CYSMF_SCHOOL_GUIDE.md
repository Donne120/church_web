# ✅ Add CYSMF as a School Option

## 🎯 What This Does

Adds **"Christian Youth and Students Missionary Fellowship"** to the university/school dropdown when creating reports.

---

## 🚀 How to Add It

### **Step 1: Run the SQL**

1. Open Supabase Dashboard: https://uhpmjlgvxcfvmrxzrspo.supabase.co
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `ADD_CYSMF_UNIVERSITY.sql`
4. Click **Run**
5. You should see the success message with the CYSMF entry

---

### **Step 2: Verify It Works**

1. Go to your app: http://localhost:3000/portal/reports/new
2. Scroll to **"Basic Information"**
3. Click **"Select university"** dropdown
4. You should now see:
   ```
   - Adventist University of Central Africa (AUCA)
   - African Leadership University (ALU) - Rwanda
   - Christian Youth and Students Missionary Fellowship  ← NEW!
   - Mount Kigali University
   - ... (other universities)
   ```

---

## ✅ That's It!

**"Christian Youth and Students Missionary Fellowship"** will now appear in:
- ✅ Report creation form
- ✅ Report edit form
- ✅ University dropdowns everywhere
- ✅ Campus page map (if coordinates are set)

---

## 🔧 What Was Added

**University Details:**
- **Name:** Christian Youth and Students Missionary Fellowship
- **City:** Kigali
- **Region:** Kigali City
- **Status:** Active
- **Coordinates:** -1.9536, 30.0606 (Kigali center)

---

## 📝 Notes

- This is treated as a "university" in the system
- Reports can be created for CYSMF activities
- It will appear in all university-related dropdowns
- You can update the coordinates later if needed

---

## 🎉 Done!

CYSMF is now a selectable option when creating reports! 🚀

