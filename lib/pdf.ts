/**
 * PDF Export Utilities
 * Uses jsPDF and autoTable for generating PDF reports
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface NationalReportData {
  month: string;
  totals: Record<string, any>;
  byRegion: Array<Record<string, any>>;
  rows: Array<Record<string, any>>;
}

export function buildNationalPDF(data: NationalReportData): Blob {
  const { month, totals, byRegion, rows } = data;
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CYSMF National Report', 14, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Month: ${month}`, 14, 28);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
  doc.setTextColor(0);

  let currentY = 42;

  // Totals Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('National Totals', 14, currentY);
  currentY += 8;

  const totalsData = Object.entries(totals).map(([key, value]) => [
    formatLabel(key),
    formatValue(value)
  ]);

  autoTable(doc, {
    head: [['Metric', 'Value']],
    body: totalsData,
    startY: currentY,
    theme: 'striped',
    headStyles: { fillColor: [13, 43, 102], textColor: 255 },
    styles: { fontSize: 10 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Regional Breakdown
  if (byRegion && byRegion.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Regional Summary', 14, currentY);
    currentY += 8;

    const regionHeaders = Object.keys(byRegion[0] || {});
    const regionBody = byRegion.map(r => 
      regionHeaders.map(h => formatValue(r[h]))
    );

    autoTable(doc, {
      head: [regionHeaders.map(formatLabel)],
      body: regionBody,
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [255, 183, 3], textColor: 0 },
      styles: { fontSize: 9 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Detailed Campus Reports
  if (rows && rows.length > 0) {
    // Add new page if needed
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Campus Reports', 14, currentY);
    currentY += 8;

    const rowHeaders = Object.keys(rows[0] || {});
    const rowBody = rows.map(r => 
      rowHeaders.map(h => formatValue(r[h]))
    );

    autoTable(doc, {
      head: [rowHeaders.map(formatLabel)],
      body: rowBody,
      startY: currentY,
      theme: 'striped',
      headStyles: { fillColor: [13, 43, 102], textColor: 255 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 30 },
      },
    });
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Christian Youth and Students Missionary Fellowship (CYSMF)',
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc.output('blob');
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}




