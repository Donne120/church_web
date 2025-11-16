# 🚀 Quick Start Guide - CYSMF Portal

## ✅ You're All Set Up!

Your portal is now ready with:
- ✅ Admin user created
- ✅ 14 monthly reports
- ✅ 3 upcoming events
- ✅ Full dashboard with charts
- ✅ Password sign-in enabled

---

## 🔐 Sign In Now

### Option 1: Password Sign-In (Recommended)

1. **Go to**: http://localhost:3000/auth
2. **Enter**:
   - Email: `admin@cysmf.org`
   - Password: `Admin123!`
3. **Click**: "Sign In"
4. **Done!** You'll be redirected to `/portal`

### Option 2: Magic Link

1. **Go to**: http://localhost:3000/auth
2. **Click**: "Use magic link instead"
3. **Enter**: `admin@cysmf.org`
4. **Click**: "Send Magic Link"
5. **Check your email** and click the link

---

## 🎯 What You'll See

### Dashboard (`/portal`)
- **KPI Cards**: Reports submitted, pending approvals, compliance %
- **Line Chart**: Souls saved over 6 months
- **Bar Chart**: Universities reached by region
- **Pie Chart**: Uploads by platform (YouTube, Instagram, etc.)

### Reports (`/portal/reports`)
- **14 reports** with different statuses
- **Filter** by month, region, university, status
- **Actions**: View, Edit, Approve, Reject
- **Export**: CSV, PDF

### Create Report (`/portal/reports/new`)
- **Full form** with validation
- **File uploads** for attachments
- **Auto-save** as draft

### Events (`/portal` or `/events`)
- **3 upcoming events**
- **Calendar view**
- **RSVP functionality**

### Settings (`/portal/settings`)
- **Profile editor**
- **Admin status** (you're already ADMIN)
- **Sign out**

---

## 🎨 Features to Explore

### 1. Create a New Report
1. Go to `/portal/reports/new`
2. Fill in the form (all fields are validated)
3. Upload attachments (optional)
4. Click "Submit" or "Save Draft"

### 2. Approve/Reject Reports
1. Go to `/portal/reports`
2. Click on any "submitted" report
3. Review the details
4. Click "Approve" or "Reject" with a comment

### 3. Export Data
1. Go to `/portal/exports`
2. Select date range and filters
3. Choose format: CSV or PDF
4. Download your report

### 4. View Public Site
1. Go to http://localhost:3000
2. See the **live KPI counters** (from approved reports)
3. Browse **Events**, **Campus Map**, **Media**
4. Try the **Get Involved** forms

---

## 🔧 Troubleshooting

### Can't sign in?
- Make sure you're using the correct credentials:
  - Email: `admin@cysmf.org`
  - Password: `Admin123!`
- Try refreshing the page
- Clear browser cache/cookies

### Not seeing data?
- The script created 14 reports - check `/portal/reports`
- Some reports are "approved" (show in public KPIs)
- Some are "submitted" or "draft" (only visible in portal)

### Magic link not working?
- Use **password sign-in** instead (it's more reliable)
- If you must use magic link, wait for the NEW email
- Old magic links won't work after the recent fixes

---

## 📝 Next Steps

### 1. Change Your Password
1. Go to Supabase Dashboard
2. Authentication → Users
3. Find `admin@cysmf.org`
4. Click "..." → Reset Password
5. Or create a new user with your own email

### 2. Invite Team Members
1. They sign up at `/auth`
2. They get "CAMPUS_LEADER" role by default
3. You can promote them in Supabase or add role management UI

### 3. Add Real Data
1. Go to `/portal/reports/new`
2. Create real monthly reports
3. Upload actual attachments
4. Approve them to show on homepage

### 4. Customize
- **Colors**: Edit `tailwind.config.ts`
- **Logo**: Add to `public/` and update `Navbar.tsx`
- **Content**: Edit pages in `app/(public)/`
- **Forms**: Modify `components/ReportForm.tsx`

---

## 🎉 You're Ready!

Your CYSMF portal is fully functional with:
- ✅ Authentication (password + magic link)
- ✅ Role-based access control
- ✅ Monthly reporting system
- ✅ Dashboard with charts
- ✅ Export functionality
- ✅ Public website with live KPIs
- ✅ Campus map with Mapbox
- ✅ Event management
- ✅ Media gallery
- ✅ Get involved forms

**Enjoy building your campus ministry!** 🙏
