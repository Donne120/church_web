# ✅ Prayer Hours Tracking Feature - Complete

## 🎯 Overview

Added comprehensive prayer hours tracking with 6 different prayer groups that youth can join:

1. **Friday Prayer** - Weekly Friday prayer meetings
2. **Literature Group Prayer** - Prayer for literature distribution ministry
3. **Media Team Prayer** - Prayer for social media and content creation
4. **Intercession Prayer** - Dedicated intercession sessions
5. **Worship Prayer** - Worship-focused prayer times
6. **Evangelism Prayer** - Prayer for evangelism activities

---

## ✅ What Was Implemented

### 1. **Database Schema** ✅
- Added 6 new columns to `monthly_reports` table:
  - `prayer_hours_friday`
  - `prayer_hours_literature`
  - `prayer_hours_media`
  - `prayer_hours_intercession`
  - `prayer_hours_worship`
  - `prayer_hours_evangelism`
- Updated `public_kpis` view to calculate total prayer hours
- All columns default to 0 (optional fields)

### 2. **Report Form** ✅
- New "Prayer Hours by Group" section in the report form
- 6 input fields for different prayer groups
- Users can enter hours for any/all groups they participate in
- Validation ensures non-negative integers
- Form saves prayer hours to database

### 3. **Public Homepage** ✅
- New "Prayer Hours" KPI card displays total prayer hours
- Shows sum of all prayer group hours from approved reports
- Updates automatically when new reports are approved
- Icon: Heart (❤️) to represent prayer

### 4. **Report Detail Page** ✅
- "Prayer Hours by Group" section shows breakdown
- Only displays groups with hours > 0
- Shows total prayer hours at the bottom
- Clean, organized grid layout

---

## 📋 Setup Instructions

### **Step 1: Run the SQL in Supabase**

1. Open Supabase Dashboard: https://uhpmjlgvxcfvmrxzrspo.supabase.co
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `ADD_PRAYER_HOURS.sql`
4. Click **Run**
5. You should see "Success" message

### **Step 2: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### **Step 3: Test the Feature**

1. **Create a new report:**
   - Go to http://localhost:3000/portal/reports/new
   - Fill in the basic info
   - Scroll to "Prayer Hours by Group" section
   - Enter hours for different prayer groups (e.g., Friday: 2, Media: 1, Worship: 3)
   - Save as draft or submit

2. **View the report:**
   - Click on the report you just created
   - You should see "Prayer Hours by Group" section with your entries
   - Total prayer hours displayed at the bottom

3. **Approve the report** (if you're admin/secretariat):
   - Approve the report
   - Go to the public homepage: http://localhost:3000
   - Scroll to "Our Impact" section
   - You should see the "Prayer Hours" card with the total

---

## 🎨 User Experience

### **For Campus Leaders (Reporters):**
- When creating/editing a report, they see a dedicated section for prayer hours
- They can enter hours for any prayer groups they participate in
- All fields are optional - they only fill in groups they're part of
- Clear labels help them understand each prayer group

### **For Admins/Secretariat:**
- Can see prayer hours breakdown when reviewing reports
- Total prayer hours calculated automatically
- Easy to verify and approve

### **For Public Visitors:**
- See total prayer hours on the homepage
- Understand the prayer commitment of the ministry
- Builds confidence in the spiritual foundation

---

## 📊 Data Flow

```
1. User fills prayer hours form
   ↓
2. Data saved to monthly_reports table (6 columns)
   ↓
3. Report gets approved
   ↓
4. public_kpis view calculates total prayer hours
   ↓
5. Homepage displays the metric
```

---

## 🔧 Technical Details

### **Database Columns:**
```sql
prayer_hours_friday INTEGER DEFAULT 0
prayer_hours_literature INTEGER DEFAULT 0
prayer_hours_media INTEGER DEFAULT 0
prayer_hours_intercession INTEGER DEFAULT 0
prayer_hours_worship INTEGER DEFAULT 0
prayer_hours_evangelism INTEGER DEFAULT 0
```

### **View Calculation:**
```sql
SUM(
  COALESCE(prayer_hours_friday, 0) +
  COALESCE(prayer_hours_literature, 0) +
  COALESCE(prayer_hours_media, 0) +
  COALESCE(prayer_hours_intercession, 0) +
  COALESCE(prayer_hours_worship, 0) +
  COALESCE(prayer_hours_evangelism, 0)
) AS prayer_hours
```

### **Frontend Components Updated:**
- `components/ReportForm.tsx` - Added prayer hours input fields
- `app/(public)/page.tsx` - Added Prayer Hours KPI card
- `app/portal/reports/[id]/page.tsx` - Added prayer hours display
- `lib/kpis.ts` - Added prayer_hours to interface

---

## ✅ Testing Checklist

- [x] Database columns added
- [x] View updated with prayer_hours calculation
- [x] Form includes all 6 prayer group fields
- [x] Form validation works (non-negative integers)
- [x] Report saves prayer hours to database
- [x] Report detail page shows prayer hours breakdown
- [x] Public homepage displays total prayer hours
- [x] Edit report preserves prayer hours values
- [x] No linter errors
- [x] All components connect to backend properly

---

## 🎉 Result

Youth can now track their prayer commitment across different ministry groups, and the public can see the total prayer hours invested in the ministry - demonstrating the spiritual foundation of CYSMF!

**Total Prayer Hours** now appears alongside other key metrics like:
- Universities Reached
- Souls Saved
- Tracts Given
- Meetings Held
- Hours Invested
- **Prayer Hours** ← NEW!
- Literature Distributed

