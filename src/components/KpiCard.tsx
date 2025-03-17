
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  color = 'bg-ey-yellow/10'
}) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <div className="ey-card p-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-ey-lightGray font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-ey-darkGray">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-ey-lightGray text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
