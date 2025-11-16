# ✅ Join Requests System - Complete

## 🎯 Overview

A complete system that allows people to submit requests to join ministry teams or programs, and admins can review and approve/reject them.

---

## 🎨 Features

### **For Visitors/Members:**
- ✅ Submit join requests through a beautiful form
- ✅ Choose between Teams or Programs
- ✅ Select from 6 ministry teams or 9 programs
- ✅ Provide motivation, experience, and availability
- ✅ Track request status (pending/approved/rejected)

### **For Admins/Secretariat:**
- ✅ View all join requests in one place
- ✅ See pending, approved, and rejected counts
- ✅ Review detailed applicant information
- ✅ Approve or reject requests with optional comments
- ✅ Track who reviewed each request and when

---

## 📋 Available Teams

1. **Media Team** - Content creation, social media management
2. **Literature Group** - Book distribution, reading programs
3. **Evangelism Team** - Campus outreach, sharing the gospel
4. **Prayer Team** - Intercession, worship, prayer meetings
5. **Worship Team** - Music ministry, worship leading
6. **Admin Team** - Organization, coordination, planning

---

## 📋 Available Programs

1. **Campus Ministry** - General campus outreach
2. **Friday Prayer Group** - Weekly Friday prayer
3. **Literature Prayer Group** - Prayer for literature ministry
4. **Media Prayer Group** - Prayer for media ministry
5. **Intercession Prayer** - Dedicated intercession
6. **Worship Prayer** - Worship-focused prayer
7. **Evangelism Prayer** - Prayer for evangelism
8. **Leadership Training** - For aspiring leaders
9. **Discipleship Program** - New believer follow-up

---

## 🚀 Setup Instructions

### **Step 1: Run the SQL**

1. Open Supabase Dashboard: https://uhpmjlgvxcfvmrxzrspo.supabase.co
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `CREATE_JOIN_REQUESTS_SYSTEM.sql`
4. Click **Run**
5. You should see "Success" message

### **Step 2: Restart Your Dev Server**

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### **Step 3: Test the Feature**

#### **As a Visitor:**
1. Go to http://localhost:3000
2. Click **"Join a Team or Program"** button (big yellow button)
3. Fill out the form:
   - Choose Team or Program
   - Select which one you want to join
   - Fill in your information
   - Write your motivation
   - Submit!
4. You'll see a success message

#### **As Admin:**
1. Login to the portal
2. Click **"Join Requests"** in the sidebar (only visible to admins)
3. You'll see all pending requests
4. Click **"Review Request"** on any request
5. Add an optional comment
6. Click **"Approve"** or **"Reject"**

---

## 📊 Database Schema

### **join_requests Table:**

```sql
id UUID PRIMARY KEY
user_id UUID (references profiles - optional)
request_type TEXT ('team' or 'program')
team_name TEXT (if joining a team)
program_name TEXT (if joining a program)
full_name TEXT
email TEXT
phone TEXT
university TEXT
region TEXT
motivation TEXT (why they want to join)
experience TEXT (optional)
availability TEXT (optional)
status TEXT ('pending', 'approved', 'rejected')
reviewed_by UUID (who reviewed it)
reviewed_at TIMESTAMPTZ (when reviewed)
reviewer_comment TEXT (optional feedback)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## 🔐 Security (RLS Policies)

✅ **Anyone** can submit a join request (even without login)  
✅ **Authenticated users** can view their own requests  
✅ **Admins/Secretariat** can view all requests  
✅ **Admins/Secretariat** can approve/reject requests  
❌ **Regular users** cannot see other people's requests  

---

## 🎯 User Flow

### **Visitor Journey:**
```
1. Visit homepage
   ↓
2. Click "Join a Team or Program"
   ↓
3. Choose Team or Program
   ↓
4. Select specific team/program
   ↓
5. Fill in personal info
   ↓
6. Write motivation & details
   ↓
7. Submit request
   ↓
8. Receive confirmation
```

### **Admin Journey:**
```
1. Login to portal
   ↓
2. Go to "Join Requests"
   ↓
3. See pending requests count
   ↓
4. Click "Review Request"
   ↓
5. Read applicant details
   ↓
6. Add optional comment
   ↓
7. Approve or Reject
   ↓
8. Applicant is notified (future: email)
```

---

## 📁 Files Created

### **Database:**
- `CREATE_JOIN_REQUESTS_SYSTEM.sql` - Database schema and RLS policies

### **Frontend:**
- `app/(public)/join/page.tsx` - Public join request form
- `app/portal/join-requests/page.tsx` - Admin review page

### **Updated:**
- `app/(public)/page.tsx` - Added "Join" button to homepage
- `app/portal/layout.tsx` - Added "Join Requests" to sidebar (admin-only)

---

## 🎨 UI/UX Features

### **Join Form:**
- ✅ Beautiful, modern design
- ✅ Radio buttons for team selection with icons
- ✅ Dropdown for program selection
- ✅ Clear labels and descriptions
- ✅ Form validation
- ✅ Success toast notification
- ✅ Auto-redirect after submission

### **Admin Dashboard:**
- ✅ Stats cards (Pending, Approved, Rejected counts)
- ✅ Expandable request cards
- ✅ Inline review form
- ✅ Color-coded status badges
- ✅ Reviewer tracking
- ✅ Timestamp display

---

## 🔄 Future Enhancements (Optional)

1. **Email Notifications:**
   - Send email when request is submitted
   - Send email when request is approved/rejected

2. **User Dashboard:**
   - Let users view their request status
   - Show history of all their requests

3. **Bulk Actions:**
   - Approve/reject multiple requests at once

4. **Advanced Filtering:**
   - Filter by team/program
   - Filter by region
   - Filter by date range

5. **Analytics:**
   - Most popular teams
   - Approval rates
   - Response time metrics

---

## 🆘 Troubleshooting

### **Problem: Can't see "Join Requests" in sidebar**
**Solution:** You need to be logged in as ADMIN or SECRETARIAT role.

### **Problem: Error submitting join request**
**Solution:** Make sure you ran the SQL script in Supabase.

### **Problem: Can't approve/reject requests**
**Solution:** Check your role - only ADMIN and SECRETARIAT can review.

### **Problem: Form doesn't submit**
**Solution:** Make sure all required fields are filled (name, email, motivation, and team/program selection).

---

## ✅ Testing Checklist

- [ ] Public form loads at /join
- [ ] Can select team or program
- [ ] Can fill in all fields
- [ ] Form submits successfully
- [ ] Success toast appears
- [ ] Admin can see "Join Requests" in sidebar
- [ ] Admin can view all requests
- [ ] Admin can approve requests
- [ ] Admin can reject requests
- [ ] Status updates correctly
- [ ] Reviewed requests show reviewer info

---

## 🎉 Result

You now have a complete join request system! People can easily express interest in joining your ministry, and admins can efficiently review and manage these requests.

**Public Form:** http://localhost:3000/join  
**Admin Dashboard:** http://localhost:3000/portal/join-requests

