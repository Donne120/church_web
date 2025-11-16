/**
 * Update Script - Add correct Kigali universities with coordinates
 * Run with: npx tsx scripts/update-kigali-universities.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Correct Kigali universities with accurate coordinates
const kigaliUniversities = [
  {
    name: 'Adventist University of Central Africa (AUCA)',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9441,
    lng: 30.0936,
  },
  {
    name: 'African Leadership University (ALU) - Rwanda',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9536,
    lng: 30.0919,
  },
  {
    name: 'Mount Kigali University',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9706,
    lng: 30.1044,
  },
  {
    name: 'Université Libre de Kigali (ULK)',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9706,
    lng: 30.1044,
  },
  {
    name: 'University of Global Health Equity (UGHE)',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9536,
    lng: 30.0606,
  },
  {
    name: 'University of Kigali (UoK)',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9536,
    lng: 30.0606,
  },
  {
    name: 'University of Lay Adventists of Kigali (UNILAK)',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9706,
    lng: 30.1044,
  },
  {
    name: 'University of Rwanda (UR) – Nyarugenge Campus',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9578,
    lng: 30.0611,
  },
  {
    name: 'University of Rwanda (UR) – Gikondo Campus',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9706,
    lng: 30.0619,
  },
  {
    name: 'University of Rwanda (UR) – Remera Campus',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9536,
    lng: 30.0906,
  },
  {
    name: 'University of Tourism, Technology and Business Studies (UTB)',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9536,
    lng: 30.0606,
  },
  {
    name: 'Vatel School Rwanda',
    city: 'Kigali',
    region: 'Kigali City',
    lat: -1.9536,
    lng: 30.0919,
  },
];

async function updateUniversities() {
  console.log('🎓 Starting Kigali Universities Update...\n');

  try {
    // Step 1: Delete old universities that are not in Kigali City
    console.log('🗑️  Cleaning up old universities...');
    const { error: deleteError } = await supabase
      .from('universities')
      .delete()
      .neq('region', 'Kigali City');

    if (deleteError) {
      console.error('⚠️  Error deleting old universities:', deleteError);
    } else {
      console.log('✅ Cleaned up old universities');
    }

    // Step 2: Insert/Update Kigali universities
    console.log('\n📍 Adding Kigali universities with coordinates...');
    
    for (const uni of kigaliUniversities) {
      // Check if university exists
      const { data: existing } = await supabase
        .from('universities')
        .select('id')
        .eq('name', uni.name)
        .single();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from('universities')
          .update({
            city: uni.city,
            region: uni.region,
            lat: uni.lat,
            lng: uni.lng,
          })
          .eq('name', uni.name);

        if (updateError) {
          console.error(`❌ Error updating ${uni.name}:`, updateError);
        } else {
          console.log(`✅ Updated: ${uni.name}`);
        }
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('universities')
          .insert([uni]);

        if (insertError) {
          console.error(`❌ Error inserting ${uni.name}:`, insertError);
        } else {
          console.log(`✅ Added: ${uni.name}`);
        }
      }
    }

    // Step 3: Verify the data
    console.log('\n📊 Verifying data...');
    const { data: allUniversities, error: verifyError } = await supabase
      .from('universities')
      .select('*')
      .order('name', { ascending: true });

    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
    } else {
      console.log(`\n✅ Total universities in database: ${allUniversities?.length || 0}`);
      console.log('\n📋 Universities by region:');
      
      const byRegion = (allUniversities || []).reduce((acc, uni) => {
        if (!acc[uni.region]) acc[uni.region] = [];
        acc[uni.region].push(uni.name);
        return acc;
      }, {} as Record<string, string[]>);

      Object.entries(byRegion).forEach(([region, unis]) => {
        console.log(`\n  ${region} (${unis.length}):`);
        unis.forEach(name => console.log(`    - ${name}`));
      });
    }

    console.log('\n✨ Update completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Refresh your browser at http://localhost:3000/campus');
    console.log('  2. View the interactive map with all 12 Kigali universities');
    console.log('  3. Start adding campus playbook data (contacts, best times, etc.)');
    console.log('  4. Create permission requests for campuses you want to reach\n');

  } catch (error) {
    console.error('\n❌ Update failed:', error);
    process.exit(1);
  }
}

updateUniversities();

