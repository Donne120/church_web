'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dayjs from 'dayjs';

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
  monthsBack?: number;
}

export default function MonthPicker({ value, onChange, monthsBack = 12 }: MonthPickerProps) {
  // Generate last N months
  const months = Array.from({ length: monthsBack }, (_, i) => {
    const date = dayjs().subtract(i, 'month');
    return {
      value: date.format('YYYY-MM'),
      label: date.format('MMMM YYYY'),
    };
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}








