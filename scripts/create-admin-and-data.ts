/**
 * Create Admin User and Test Data Script
 * Run with: npx tsx scripts/create-admin-and-data.ts
 * 
 * This creates:
 * 1. An admin profile (you can use this to sign in)
 * 2. Sample monthly reports
 * 3. Sample events
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
  console.log('\nPlease make sure your .env.local file has:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAndData() {
  console.log('🚀 Creating admin user and test data...\n');

  try {
    // Step 1: Create an admin user
    console.log('👤 Step 1: Creating admin user...');
    
    const adminEmail = 'admin@cysmf.org';
    const adminPassword = 'Admin123!'; // Change this!
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'CYSMF Admin'
      }
    });

    if (authError) {
      console.log('⚠️  User might already exist, trying to fetch...');
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      
      const existingUser = users.find(u => u.email === adminEmail);
      if (!existingUser) throw authError;
      
      console.log('✅ Found existing user:', adminEmail);
      var userId = existingUser.id;
    } else {
      console.log('✅ Created auth user:', adminEmail);
      var userId = authData.user.id;
    }

    // Create/update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: adminEmail,
        full_name: 'CYSMF Admin',
        role: 'ADMIN',
        region: 'Kigali City',
        phone: '+250 XXX XXX XXX'
      });

    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
    } else {
      console.log('✅ Created admin profile');
    }

    // Step 2: Get universities
    console.log('\n📍 Step 2: Getting universities...');
    const { data: universities, error: uniError } = await supabase
      .from('universities')
      .select('*')
      .limit(5);

    if (uniError || !universities || universities.length === 0) {
      console.error('❌ No universities found. Please run: npm run seed');
      process.exit(1);
    }

    console.log(`✅ Found ${universities.length} universities`);

    // Step 3: Create test reports
    console.log('\n📊 Step 3: Creating monthly reports...');
    
    const reports = [];
    const months = [];
    
    // Last 6 months
    for (let i = 0; i < 6; i++) {
      const month = dayjs().subtract(i, 'month').format('YYYY-MM');
      months.push(month);
    }

    console.log('Creating reports for:', months.join(', '));

    for (const month of months) {
      // Create 2-3 reports per month
      const numReports = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numReports && i < universities.length; i++) {
        const university = universities[i];
        
        const report = {
          month,
          reporter_id: userId,
          region: university.region || 'Kigali City',
          university_id: university.id,
          
          meetings_count: Math.floor(Math.random() * 8) + 4,
          hours_invested: Math.floor(Math.random() * 40) + 20,
          
          uploads_by_platform: {
            youtube: Math.floor(Math.random() * 5),
            instagram: Math.floor(Math.random() * 10),
            tiktok: Math.floor(Math.random() * 8),
            facebook: Math.floor(Math.random() * 6),
            other: Math.floor(Math.random() * 3),
          },
          
          universities_reached: Math.floor(Math.random() * 3) + 1,
          tracts_given: Math.floor(Math.random() * 200) + 100,
          souls_saved: Math.floor(Math.random() * 15) + 5,
          integrations_count: Math.floor(Math.random() * 10) + 3,
          
          literature_money: Math.floor(Math.random() * 50000) + 10000,
          literature_count: Math.floor(Math.random() * 30) + 10,
          
          remarks: `Monthly report for ${university.name} - ${month}`,
          attachments: [],
          
          status: i === 0 ? 'approved' : (Math.random() > 0.5 ? 'submitted' : 'draft'),
          reviewer_comment: i === 0 ? 'Approved - Great work!' : null,
          reviewed_by: i === 0 ? userId : null,
        };
        
        reports.push(report);
      }
    }

    const { data: insertedReports, error: insertError } = await supabase
      .from('monthly_reports')
      .insert(reports)
      .select();

    if (insertError) {
      console.error('❌ Error inserting reports:', insertError);
    } else {
      console.log(`✅ Created ${insertedReports?.length || 0} reports`);
    }

    // Step 4: Create some events
    console.log('\n📅 Step 4: Creating sample events...');
    
    const events = [
      {
        title: 'Campus Outreach - AUCA',
        description: 'Weekly campus outreach at Adventist University',
        start_at: dayjs().add(7, 'day').toISOString(),
        end_at: dayjs().add(7, 'day').add(2, 'hour').toISOString(),
        location: 'AUCA Campus, Kigali',
        category: 'Outreach',
        capacity: 100,
        created_by: userId
      },
      {
        title: 'Leadership Training',
        description: 'Monthly leadership training for campus leaders',
        start_at: dayjs().add(14, 'day').toISOString(),
        end_at: dayjs().add(14, 'day').add(3, 'hour').toISOString(),
        location: 'CYSMF Office, Kigali',
        category: 'Training',
        capacity: 50,
        created_by: userId
      },
      {
        title: 'Prayer Night',
        description: 'Monthly prayer and worship night',
        start_at: dayjs().add(21, 'day').toISOString(),
        end_at: dayjs().add(21, 'day').add(2, 'hour').toISOString(),
        location: 'Various Campus Locations',
        category: 'Prayer',
        capacity: 200,
        created_by: userId
      }
    ];

    const { error: eventsError } = await supabase
      .from('events')
      .insert(events);

    if (eventsError) {
      console.error('❌ Error creating events:', eventsError);
    } else {
      console.log(`✅ Created ${events.length} events`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✨ SUCCESS! Everything is set up!');
    console.log('='.repeat(50));
    
    console.log('\n📊 Summary:');
    console.log(`  ✅ Admin user: ${adminEmail}`);
    console.log(`  ✅ Password: ${adminPassword}`);
    console.log(`  ✅ Reports: ${reports.length}`);
    console.log(`  ✅ Events: ${events.length}`);
    
    console.log('\n🔐 Sign In Credentials:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    
    console.log('\n📝 Next Steps:');
    console.log('  1. Go to: http://localhost:3000/auth');
    console.log('  2. Click "Use password instead" (if available)');
    console.log('     OR enter email and use magic link');
    console.log('  3. Sign in with the credentials above');
    console.log('  4. You should see the full portal dashboard!');
    console.log('  5. Go to Settings to verify you\'re an ADMIN');
    
    console.log('\n🎉 Your portal is ready with:');
    console.log('  - Dashboard with KPI cards');
    console.log('  - Charts (line, bar, pie)');
    console.log('  - Monthly reports table');
    console.log('  - Events calendar');
    console.log('  - Export functionality');
    console.log('  - Admin access\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

createAdminAndData();




