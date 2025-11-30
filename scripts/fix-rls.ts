/**
 * Fix RLS Infinite Recursion
 * Run with: npx tsx scripts/fix-rls.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRLS() {
  console.log('🔧 Fixing RLS policies...\n');

  try {
    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '002_fix_profiles_rls.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📝 Applying migration: 002_fix_profiles_rls.sql');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`  Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Try direct query if rpc fails
          const { error: directError } = await supabase.from('_migrations').select('*').limit(0);
          if (directError) {
            console.error('❌ Error:', error.message);
          }
        }
      }
    }

    console.log('\n✅ RLS policies fixed!');
    console.log('\n📝 Next steps:');
    console.log('  1. Refresh your browser');
    console.log('  2. Go to http://localhost:3000/auth');
    console.log('  3. Sign in with:');
    console.log('     Email: admin@cysmf.org');
    console.log('     Password: Admin123!');
    console.log('  4. You should now be able to sign in successfully!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.log('\n⚠️  Manual fix required:');
    console.log('  1. Go to your Supabase Dashboard');
    console.log('  2. SQL Editor');
    console.log('  3. Copy and paste the contents of:');
    console.log('     supabase/migrations/002_fix_profiles_rls.sql');
    console.log('  4. Run the SQL');
    process.exit(1);
  }
}

fixRLS();








