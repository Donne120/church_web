# CYSMF Web Application

A full-featured web application for **Christian Youth and Students Missionary Fellowship (CYSMF)** consisting of a public website and a private Leaders' Portal for monthly accountability and reporting.

## 🚀 Features

### Public Website
- **Home Page**: Live KPI counters, mission statement, latest events and media
- **Events**: Browse and filter events with calendar integration (ICS download)
- **Campus Map**: Interactive map showing CYSMF presence across universities
- **Media Hub**: Videos, audio sermons, and documents with consent management
- **Get Involved**: Multi-tab forms for joining, serving, mentorship, and prayer requests
- **About/Contact**: Organization information and contact forms
- **Privacy & Safeguarding**: Policy pages

### Leaders' Portal
- **Dashboard**: Real-time metrics, charts (line, bar, pie), and compliance tracking
- **Monthly Reports**: Create, submit, and manage activity reports with file uploads
- **Approval Workflow**: Regional leaders and secretariat can review and approve reports
- **Exports**: One-click CSV and PDF exports with formatted national reports
- **Settings**: Profile management and admin bootstrap
- **Role-Based Access Control**: Admin, Secretariat, Regional Leader, Campus Leader, Editor

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Magic Link)
- **Storage**: Supabase Storage
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **PDF Export**: jsPDF + autoTable
- **Date Handling**: dayjs
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
cd cysmf-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project dashboard:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to Project Settings > API
4. Copy the Project URL and anon/public key

### 4. Set Up Supabase Database

#### Run the SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/migrations/000_init.sql`
4. Copy and paste the entire contents into the SQL Editor
5. Click **Run** to execute the migration

This will create all necessary tables, views, policies, and indexes.

#### Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:
   - **`report-attachments`** (Private) - for monthly report file uploads
   - **`media`** (Public) - for media hub content

For the `report-attachments` bucket:
- Set to **Private**
- Add RLS policy to allow authenticated users to upload

For the `media` bucket:
- Set to **Public**
- Allow public read access

### 5. Seed the Database

Run the seed script to populate initial data:

```bash
npm run seed
```

This will insert:
- Sample universities across Nigeria
- Sample regions
- Sample events

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👤 First-Time Setup

### Bootstrap Admin User

1. Navigate to [http://localhost:3000/auth](http://localhost:3000/auth)
2. Enter your email address
3. Check your email for the magic link
4. Click the link to sign in
5. You'll be redirected to the portal
6. Go to **Settings**
7. Click **"Become Administrator"** (one-time action when no admin exists)

Now you have full admin access!

## 📊 User Roles

| Role | Permissions |
|------|------------|
| **ADMIN** | Full access to all features and data |
| **SECRETARIAT** | View all reports, approve reports, manage system |
| **REGIONAL_LEADER** | View and approve reports in their region |
| **CAMPUS_LEADER** | Create and manage their own reports |
| **EDITOR** | Manage media content |

## 🗂️ Project Structure

```
cysmf-app/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages
│   │   ├── page.tsx         # Home
│   │   ├── events/          # Events pages
│   │   ├── campus/          # Campus map
│   │   ├── media/           # Media hub
│   │   ├── get-involved/    # Get involved forms
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact form
│   │   ├── auth/            # Authentication
│   │   └── ...
│   └── portal/              # Protected portal
│       ├── page.tsx         # Dashboard
│       ├── reports/         # Reports management
│       ├── exports/         # Data exports
│       └── settings/        # User settings
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ReportForm.tsx
│   ├── Charts/
│   └── ...
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase clients
│   ├── auth.ts             # Auth helpers
│   ├── rbac.ts             # Role-based access control
│   ├── kpis.ts             # KPI calculations
│   ├── csv.ts              # CSV export
│   └── pdf.ts              # PDF export
├── supabase/
│   └── migrations/         # Database migrations
├── scripts/
│   └── seed.ts             # Database seeding
├── public/                 # Static assets
│   └── manifest.json       # PWA manifest
└── middleware.ts           # Route protection
```

## 🔒 Security Features

- **Row Level Security (RLS)**: All database tables have RLS policies
- **Role-Based Access Control**: Fine-grained permissions
- **Protected Routes**: Middleware protects portal routes
- **Secure File Uploads**: Private storage with signed URLs
- **Input Validation**: Zod schemas for all forms
- **Audit Logging**: Track all report actions

## 📱 PWA Support

The app includes a Progressive Web App manifest for installability on mobile devices.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Post-Deployment

1. Verify Supabase connection
2. Run the seed script (if not done locally)
3. Create your first admin user
4. Test all features

## 📝 Usage Guide

### Creating a Monthly Report

1. Sign in to the Leaders' Portal
2. Navigate to **Reports** > **New Report**
3. Fill in all required fields:
   - Month and region
   - University/campus
   - Meetings and hours
   - Outreach metrics (tracts, souls, integrations)
   - Social media uploads
   - Literature distribution
   - Remarks and attachments (optional)
4. Click **Save as Draft** or **Submit Report**

### Approving Reports

1. Regional Leaders and Secretariat can approve reports
2. Navigate to **Reports**
3. Click on a submitted report
4. Review the details
5. Add a comment (optional)
6. Click **Approve** or **Reject**

### Exporting Data

1. Navigate to **Exports**
2. Select the month
3. Choose export format:
   - **CSV**: Raw data for analysis
   - **PDF**: Formatted national report

## 🐛 Troubleshooting

### Can't sign in
- Check that your Supabase URL and anon key are correct
- Verify email is being sent (check Supabase Auth logs)
- Check spam folder for magic link email

### Database errors
- Ensure SQL migration ran successfully
- Check RLS policies are enabled
- Verify storage buckets are created

### File upload issues
- Check storage bucket permissions
- Verify bucket names match code (`report-attachments`, `media`)
- Ensure file size is under 10MB

## 🤝 Contributing

This is a private project for CYSMF. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Copyright © 2025 Christian Youth and Students Missionary Fellowship (CYSMF). All rights reserved.

## 📞 Support

For technical support or questions:
- Email: support@cysmf.org
- Phone: +234 XXX XXX XXXX

## 🙏 Acknowledgments

Built with love for the CYSMF community to better track and celebrate God's work on campuses across Nigeria.

---

**Version**: 1.0.0  
**Last Updated**: November 2025
