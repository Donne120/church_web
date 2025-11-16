'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import { getCurrentProfile } from '@/lib/auth';
import ReportForm from '@/components/ReportForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewReportPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

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
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    router.push('/portal/reports');
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/portal/reports"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Reports
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0D2B66]">New Monthly Report</h1>
        <p className="text-gray-600 mt-2">
          Submit your monthly activity report
        </p>
      </div>

      <ReportForm
        universities={universities}
        regions={regions}
        onSuccess={handleSuccess}
      />
    </div>
  );
}



