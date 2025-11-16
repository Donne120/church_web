'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MonthPicker from '@/components/MonthPicker';
import { toCSV, downloadCSV } from '@/lib/csv';
import { buildNationalPDF, downloadPDF } from '@/lib/pdf';
import { toast } from 'sonner';
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import dayjs from 'dayjs';

export default function ExportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [exporting, setExporting] = useState(false);

  async function exportCSV() {
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('month', selectedMonth)
        .eq('status', 'approved');

      if (error) throw error;

      const csv = toCSV(data || []);
      downloadCSV(csv, `cysmf-reports-${selectedMonth}.csv`);
      toast.success('CSV exported successfully');
    } catch (error: any) {
      console.error('Error exporting CSV:', error);
      toast.error(error.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  }

  async function exportPDF() {
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('month', selectedMonth)
        .eq('status', 'approved');

      if (error) throw error;

      const reports = data || [];

      // Calculate totals
      const totals = reports.reduce((acc, r) => ({
        universities_reached: acc.universities_reached + (r.universities_reached || 0),
        tracts_given: acc.tracts_given + (r.tracts_given || 0),
        souls_saved: acc.souls_saved + (r.souls_saved || 0),
        integrations: acc.integrations + (r.integrations_count || 0),
        meetings: acc.meetings + (r.meetings_count || 0),
        hours: acc.hours + (r.hours_invested || 0),
        literature_count: acc.literature_count + (r.literature_count || 0),
        literature_money: acc.literature_money + (r.literature_money || 0),
      }), {
        universities_reached: 0,
        tracts_given: 0,
        souls_saved: 0,
        integrations: 0,
        meetings: 0,
        hours: 0,
        literature_count: 0,
        literature_money: 0,
      });

      // Group by region
      const byRegion = reports.reduce((acc: any, r) => {
        if (!acc[r.region]) {
          acc[r.region] = {
            region: r.region,
            universities: 0,
            souls: 0,
            tracts: 0,
          };
        }
        acc[r.region].universities += r.universities_reached || 0;
        acc[r.region].souls += r.souls_saved || 0;
        acc[r.region].tracts += r.tracts_given || 0;
        return acc;
      }, {});

      const pdfBlob = buildNationalPDF({
        month: dayjs(selectedMonth).format('MMMM YYYY'),
        totals,
        byRegion: Object.values(byRegion),
        rows: reports.map(r => ({
          region: r.region,
          universities: r.universities_reached,
          souls: r.souls_saved,
          tracts: r.tracts_given,
        })),
      });

      downloadPDF(pdfBlob, `cysmf-national-report-${selectedMonth}.pdf`);
      toast.success('PDF exported successfully');
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      toast.error(error.message || 'Failed to export PDF');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D2B66]">Exports</h1>
        <p className="text-gray-600 mt-1">Export reports and data</p>
      </div>

      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Month</CardTitle>
          <CardDescription>Choose the month to export data for</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>CSV Export</CardTitle>
                <CardDescription>Raw data export</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Export all approved reports for the selected month in CSV format.
              Suitable for Excel and data analysis tools.
            </p>
            <Button
              onClick={exportCSV}
              disabled={exporting}
              className="w-full"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>PDF Report</CardTitle>
                <CardDescription>Formatted national report</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Generate a formatted PDF report with totals, regional breakdown,
              and detailed tables.
            </p>
            <Button
              onClick={exportPDF}
              disabled={exporting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




