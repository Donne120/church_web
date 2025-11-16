/**
 * Cleanup Script - Remove old Nigerian data and keep only Rwanda data
 * Run with: npx tsx scripts/cleanup-old-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanup() {
  console.log('🧹 Starting cleanup process...\n');

  try {
    // Delete old Nigerian universities
    console.log('🗑️  Deleting old universities...');
    const { error: uniError } = await supabase
      .from('universities')
      .delete()
      .neq('region', 'Kigali')
      .neq('region', 'Eastern Province')
      .neq('region', 'Western Province')
      .neq('region', 'Northern Province')
      .neq('region', 'Southern Province');

    if (uniError) {
      console.error('Error deleting universities:', uniError);
    } else {
      console.log('✅ Deleted old universities');
    }

    // Delete old events mentioning Lagos/Nigeria
    console.log('\n🗑️  Deleting old events...');
    const { error: eventsError } = await supabase
      .from('events')
      .delete()
      .or('title.ilike.%Lagos%,location.ilike.%Lagos%');

    if (eventsError) {
      console.error('Error deleting events:', eventsError);
    } else {
      console.log('✅ Deleted old events');
    }

    console.log('\n✨ Cleanup completed successfully!');
    console.log('\n📝 Next step: Refresh your browser to see the updated data\n');

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();




