/**
 * KPI (Key Performance Indicators) utilities
 * Fetches aggregated metrics from approved monthly reports
 */

import { supabase } from './supabase/browser';

export interface PublicKPIs {
  month: string;
  universities_reached: number;
  tracts_given: number;
  souls_saved: number;
  integrations: number;
  meetings: number;
  hours_invested: number;
  prayer_hours: number;
  literature_money: number;
  literature_count: number;
}

/**
 * Get KPIs for a specific month or the latest available month
 */
export async function getKPIs(month?: string): Promise<PublicKPIs | null> {
  try {
    let query = supabase
      .from('public_kpis')
      .select('*');

    if (month) {
      query = query.eq('month', month);
    } else {
      query = query.order('month', { ascending: false }).limit(1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch KPIs:', error);
    return null;
  }
}

/**
 * Get KPIs for multiple months (for charts)
 */
export async function getKPIHistory(months: number = 6): Promise<PublicKPIs[]> {
  try {
    const { data, error } = await supabase
      .from('public_kpis')
      .select('*')
      .order('month', { ascending: false })
      .limit(months);

    if (error) {
      console.error('Error fetching KPI history:', error);
      throw error;
    }

    return (data || []).reverse(); // Return in chronological order
  } catch (error) {
    console.error('Failed to fetch KPI history:', error);
    return [];
  }
}

/**
 * Calculate compliance percentage for a given period
 * Note: This requires admin/secretariat access to see all profiles
 */
export async function calculateCompliance(month: string): Promise<number> {
  try {
    // Get total number of unique reporters (approximation of active campus leaders)
    const { data: allReporters, error: reportersError } = await supabase
      .from('monthly_reports')
      .select('reporter_id')
      .not('reporter_id', 'is', null);

    if (reportersError) {
      console.warn('Could not fetch reporters:', reportersError);
      return 0;
    }

    // Get unique reporter IDs
    const uniqueReporters = new Set(allReporters?.map(r => r.reporter_id) || []);
    const totalLeaders = uniqueReporters.size;

    if (totalLeaders === 0) return 0;

    // Get number of submitted reports for the month
    const { count: submittedReports, error: reportsError } = await supabase
      .from('monthly_reports')
      .select('*', { count: 'exact', head: true })
      .eq('month', month)
      .in('status', ['submitted', 'approved']);

    if (reportsError) {
      console.warn('Could not fetch reports:', reportsError);
      return 0;
    }

    return Math.round((submittedReports || 0) / totalLeaders * 100);
  } catch (error) {
    console.error('Failed to calculate compliance:', error);
    return 0;
  }
}




