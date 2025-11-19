# 🚀 Portal Setup Guide - Get Your Dashboard Working

## Why You Can't See the Dashboard Yet

The portal **is fully implemented**, but it's empty because:
1. ❌ You haven't signed in yet (no profile created)
2. ❌ No monthly reports exist in the database
3. ❌ Dashboard shows data from reports (which don't exist yet)

**Solution**: Follow these steps to see everything working! 👇

---

## 📋 Step-by-Step Setup

### Step 1: Sign In to Create Your Profile ✅

1. **Go to**: http://localhost:3000/auth
2. **Enter your email** (any email you have access to)
3. **Click** "Send Magic Link"
4. **Check your email** for the sign-in link
5. **Click the link** in the email
6. **You'll be redirected** to `/portal`

**What happens**:
- ✅ Your profile is automatically created in the database
- ✅ You're now authenticated
- ✅ You can access the portal

---

### Step 2: Bootstrap Admin Access ✅

1. **Go to**: http://localhost:3000/portal/settings
2. **Click** "Become Administrator" button
3. **Confirm** the action
4. **You're now ADMIN** with full access!

**What this does**:
- ✅ Promotes you to ADMIN role
- ✅ Gives you permission to approve reports
- ✅ Unlocks all portal features

---

### Step 3: Create Test Data ✅

Now run the test data script:

```bash
npm run test-data
```

**What this creates**:
- ✅ 12-18 monthly reports (last 6 months)
- ✅ Mix of statuses (draft, submitted, approved)
- ✅ Realistic metrics (meetings, souls saved, etc.)
- ✅ Data for all charts and graphs

---

### Step 4: Refresh and Explore! 🎉

**Go to**: http://localhost:3000/portal

**You'll now see**:

#### Dashboard (`/portal`)
- ✅ **KPI Cards**:
  - Reports submitted this month
  - Pending approvals
  - Reporting compliance %
  - Total KPIs for selected month

- ✅ **Charts**:
  - **Line Chart**: Souls saved over last 6 months
  - **Bar Chart**: Universities reached by region
  - **Pie Chart**: Uploads by platform (YouTube, Instagram, etc.)

- ✅ **Filters**:
  - Month selector
  - Region filter
  - Filters persist in URL

#### Reports List (`/portal/reports`)
- ✅ **Data Table** with:
  - Month, Region, University, Status columns
  - Filter by month, region, university, status
  - Sort by any column
  
- ✅ **Row Actions**:
  - **View** - See report details
  - **Edit** - If you own it and it's draft/rejected
  - **Approve/Reject** - If you're admin/regional leader

#### Report Detail (`/portal/reports/[id]`)
- ✅ **Full report view** with:
  - All metrics displayed
  - Attachments (if any)
  - Audit log timeline
  
- ✅ **Actions**:
  - **Approve** (changes status to approved)
  - **Reject** (with comment, unlocks editing)
  - **Download attachments** (via signed URLs)

#### New Report (`/portal/reports/new`)
- ✅ **Complete form** with:
  - Month picker (YYYY-MM)
  - Region selector
  - University dropdown
  - All metrics fields:
    - Meetings count
    - Hours invested
    - Uploads by platform (YouTube, Instagram, TikTok, Facebook, Other)
    - Universities reached
    - Tracts given
    - Souls saved
    - Integrations count
    - Literature money (FRw)
    - Literature count
    - Remarks (optional)
    - File attachments (multiple)
  
- ✅ **Actions**:
  - **Save Draft** (status = draft)
  - **Submit** (status = submitted, sends for approval)

#### Exports (`/portal/exports`)
- ✅ **Export options**:
  - **Raw CSV** - All reports with current filters
  - **Summary CSV** - Aggregated totals
  - **National PDF** - Professional report with:
    - Month summary
    - Tables by region
    - Charts
    - Totals

#### Settings (`/portal/settings`)
- ✅ **Profile editor**:
  - Full name
  - Phone
  - Region
  - University
  
- ✅ **Admin bootstrap** (one-time)
- ✅ **Sign out** button

---

## 🎯 What You Should See After Setup

### Dashboard Example:

```
┌─────────────────────────────────────────────────┐
│  📊 Portal Dashboard                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Month: Nov 2025 ▼]  [Region: All ▼]         │
│                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┐ │
│  │    15    │    3     │   75%    │   120    │ │
│  │ Reports  │ Pending  │Compliance│  Souls   │ │
│  └──────────┴──────────┴──────────┴──────────┘ │
│                                                 │
│  📈 Souls Saved (Last 6 Months)                │
│  ┌───────────────────────────────────────────┐ │
│  │     [Line chart showing trend]            │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  📊 Universities by Region                     │
│  ┌───────────────────────────────────────────┐ │
│  │     [Bar chart by region]                 │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  🎯 Uploads by Platform                        │
│  ┌───────────────────────────────────────────┐ │
│  │     [Pie chart: YT, IG, TT, FB]          │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Reports Table Example:

```
┌─────────────────────────────────────────────────┐
│  📋 Monthly Reports                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Search] [Month ▼] [Region ▼] [Status ▼]     │
│                                                 │
│  Month    │ Region  │ University  │ Status     │
│  ─────────┼─────────┼─────────────┼──────────  │
│  2025-11  │ Kigali  │ AUCA        │ Approved   │
│  2025-11  │ Kigali  │ ALU         │ Submitted  │
│  2025-10  │ Kigali  │ UoK         │ Draft      │
│  ...                                            │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Problem: "No data to display"
**Solution**: Run `npm run test-data` to create sample reports

