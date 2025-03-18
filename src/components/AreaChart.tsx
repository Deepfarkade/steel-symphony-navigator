
import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface AreaChartProps {
  data: any[];
  color: string;
  title?: string; // Make title optional
}

const AreaChart: React.FC<AreaChartProps> = ({ data, color, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#7D7D81' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#7D7D81' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E5E7EB',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#2E2E38' }}
            itemStyle={{ color: '#7D7D81' }}
            formatter={(value) => [`${value}`, title || 'Value']}
            labelFormatter={(name) => `${name}`}
          />
          <defs>
            <linearGradient id={`color${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${color.replace('#', '')})`} 
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AreaChart;
