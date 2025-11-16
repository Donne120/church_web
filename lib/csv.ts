/**
 * CSV Export Utilities
 * Converts arrays of objects to CSV format
 */

export function toCSV<T extends Record<string, any>>(rows: T[]): string {
  if (!rows.length) return '';
  
  const headers = Object.keys(rows[0]);
  const escape = (value: any): string => {
    const str = String(value ?? '');
    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(header => escape(row[header])).join(','))
  ];

  return lines.join('\n');
}

export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}