### Problem: "Access denied"
**Solution**: Make sure you bootstrapped admin access in Settings

### Problem: "Can't see charts"
**Solution**: Charts need at least 2 months of approved reports

### Problem: "Can't approve reports"
**Solution**: Only ADMIN, SECRETARIAT, or REGIONAL_LEADER can approve

### Problem: "Can't create reports"
**Solution**: Make sure you're signed in and have a profile

---

## 📊 Understanding the Data Flow

### Report Lifecycle:

```
1. CREATE
   ├─ Campus Leader creates report
   ├─ Status: draft
   └─ Can edit freely

2. SUBMIT
   ├─ Campus Leader submits
   ├─ Status: submitted
   └─ Locked for editing

3. REVIEW
   ├─ Regional Leader/Admin reviews
   ├─ Can approve or reject
   └─ Add comment

4. APPROVE
   ├─ Status: approved
   ├─ Data rolls up to public KPIs
   └─ Shows on home page counters

OR

4. REJECT
   ├─ Status: rejected
   ├─ Unlocks for editing
   └─ Campus Leader can fix and resubmit
```

### Dashboard Data Sources:

- **KPI Cards**: Count from `monthly_reports` table
- **Line Chart**: `public_kpis` view (approved reports only)
- **Bar Chart**: `monthly_reports` grouped by region
- **Pie Chart**: Sum of `uploads_by_platform` JSON field
- **Compliance**: (Submitted + Approved) / Total Universities

---

## 🎯 Quick Test Checklist

After setup, test these features:

### Dashboard:
- [ ] See KPI cards with numbers
- [ ] Line chart shows trend
- [ ] Bar chart shows regions
- [ ] Pie chart shows platforms
- [ ] Month filter works
- [ ] Region filter works

### Reports:
- [ ] See list of reports
- [ ] Filter by month works
- [ ] Filter by status works
- [ ] Click to view details
- [ ] Can approve a submitted report
- [ ] Can reject with comment

### Create Report:
- [ ] Form loads with all fields
- [ ] Can select university
- [ ] Can enter all metrics
- [ ] Can upload files
- [ ] Save Draft works
- [ ] Submit works

### Exports:
- [ ] CSV export downloads
- [ ] PDF export generates
- [ ] Data matches dashboard

### Settings:
- [ ] Can edit profile
- [ ] Can sign out
- [ ] Admin badge shows

---

## 🚀 You're All Set!

After following these steps, your portal will be **fully functional** with:

✅ Working dashboard with real data  
✅ Charts showing trends  
✅ Reports you can approve/reject  
✅ Export functionality  
✅ Complete admin access  

**Now go create your first real report!** 📊

---

## 📝 Next Steps

### For Production:
1. **Real Users**: Invite campus leaders
2. **Real Reports**: Start monthly reporting
3. **Permissions**: Assign roles (Regional Leader, Campus Leader)
4. **Training**: Use the Field Playbook guide

### For Development:
1. **Run migration**: `001_kigali_universities_update.sql` in Supabase
2. **Build UI**: Permission request form
3. **Build UI**: Campus playbook editor
4. **Build UI**: Outreach dashboard

---

**Last Updated**: November 14, 2025  
**Status**: ✅ Ready to Use  
**Support**: Check FIELD_PLAYBOOK.md for complete guide







