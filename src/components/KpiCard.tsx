
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'flat';
  sparklineData: number[];
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  id,
  title, 
  value, 
  change, 
  trend,
  sparklineData
}) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  
  return (
    <div className="ey-card p-6 animate-slide-up transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-ey-lightGray font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-ey-darkGray">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : isNegative ? (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'}`}>
                {change ? Math.abs(change) : 0}%
              </span>
              <span className="text-ey-lightGray text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        {/* Sparkline chart visualization would go here */}
        <div className="w-24 h-12 flex items-end">
          {sparklineData && sparklineData.length > 0 && (
            <div className="flex items-end w-full h-full space-x-1">
              {sparklineData.map((value, index) => (
                <div 
                  key={`${id}-sparkline-${index}`}
                  className={`w-1 rounded-t ${isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-gray-400'}`}
                  style={{ 
                    height: `${Math.max(10, (value / Math.max(...sparklineData)) * 100)}%` 
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
