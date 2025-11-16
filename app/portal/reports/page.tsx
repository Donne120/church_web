'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/browser';
import { getCurrentProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Edit } from 'lucide-react';
import dayjs from 'dayjs';
import type { Profile } from '@/lib/rbac';

export default function ReportsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, statusFilter, monthFilter]);

  async function loadReports() {
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

      // Fetch reports based on role
      let reportsQuery = supabase
        .from('monthly_reports')
        .select(`
          *,
          reporter:profiles!monthly_reports_reporter_id_fkey(full_name),
          university:universities(name)
        `)
        .order('created_at', { ascending: false });

      // Filter by role
      if (profileData?.role === 'CAMPUS_LEADER') {
        reportsQuery = reportsQuery.eq('reporter_id', user.id);
      } else if (profileData?.role === 'REGIONAL_LEADER') {
        reportsQuery = reportsQuery.eq('region', profileData.region);
      }
      // ADMIN and SECRETARIAT see all reports

      const { data: reportsData, error } = await reportsQuery;

      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }

      setReports(reportsData || []);

    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterReports() {
    let filtered = [...reports];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (monthFilter !== 'all') {
      filtered = filtered.filter(r => r.month === monthFilter);
    }

    setFilteredReports(filtered);
  }

  const months = Array.from(new Set(reports.map(r => r.month))).sort().reverse();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B66]">Reports</h1>
          <p className="text-gray-600 mt-1">Manage monthly activity reports</p>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {dayjs(month).format('MMMM YYYY')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">No reports found</p>
            <Button asChild>
              <Link href="/portal/reports/new">Create Your First Report</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {dayjs(report.month).format('MMMM YYYY')}
                      </h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Region:</span> {report.region}
                      </p>
                      <p>
                        <span className="font-medium">Campus:</span>{' '}
                        {report.university?.name || 'N/A'}
                      </p>
                      {report.reporter && (
                        <p>
                          <span className="font-medium">Reporter:</span>{' '}
                          {report.reporter.full_name || report.reporter.email}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Submitted:</span>{' '}
                        {dayjs(report.created_at).format('MMM D, YYYY')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/portal/reports/${report.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    {report.status === 'draft' || report.status === 'rejected' ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/portal/reports/${report.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


