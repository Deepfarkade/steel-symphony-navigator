
import React from 'react';
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface AreaChartProps {
  data: DataPoint[];
  title?: string; // Make title optional
  color?: string;
  dataKey?: string;
  height?: number;
}

const AreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  title, 
  color = "#FFE600", 
  dataKey = "value",
  height = 300
}) => {
  return (
    <div className="ey-card p-6 animate-slide-up">
      {title && <h3 className="text-ey-darkGray font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fill: '#808080' }} />
          <YAxis tick={{ fill: '#808080' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.5rem'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={color}
            fillOpacity={0.2} 
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;
