import React from 'react';
import { Sector } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SectorChartProps {
  sectors: Sector[];
}

export const SectorChart: React.FC<SectorChartProps> = ({ sectors }) => {
  // China market colors: Red (>50) is up/good, Green (<50) is down/bad
  const getColor = (sentiment: number) => sentiment >= 50 ? '#ef4444' : '#22c55e';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sectors}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100} 
            tick={{fontSize: 12, fill: '#64748b'}} 
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="sentiment" radius={[0, 4, 4, 0]} barSize={20}>
            {sectors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.sentiment)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};