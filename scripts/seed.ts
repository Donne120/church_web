/**
 * Seed Script for CYSMF Database
 * Run with: npm run seed
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Use service role key to bypass RLS for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample regions in Rwanda
const regions = [
  'Kigali',
  'Eastern Province',
  'Western Province',
  'Northern Province',
  'Southern Province',
];

// Sample universities in Rwanda
const universities = [
  { name: 'University of Rwanda - Gikondo Campus', city: 'Kigali', region: 'Kigali', lat: -1.9706, lng: 30.0619 },
  { name: 'University of Rwanda - Remera Campus', city: 'Kigali', region: 'Kigali', lat: -1.9536, lng: 30.0906 },
  { name: 'University of Rwanda - Nyarugenge Campus', city: 'Kigali', region: 'Kigali', lat: -1.9578, lng: 30.0611 },
  { name: 'Adventist University of Central Africa (AUCA)', city: 'Kigali', region: 'Kigali', lat: -1.9441, lng: 30.0936 },
  { name: 'Kigali Independent University (ULK)', city: 'Kigali', region: 'Kigali', lat: -1.9706, lng: 30.1044 },
  { name: 'Protestant Institute of Arts and Social Sciences (PIASS)', city: 'Huye', region: 'Southern Province', lat: -2.5971, lng: 29.7389 },
  { name: 'University of Rwanda - Huye Campus', city: 'Huye', region: 'Southern Province', lat: -2.5971, lng: 29.7389 },
  { name: 'University of Rwanda - Busogo Campus', city: 'Musanze', region: 'Northern Province', lat: -1.4983, lng: 29.6339 },
  { name: 'University of Kigali (UoK)', city: 'Kigali', region: 'Kigali', lat: -1.9536, lng: 30.0606 },
  { name: 'Mount Kenya University Rwanda', city: 'Kigali', region: 'Kigali', lat: -1.9706, lng: 30.1044 },
  { name: 'University of Rwanda - Rukara Campus', city: 'Kayonza', region: 'Eastern Province', lat: -1.8833, lng: 30.4167 },
  { name: 'University of Rwanda - Kitabi Campus', city: 'Nyamagabe', region: 'Southern Province', lat: -2.5667, lng: 29.4167 },
  { name: 'INES-Ruhengeri', city: 'Musanze', region: 'Northern Province', lat: -1.5000, lng: 29.6333 },
  { name: 'University of Lay Adventists of Kigali (UNILAK)', city: 'Kigali', region: 'Kigali', lat: -1.9706, lng: 30.1044 },
  { name: 'Catholic University of Kabgayi', city: 'Muhanga', region: 'Southern Province', lat: -2.0167, lng: 29.7833 },
];

async function seed() {
  console.log('🌱 Starting seed process...\n');

  try {
    // Seed universities
    console.log('📚 Seeding universities...');
    const { data: existingUnis, error: checkError } = await supabase
      .from('universities')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking universities:', checkError);
      throw checkError;
    }

    if (existingUnis && existingUnis.length > 0) {
      console.log('⚠️  Universities already exist. Skipping...');
    } else {
      const { error: uniError } = await supabase
        .from('universities')
        .insert(universities);

      if (uniError) {
        console.error('Error inserting universities:', uniError);
        throw uniError;
      }

      console.log(`✅ Inserted ${universities.length} universities`);
    }

    // Seed sample events
    console.log('\n📅 Seeding sample events...');
    const sampleEvents = [
      {
        title: 'Campus Outreach - University of Rwanda',
        description: 'Join us for an evangelistic outreach on campus. We\'ll be sharing the Gospel and distributing tracts.',
        start_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
        location: 'University of Rwanda - Gikondo Campus',
        category: 'Outreach',
        capacity: 50,
      },
      {
        title: 'Regional Leadership Training',
        description: 'Training session for regional and campus leaders on discipleship and leadership.',
        start_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
        location: 'CYSMF National Office, Kigali',
        category: 'Training',
        capacity: 100,
      },
      {
        title: 'Prayer and Worship Night',
        description: 'An evening of corporate prayer and worship for all members.',
        start_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Various Campus Locations',
        category: 'Worship',
        capacity: null,
      },
    ];

    const { error: eventsError } = await supabase
      .from('events')
      .insert(sampleEvents);

    if (eventsError) {
      console.error('Error inserting events:', eventsError);
    } else {
      console.log(`✅ Inserted ${sampleEvents.length} sample events`);
    }

    console.log('\n✨ Seed process completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run the SQL migration in Supabase SQL Editor');
    console.log('2. Create storage buckets: report-attachments (private), media (public)');
    console.log('3. Sign in to the app and bootstrap the first admin user');
    console.log('4. Start creating monthly reports!\n');

  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

seed();

