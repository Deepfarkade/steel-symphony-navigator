
import React from 'react';
import { 
  Truck, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  Shield, 
  BrainCircuit, 
  AlertTriangle, 
  Globe, 
  Lightbulb,
  Shapes,
  BarChartHorizontal,
  AirVent,
  CircleDollarSign,
  Activity,
  PieChart,
  LayoutDashboard,
  ChartBar,
  GanttChartSquare,
  PackageCheck,
  Factory,
  Microscope,
  Gauge,
  LineChart,
  FileWarning,
  Network
} from 'lucide-react';

export const getIconComponent = (iconName: string, className = "h-5 w-5"): React.ReactNode => {
  switch (iconName) {
    case 'truck':
      return <Truck className={className} />;
    case 'bar-chart':
      return <BarChart3 className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'check-circle':
      return <CheckCircle className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'alert-triangle':
      return <AlertTriangle className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'lightbulb':
      return <Lightbulb className={className} />;
    case 'shapes':
      return <Shapes className={className} />;
    case 'bar-chart-horizontal':
      return <BarChartHorizontal className={className} />;
    case 'air-vent':
      return <AirVent className={className} />;
    case 'dollar':
      return <CircleDollarSign className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'pie-chart':
      return <PieChart className={className} />;
    case 'dashboard':
      return <LayoutDashboard className={className} />;
    case 'chart-bar':
      return <ChartBar className={className} />;
    case 'gantt-chart':
      return <GanttChartSquare className={className} />;
    case 'package-check':
      return <PackageCheck className={className} />;
    case 'factory':
      return <Factory className={className} />;
    case 'microscope':
      return <Microscope className={className} />;
    case 'gauge':
      return <Gauge className={className} />;
    case 'line-chart':
      return <LineChart className={className} />;
    case 'file-warning':
      return <FileWarning className={className} />;
    case 'network':
      return <Network className={className} />;
    default:
      return <BrainCircuit className={className} />;
  }
};
