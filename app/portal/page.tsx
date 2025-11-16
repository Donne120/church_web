'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/browser';
import { getCurrentProfile } from '@/lib/auth';
import { getKPIHistory, calculateCompliance } from '@/lib/kpis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import KPICard from '@/components/KPICard';
import ChartLine from '@/components/ChartLine';
import ChartBar from '@/components/ChartBar';
import ChartPie from '@/components/ChartPie';
import MonthPicker from '@/components/MonthPicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, CheckCircle, AlertCircle, TrendingUp, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import type { Profile } from '@/lib/rbac';

export default function PortalDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [stats, setStats] = useState<any>({});
  const [kpiHistory, setKpiHistory] = useState<any[]>([]);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [compliance, setCompliance] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth, selectedRegion]);

  async function loadDashboardData() {
    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch reports stats
      let reportsQuery = supabase
        .from('monthly_reports')
        .select('*', { count: 'exact' })
        .eq('month', selectedMonth);

      // Filter by region if applicable
      if (selectedRegion !== 'all') {
        reportsQuery = reportsQuery.eq('region', selectedRegion);
      }

      // Filter by reporter if not admin/secretariat
      if (profileData?.role === 'CAMPUS_LEADER') {
        reportsQuery = reportsQuery.eq('reporter_id', user.id);
      } else if (profileData?.role === 'REGIONAL_LEADER') {
        reportsQuery = reportsQuery.eq('region', profileData.region);
      }

      const { data: reportsData, count: totalReports } = await reportsQuery;

      // Calculate stats
      const submitted = reportsData?.filter(r => r.status === 'submitted').length || 0;
      const approved = reportsData?.filter(r => r.status === 'approved').length || 0;
      const pending = reportsData?.filter(r => r.status === 'submitted').length || 0;
      const draft = reportsData?.filter(r => r.status === 'draft').length || 0;
      const rejected = reportsData?.filter(r => r.status === 'rejected').length || 0;

      setStats({
        totalReports: totalReports || 0,
        submitted,
        approved,
        pending,
        draft,
        rejected,
      });

      // Fetch all additional data in parallel for better performance
      const [kpiData, complianceRate, regionalReports, platformReports] = await Promise.all([
        getKPIHistory(6),
        calculateCompliance(selectedMonth),
        supabase
          .from('monthly_reports')
          .select('region, universities_reached')
          .eq('month', selectedMonth)
          .eq('status', 'approved')
          .then(({ data }) => data || []),
        supabase
          .from('monthly_reports')
          .select('uploads_by_platform')
          .eq('month', selectedMonth)
          .eq('status', 'approved')
          .then(({ data }) => data || []),
      ]);

      setKpiHistory(kpiData);
      setCompliance(complianceRate);

      // Group regional data
      const regionMap = new Map<string, number>();
      regionalReports.forEach(report => {
        const current = regionMap.get(report.region) || 0;
        regionMap.set(report.region, current + report.universities_reached);
      });

      const regionalChartData = Array.from(regionMap.entries()).map(([region, universities]) => ({
        region,
        universities,
      }));
      setRegionalData(regionalChartData);

      // Group platform data
      const platformMap = new Map<string, number>();
      platformReports.forEach(report => {
        const uploads = report.uploads_by_platform || {};
        Object.entries(uploads).forEach(([platform, count]) => {
          const current = platformMap.get(platform) || 0;
          platformMap.set(platform, current + (count as number));
        });
      });

      const platformChartData = Array.from(platformMap.entries()).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
      setPlatformData(platformChartData);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const regions = Array.from(new Set(regionalData.map(r => r.region)));

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B66]">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {profile?.full_name || 'Leader'}
          </p>
        </div>
        <Button asChild className="bg-[#0D2B66] hover:bg-[#0D2B66]/90">
          <Link href="/portal/reports/new">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Month</label>
              <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
            </div>
            {(profile?.role === 'ADMIN' || profile?.role === 'SECRETARIAT') && (
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Reports"
          value={stats.totalReports || 0}
          icon={FileText}
          description="This month"
        />
        <KPICard
          title="Pending Approval"
          value={stats.pending || 0}
          icon={AlertCircle}
          description="Awaiting review"
        />
        <KPICard
          title="Approved"
          value={stats.approved || 0}
          icon={CheckCircle}
          description="Completed reports"
        />
        <KPICard
          title="Compliance"
          value={`${compliance}%`}
          icon={TrendingUp}
          description="Reporting rate"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Souls Saved Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Souls Saved (Last 6 Months)</CardTitle>
            <CardDescription>Monthly trend of salvation decisions</CardDescription>
          </CardHeader>
          <CardContent>
            {kpiHistory.length > 0 ? (
              <ChartLine
                data={kpiHistory.map(k => ({
                  month: dayjs(k.month).format('MMM YY'),
                  souls: k.souls_saved || 0,
                }))}
                xKey="month"
                yKey="souls"
                color="#0D2B66"
              />
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Regional Universities */}
        <Card>
          <CardHeader>
            <CardTitle>Universities by Region</CardTitle>
            <CardDescription>Current month breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {regionalData.length > 0 ? (
              <ChartBar
                data={regionalData.map(r => ({
                  region: r.region,
                  universities: r.universities,
                }))}
                xKey="region"
                yKey="universities"
                color="#FFB703"
              />
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Platform Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Uploads</CardTitle>
            <CardDescription>Content distribution by platform</CardDescription>
          </CardHeader>
          <CardContent>
            {platformData.length > 0 ? (
              <ChartPie data={platformData} />
            ) : (
              <p className="text-center text-gray-500 py-12">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/portal/reports/new">
                <Plus className="h-4 w-4 mr-2" />
                Submit Monthly Report
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/portal/reports">
                <FileText className="h-4 w-4 mr-2" />
                View All Reports
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/portal/exports">
                <TrendingUp className="h-4 w-4 mr-2" />
                Export Data
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


