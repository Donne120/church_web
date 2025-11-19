'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/browser';
import { getCurrentProfile } from '@/lib/auth';
import { canApproveReports } from '@/lib/rbac';
import { formatDualCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReport();
  }, [params.id]);

  async function loadReport() {
    try {
      // Check localStorage auth first (set by hardcoded login)
      const isAuth = typeof window !== 'undefined' && localStorage.getItem('cysmf_authenticated') === 'true';
      if (!isAuth) {
        router.push('/auth');
        return;
      }

      // Try to get user from localStorage first
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('cysmf_user') : null;
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setProfile({
            id: userData.username || 'admin',
            full_name: userData.full_name || 'CYSMF Admin',
            role: userData.role || 'ADMIN',
            email: userData.email || userData.username || 'admin@cysmf.local',
          });
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Also try to get Supabase session (for RLS queries)
      const { data: { user } } = await supabase.auth.getUser();
      
      // If Supabase user exists, fetch profile from database
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }

      // Fetch the report
      const { data: reportData, error } = await supabase
        .from('monthly_reports')
        .select(`
          *,
          reporter:profiles!monthly_reports_reporter_id_fkey(full_name, email),
          university:universities(name, region),
          reviewer:profiles!monthly_reports_reviewed_by_fkey(full_name)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching report:', error);
        setReport(null);
        return;
      }

      setReport(reportData);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!profile || !report) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('monthly_reports')
        .update({
          status: 'approved',
          reviewed_by: profile.id,
          reviewer_comment: comment || null,
        })
        .eq('id', report.id);

      if (error) throw error;

      toast.success('Report approved successfully');
      router.push('/portal/reports');
    } catch (error: any) {
      console.error('Error approving report:', error);
      toast.error(error.message || 'Failed to approve report');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (!profile || !report || !comment) {
      toast.error('Please provide a comment explaining the rejection');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('monthly_reports')
        .update({
          status: 'rejected',
          reviewed_by: profile.id,
          reviewer_comment: comment,
        })
        .eq('id', report.id);

      if (error) throw error;

      toast.success('Report rejected');
      router.push('/portal/reports');
    } catch (error: any) {
      console.error('Error rejecting report:', error);
      toast.error(error.message || 'Failed to reject report');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Report not found</p>
        <Button asChild>
          <Link href="/portal/reports">Back to Reports</Link>
        </Button>
      </div>
    );
  }

  const canApprove = profile && canApproveReports(profile, report.region) && report.status === 'submitted';
  const uploads = report.uploads_by_platform || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/portal/reports"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Reports
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B66]">
            {dayjs(report.month).format('MMMM YYYY')} Report
          </h1>
          <p className="text-gray-600 mt-1">{report.university?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {profile && report.reporter_id === profile.id && report.status === 'draft' && (
            <Button asChild variant="outline">
              <Link href={`/portal/reports/${report.id}/edit`}>
                Edit Report
              </Link>
            </Button>
          )}
          <Badge className={
            report.status === 'approved' ? 'bg-green-100 text-green-800' :
            report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
            report.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }>
            {report.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Report Details */}
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="font-medium">{report.region}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Meetings</p>
              <p className="font-medium">{report.meetings_count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours Invested</p>
              <p className="font-medium">{report.hours_invested}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Universities Reached</p>
              <p className="font-medium">{report.universities_reached}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tracts Given</p>
              <p className="font-medium">{report.tracts_given}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Souls Saved</p>
              <p className="font-medium">{report.souls_saved}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Integrations</p>
              <p className="font-medium">{report.integrations_count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Literature Count</p>
              <p className="font-medium">{report.literature_count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Literature Money</p>
              <p className="font-medium">{formatDualCurrency(report.literature_money || 0)}</p>
            </div>
          </div>

          {/* Prayer Hours Breakdown */}
          {(report.prayer_hours_friday || report.prayer_hours_literature || report.prayer_hours_media || 
            report.prayer_hours_intercession || report.prayer_hours_worship || report.prayer_hours_evangelism) && (
            <div>
              <h3 className="font-semibold mb-2">Prayer Hours by Group</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.prayer_hours_friday > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Friday Prayer</p>
                    <p className="font-medium">{report.prayer_hours_friday} hrs</p>
                  </div>
                )}
                {report.prayer_hours_literature > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Literature Group Prayer</p>
                    <p className="font-medium">{report.prayer_hours_literature} hrs</p>
                  </div>
                )}
                {report.prayer_hours_media > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Media Team Prayer</p>
                    <p className="font-medium">{report.prayer_hours_media} hrs</p>
                  </div>
                )}
                {report.prayer_hours_intercession > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Intercession Prayer</p>
                    <p className="font-medium">{report.prayer_hours_intercession} hrs</p>
                  </div>
                )}
                {report.prayer_hours_worship > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Worship Prayer</p>
                    <p className="font-medium">{report.prayer_hours_worship} hrs</p>
                  </div>
                )}
                {report.prayer_hours_evangelism > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Evangelism Prayer</p>
                    <p className="font-medium">{report.prayer_hours_evangelism} hrs</p>
                  </div>
                )}
                <div className="md:col-span-3 pt-2 border-t">
                  <p className="text-sm text-gray-500">Total Prayer Hours</p>
                  <p className="font-bold text-lg">
                    {(report.prayer_hours_friday || 0) + 
                     (report.prayer_hours_literature || 0) + 
                     (report.prayer_hours_media || 0) + 
                     (report.prayer_hours_intercession || 0) + 
                     (report.prayer_hours_worship || 0) + 
                     (report.prayer_hours_evangelism || 0)} hrs
                  </p>
                </div>
              </div>
            </div>
          )}

          {Object.keys(uploads).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Social Media Uploads</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(uploads).map(([platform, count]) => (
                  <div key={platform}>
                    <p className="text-sm text-gray-500 capitalize">{platform}</p>
                    <p className="font-medium">{count as number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.remarks && (
            <div>
              <h3 className="font-semibold mb-2">Remarks</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{report.remarks}</p>
            </div>
          )}

          {report.reviewer_comment && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Reviewer Comment</h3>
              <p className="text-gray-700">{report.reviewer_comment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Section */}
      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Review Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comment (Optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Add a comment..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleApprove}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={submitting}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

