# CYSMF Setup Guide

This guide will walk you through setting up the CYSMF web application from scratch.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Supabase account created
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies (5 minutes)

```bash
cd cysmf-app
npm install
```

### 2. Create Supabase Project (10 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: CYSMF
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to Nigeria
4. Wait for project to be created (~2 minutes)
5. Go to **Project Settings** > **API**
6. Copy:
   - **Project URL**
   - **anon/public key**

### 3. Configure Environment Variables (2 minutes)

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migration (5 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/migrations/000_init.sql` from your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (green play button)
7. Verify success (should see "Success. No rows returned")

### 5. Create Storage Buckets (5 minutes)

#### Bucket 1: report-attachments (Private)

1. Go to **Storage** in Supabase dashboard
2. Click **"New bucket"**
3. Name: `report-attachments`
4. Set to **Private**
5. Click **Create bucket**
6. Click on the bucket
7. Go to **Policies** tab
8. Click **"New policy"**
9. Select **"For full customization"**
10. Policy name: `Allow authenticated uploads`
11. Allowed operations: `INSERT`, `SELECT`, `UPDATE`, `DELETE`
12. Policy definition:
```sql
(auth.uid() IS NOT NULL)
```
13. Click **Save**

#### Bucket 2: media (Public)

1. Click **"New bucket"**
2. Name: `media`
3. Set to **Public**
4. Click **Create bucket**

### 6. Seed the Database (2 minutes)

```bash
npm run seed
```

You should see:
```
🌱 Starting seed process...
📚 Seeding universities...
✅ Inserted 15 universities
📅 Seeding sample events...
✅ Inserted 3 sample events
✨ Seed process completed successfully!
```

### 7. Start Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Create First Admin User (5 minutes)

1. Click **"Leader Sign In"** in the navbar
2. Enter your email address
3. Click **"Send Magic Link"**
4. Check your email (may take 1-2 minutes)
5. Click the link in the email
6. You'll be redirected to the portal
7. Go to **Settings** (in sidebar)
8. Click **"Become Administrator"** button
9. You now have full admin access!

## Verification Checklist

After setup, verify everything works:

### Public Site
- [ ] Home page loads with KPI counters
- [ ] Events page shows sample events
- [ ] Campus page shows universities
- [ ] Get Involved forms work
- [ ] Contact form works

### Leaders Portal
- [ ] Can sign in with magic link
- [ ] Dashboard shows charts and metrics
- [ ] Can create a new monthly report
- [ ] Can upload files to reports
- [ ] Can submit report
- [ ] Can view reports list
- [ ] Can export CSV
- [ ] Can export PDF
- [ ] Settings page works

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure `.env.local` exists and has correct values. Restart dev server after creating it.

### Issue: Magic link email not received

**Solutions**:
1. Check spam folder
2. In Supabase, go to **Authentication** > **Email Templates** and verify SMTP is configured
3. For development, check Supabase Auth logs for the magic link URL

### Issue: Database errors when creating reports

**Solutions**:
1. Verify SQL migration ran successfully
2. Check that RLS policies are enabled (they should be by default)
3. Verify you're signed in

### Issue: File uploads fail

**Solutions**:
1. Verify `report-attachments` bucket exists
2. Check bucket is set to Private
3. Verify RLS policy allows authenticated uploads
4. Check file size is under 10MB

### Issue: Charts not showing data

**Solution**: This is normal on first setup. Charts will populate once you:
1. Create and submit monthly reports
2. Approve the reports (changes status to 'approved')
3. Approved reports feed into the public KPIs

## Next Steps

Once setup is complete:

1. **Customize Content**
   - Update About page with your organization details
   - Add real contact information
   - Upload media to Media Hub

2. **Add Users**
   - Invite campus leaders to sign up
   - Assign appropriate roles in the database
   - Train leaders on report submission

3. **Configure Regions**
   - Update regions in seed script if needed
   - Add more universities as needed

4. **Deploy to Production**
   - See README.md for deployment instructions
   - Use Vercel for easy deployment

## Role Assignment

To assign roles to users after they sign up:

1. Go to Supabase dashboard
2. Navigate to **Table Editor** > **profiles**
3. Find the user by email
4. Edit their `role` field:
   - `ADMIN` - Full access
   - `SECRETARIAT` - National oversight
   - `REGIONAL_LEADER` - Regional oversight
   - `CAMPUS_LEADER` - Campus reporting
   - `EDITOR` - Media management
5. Also set their `region` and `university_id` if applicable

## Support

If you encounter issues not covered here:

1. Check the main README.md
2. Review Supabase documentation
3. Check browser console for errors
4. Contact technical support

---

**Setup Time**: ~35 minutes total

**Difficulty**: Intermediate

**Prerequisites**: Basic command line knowledge, email access







