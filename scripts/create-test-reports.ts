/**
 * Create Test Reports Script
 * Run with: npx tsx scripts/create-test-reports.ts
 * 
 * This creates sample monthly reports so you can test the portal dashboard
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import dayjs from 'dayjs';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestReports() {
  console.log('📊 Creating test monthly reports...\n');

  try {
    // Step 1: Get the first user (should be you, the admin)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
      console.error('❌ No profiles found. Please sign in first to create your profile.');
      process.exit(1);
    }

    const adminProfile = profiles[0];
    console.log(`✅ Found profile: ${adminProfile.full_name || adminProfile.email}`);

    // Step 2: Get universities
    const { data: universities, error: uniError } = await supabase
      .from('universities')
      .select('*')
      .limit(5);

    if (uniError || !universities || universities.length === 0) {
      console.error('❌ No universities found. Please run the seed script first.');
      process.exit(1);
    }

    console.log(`✅ Found ${universities.length} universities\n`);

    // Step 3: Create test reports for the last 6 months
    const reports = [];
    const months = [];
    
    for (let i = 0; i < 6; i++) {
      const month = dayjs().subtract(i, 'month').format('YYYY-MM');
      months.push(month);
    }

    console.log('📝 Creating reports for months:', months.join(', '));

    for (const month of months) {
      // Create 2-3 reports per month from different universities
      const numReports = Math.floor(Math.random() * 2) + 2; // 2-3 reports
      
      for (let i = 0; i < numReports && i < universities.length; i++) {
        const university = universities[i];
        
        const report = {
          month,
          reporter_id: adminProfile.id,
          region: university.region || 'Kigali City',
          university_id: university.id,
          
          // Random but realistic metrics
          meetings_count: Math.floor(Math.random() * 8) + 4, // 4-12 meetings
          hours_invested: Math.floor(Math.random() * 40) + 20, // 20-60 hours
          
          uploads_by_platform: {
            youtube: Math.floor(Math.random() * 5),
            instagram: Math.floor(Math.random() * 10),
            tiktok: Math.floor(Math.random() * 8),
            facebook: Math.floor(Math.random() * 6),
            other: Math.floor(Math.random() * 3),
          },
          
          universities_reached: Math.floor(Math.random() * 3) + 1, // 1-4
          tracts_given: Math.floor(Math.random() * 200) + 100, // 100-300
          souls_saved: Math.floor(Math.random() * 15) + 5, // 5-20
          integrations_count: Math.floor(Math.random() * 10) + 3, // 3-13
          
          literature_money: Math.floor(Math.random() * 50000) + 10000, // 10,000-60,000 FRw
          literature_count: Math.floor(Math.random() * 30) + 10, // 10-40
          
          remarks: `Test report for ${university.name} - ${month}. This is sample data for demonstration.`,
          attachments: [],
          
          // Mix of statuses
          status: i === 0 ? 'approved' : (Math.random() > 0.5 ? 'submitted' : 'draft'),
          reviewer_comment: i === 0 ? 'Approved - Great work!' : null,
          reviewed_by: i === 0 ? adminProfile.id : null,
        };
        
        reports.push(report);
      }
    }

    console.log(`\n📊 Inserting ${reports.length} test reports...`);

    // Insert all reports
    const { data: insertedReports, error: insertError } = await supabase
      .from('monthly_reports')
      .insert(reports)
      .select();

    if (insertError) {
      console.error('❌ Error inserting reports:', insertError);
      process.exit(1);
    }

    console.log(`✅ Successfully created ${insertedReports?.length || 0} reports!\n`);

    // Step 4: Show summary
    console.log('📊 Summary by status:');
    const statusCounts = reports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    console.log('\n📊 Summary by month:');
    const monthCounts = reports.reduce((acc, r) => {
      acc[r.month] = (acc[r.month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(monthCounts).forEach(([month, count]) => {
      console.log(`  ${month}: ${count} reports`);
    });

    console.log('\n✨ Test data created successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Refresh your browser at http://localhost:3000/portal');
    console.log('  2. You should now see:');
    console.log('     - Dashboard with KPI cards and charts');
    console.log('     - Reports in the reports table');
    console.log('     - Data in all the charts (line, bar, pie)');
    console.log('  3. Try:');
    console.log('     - Filtering by month');
    console.log('     - Viewing report details');
    console.log('     - Approving/rejecting reports');
    console.log('     - Exporting data to CSV/PDF\n');

  } catch (error) {
    console.error('\n❌ Error creating test reports:', error);
    process.exit(1);
  }
}

createTestReports();







