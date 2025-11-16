'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartBarProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

export default function ChartBar({ data, xKey, yKey, title, color = '#FFB703' }: ChartBarProps) {
  return (
    <div className="w-full h-[300px]">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#ccc' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar 
            dataKey={yKey} 
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




