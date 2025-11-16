'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import ReportForm from '@/components/ReportForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditReportPage() {
  const [report, setReport] = useState<any>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const reportId = params?.id as string;

  useEffect(() => {
    if (reportId) {
      loadData();
    }
  }, [reportId]);

  async function loadData() {
    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Fetch the report
      const { data: reportData, error: reportError } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (reportError) {
        console.error('Error fetching report:', reportError);
        router.push('/portal/reports');
        return;
      }

      // Check if user owns this report
      if (reportData.reporter_id !== user.id) {
        console.error('Unauthorized: You can only edit your own reports');
        router.push('/portal/reports');
        return;
      }

      setReport(reportData);

      // Fetch universities
      const { data: universitiesData, error: universitiesError } = await supabase
        .from('universities')
        .select('*')
        .order('name');

      if (universitiesError) {
        console.error('Error fetching universities:', universitiesError);
      } else {
        setUniversities(universitiesData || []);
      }

      // Get unique regions from universities
      const uniqueRegions = Array.from(
        new Set((universitiesData || []).map(u => u.region).filter(Boolean))
      ).sort();
      setRegions(uniqueRegions);

    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/portal/reports');
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    router.push(`/portal/reports/${reportId}`);
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!report) {
    return <div className="text-center py-12">Report not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href={`/portal/reports/${reportId}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Report
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D2B66]">Edit Report</h1>
        <p className="text-gray-600 mt-2">
          Update your monthly activity report
        </p>
      </div>

      <ReportForm
        report={report}
        universities={universities}
        regions={regions}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

