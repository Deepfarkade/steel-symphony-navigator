// AI Service for handling all AI-related functionality across steel industry modules
import { generateModuleInsights } from './aiService';

// Mock API for AI agents
export const getAiAgents = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      name: "Supply Chain Assistant",
      description: "Monitors global supply chain data and predicts potential disruptions for steel manufacturing inputs.",
      status: "active",
      confidence: 94,
      icon: "truck"
    },
    {
      id: 2,
      name: "Data Analyzer Agent",
      description: "Analyzes production data to identify optimization opportunities and quality control improvements.",
      status: "active",
      confidence: 91,
      icon: "bar-chart"
    },
    {
      id: 3,
      name: "PlanXpert",
      description: "Advanced planning and scheduling agent for steel operations and workflow optimization.",
      status: "active",
      confidence: 89,
      icon: "check-circle"
    },
    {
      id: 4,
      name: "Agentic RCA",
      description: "Root Cause Analysis agent that identifies the source of production issues automatically.",
      status: "learning",
      confidence: 78,
      icon: "zap"
    },
    {
      id: 5,
      name: "Smart RCA Generator",
      description: "Generates comprehensive RCA reports based on real-time production data analysis.",
      status: "learning", 
      confidence: 82,
      icon: "shield"
    },
    {
      id: 6,
      name: "Market Trend Analyzer",
      description: "Analyzes global steel market trends and provides pricing strategy recommendations.",
      status: "inactive",
      confidence: 67,
      icon: "brain-circuit"
    }
  ];
};

// Mock API for getting AI insights
export const getAiInsights = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 1,
      type: 'alert' as 'alert',
      message: 'Potential supply chain disruption detected in source material from Australia. Recommend increasing safety stock by 15%.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: 2,
      type: 'success' as 'success',
      message: 'Factory efficiency improved by 7.2% after implementing ML-based process optimization suggestions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
    },
    {
      id: 3,
      type: 'opportunity' as 'opportunity',
      message: 'Analysis suggests potential cost saving of $420,000 by optimizing shipping routes to East Coast distribution centers.',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString() // 4 hours ago
    },
    {
      id: 4,
      type: 'suggestion' as 'suggestion',
      message: 'Consider adjusting production schedule to optimize energy usage during off-peak hours, estimated savings of 8.3%.',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString() // 6 hours ago
    }
  ];
};

// Get insights for a specific module
export const getModuleInsights = async (moduleName: string) => {
  const insights = await generateModuleInsights(moduleName);
  return insights;
};

// Mock API for notifications
export const getNotifications = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: '1',
      title: 'Supply Chain Alert',
      message: 'Raw material shipment from Australia delayed by 3 days',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      module: 'supply-planning'
    },
    {
      id: '2',
      title: 'Quality Control',
      message: 'Latest production batch passed all quality tests',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      module: 'factory-planning'
    },
    {
      id: '3',
      title: 'Inventory Alert',
      message: 'Finished goods inventory below threshold (15.3%)',
      type: 'critical' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: false,
      module: 'inventory-optimization'
    },
    {
      id: '4',
      title: 'Demand Forecast',
      message: 'Updated demand forecast for Q3 available now',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      read: false
    },
    {
      id: '5',
      title: 'Energy Consumption',
      message: 'Energy usage 7.2% higher than previous month',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      module: 'factory-planning'
    }
  ];
};

// Mock API for KPIs
export const getKpis = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      title: 'Production Yield',
      value: '92.7%',
      change: '+1.2%',
      trend: 'up' as 'up',
      chart: [65, 60, 70, 68, 72, 74, 75, 80, 85, 90, 92, 93],
      module: 'factory-planning'
    },
    {
      id: '2',
      title: 'OEE',
      value: '78.6%',
      change: '-2.4%',
      trend: 'down' as 'down',
      chart: [80, 82, 80, 76, 78, 74, 75, 77, 73, 74, 76, 79],
      module: 'factory-planning'
    },
    {
      id: '3',
      title: 'Inventory Turnover',
      value: '12.3',
      change: '+0.8',
      trend: 'up' as 'up',
      chart: [11.2, 11.4, 11.8, 11.5, 12.0, 12.1, 11.9, 12.4, 12.5, 12.3, 12.4, 12.3],
      module: 'inventory-optimization'
    },
    {
      id: '4',
      title: 'Order Fulfillment',
      value: '94.5%',
      change: '+2.1%',
      trend: 'up' as 'up',
      chart: [89, 90, 91, 92, 90, 92, 91, 93, 94, 94.5, 94, 94.5],
      module: 'order-promising'
    },
    {
      id: '5',
      title: 'Energy Efficiency',
      value: '82.3%',
      change: '+3.2%',
      trend: 'up' as 'up',
      chart: [75, 76, 78, 77, 79, 80, 79, 81, 80, 81, 82, 82.3],
      module: 'factory-planning'
    },
    {
      id: '6',
      title: 'On-Time Delivery',
      value: '89.7%',
      change: '-1.3%',
      trend: 'down' as 'down',
      chart: [92, 91, 90, 92, 91, 90, 89, 90, 91, 90, 89, 89.7],
      module: 'logistics'
    }
  ];
};

// Mock API for chart data
export const getChartData = async (chartType: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  switch (chartType) {
    case 'production':
      return [
        { name: 'Jan', value: 5420 },
        { name: 'Feb', value: 5680 },
        { name: 'Mar', value: 6290 },
        { name: 'Apr', value: 6010 },
        { name: 'May', value: 5890 },
        { name: 'Jun', value: 6340 },
        { name: 'Jul', value: 6580 },
        { name: 'Aug', value: 6780 },
        { name: 'Sep', value: 7100 },
        { name: 'Oct', value: 7350 },
        { name: 'Nov', value: 7580 },
        { name: 'Dec', value: 7820 }
      ];
    case 'inventory':
      return [
        { name: 'Jan', value: 4200 },
        { name: 'Feb', value: 4500 },
        { name: 'Mar', value: 4100 },
        { name: 'Apr', value: 3900 },
        { name: 'May', value: 4300 },
        { name: 'Jun', value: 4700 },
        { name: 'Jul', value: 5100 },
        { name: 'Aug', value: 4800 },
        { name: 'Sep', value: 4600 },
        { name: 'Oct', value: 4400 },
        { name: 'Nov', value: 4700 },
        { name: 'Dec', value: 4900 }
      ];
    case 'energy':
      return [
        { name: 'Jan', value: 1120 },
        { name: 'Feb', value: 1240 },
        { name: 'Mar', value: 1350 },
        { name: 'Apr', value: 1290 },
        { name: 'May', value: 1410 },
        { name: 'Jun', value: 1550 },
        { name: 'Jul', value: 1620 },
        { name: 'Aug', value: 1670 },
        { name: 'Sep', value: 1590 },
        { name: 'Oct', value: 1480 },
        { name: 'Nov', value: 1390 },
        { name: 'Dec', value: 1320 }
      ];
    case 'logistics':
      return [
        { name: 'Jan', value: 780 },
        { name: 'Feb', value: 820 },
        { name: 'Mar', value: 840 },
        { name: 'Apr', value: 790 },
        { name: 'May', value: 810 },
        { name: 'Jun', value: 880 },
        { name: 'Jul', value: 910 },
        { name: 'Aug', value: 930 },
        { name: 'Sep', value: 890 },
        { name: 'Oct', value: 920 },
        { name: 'Nov', value: 950 },
        { name: 'Dec', value: 990 }
      ];
    default:
      return [];
  }
};

// Mock API for getting agent data
export const getAgentData = async (agentId: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return mock data based on agent ID
  const agents = await getAiAgents();
  const agent = agents.find(a => a.id === agentId);
  
  if (!agent) {
    throw new Error('Agent not found');
  }
  
  return {
    ...agent,
    metrics: {
      analysisCount: Math.floor(Math.random() * 100) + 50,
      suggestionsImplemented: Math.floor(Math.random() * 20) + 10,
      successRate: Math.floor(Math.random() * 10) + 85 + '%',
      timeActive: Math.floor(Math.random() * 100) + 20 + ' days'
    },
    recommendations: [
      'Optimize inventory levels for raw steel materials',
      'Implement predictive maintenance for hot rolling mill',
      'Adjust production schedule to align with energy peak hours'
    ]
  };
};

// Mock API for getting active AI agents
export const getActiveAiAgents = async () => {
  const allAgents = await getAiAgents();
  return allAgents.filter(agent => agent.status === 'active');
};

// Get co-pilot analytics data
export const getCoPilotAnalytics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    modelsAnalyzed: 12,
    dataPointsProcessed: 15000,
    predictionsGenerated: 87,
    status: "Active & Learning"
  };
};

// Mock API for production data
export const getProductionData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    daily: [
      { name: '00:00', value: 215 },
      { name: '04:00', value: 180 },
      { name: '08:00', value: 240 },
      { name: '12:00', value: 275 },
      { name: '16:00', value: 260 },
      { name: '20:00', value: 230 }
    ],
    weekly: [
      { name: 'Mon', value: 1220 },
      { name: 'Tue', value: 1340 },
      { name: 'Wed', value: 1280 },
      { name: 'Thu', value: 1390 },
      { name: 'Fri', value: 1430 },
      { name: 'Sat', value: 820 },
      { name: 'Sun', value: 790 }
    ],
    monthly: [
      { name: 'Week 1', value: 5200 },
      { name: 'Week 2', value: 5800 },
      { name: 'Week 3', value: 5600 },
      { name: 'Week 4', value: 6100 }
    ]
  };
};

// Add the missing functions for KPI detail, energy chart, and production chart data
export const getKpiDetailData = async (kpiId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return mock data based on KPI ID
  return {
    id: kpiId,
    title: kpiId === 'production-yield' 
      ? 'Production Yield' 
      : kpiId === 'energy-consumption' 
        ? 'Energy Consumption' 
        : kpiId === 'quality-rating' 
          ? 'Quality Rating' 
          : 'On-Time Delivery',
    currentValue: kpiId === 'production-yield' 
      ? '94.8%' 
      : kpiId === 'energy-consumption' 
        ? '1,235 MWh' 
        : kpiId === 'quality-rating' 
          ? 'A+' 
          : '92.3%',
    change: kpiId === 'production-yield' 
      ? 2.3 
      : kpiId === 'energy-consumption' 
        ? -5.7 
        : kpiId === 'quality-rating' 
          ? 1.2 
          : -0.8,
    trendData: Array(12).fill(0).map((_, i) => ({
      name: `Week ${i+1}`,
      value: 75 + Math.random() * 20,
    })),
    breakdownData: Array(5).fill(0).map((_, i) => ({
      name: `Category ${i+1}`,
      value: 10 + Math.random() * 30,
    })),
    forecastData: Array(6).fill(0).map((_, i) => ({
      name: `Month ${i+1}`,
      value: 80 + (Math.random() * 15),
      forecast: true,
    })),
    description: `Detailed analysis and insights for ${kpiId?.replace('-', ' ')} across all steel manufacturing operations.`
  };
};

export const getEnergyDetailData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    daily: Array(30).fill(0).map((_, i) => ({
      name: `Day ${i+1}`,
      value: 30 + Math.random() * 15,
    })),
    weekly: Array(12).fill(0).map((_, i) => ({
      name: `Week ${i+1}`,
      value: 200 + Math.random() * 50,
    })),
    monthly: Array(12).fill(0).map((_, i) => ({
      name: `Month ${i+1}`,
      value: 900 + Math.random() * 200,
    })),
    byProcess: [
      { name: 'Blast Furnace', value: 40 },
      { name: 'Rolling Mill', value: 25 },
      { name: 'Heat Treatment', value: 20 },
      { name: 'Coating Lines', value: 10 },
      { name: 'Auxiliary Processes', value: 5 },
    ]
  };
};

export const getProductionDetailData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    daily: Array(30).fill(0).map((_, i) => ({
      name: `Day ${i+1}`,
      value: 800 + Math.random() * 200,
    })),
    weekly: Array(12).fill(0).map((_, i) => ({
      name: `Week ${i+1}`,
      value: 5000 + Math.random() * 1000,
    })),
    monthly: Array(12).fill(0).map((_, i) => ({
      name: `Month ${i+1}`,
      value: 22000 + Math.random() * 5000,
    })),
    byProduct: [
      { name: 'Hot Rolled Coil', value: 35 },
      { name: 'Cold Rolled Coil', value: 25 },
      { name: 'Galvanized Steel', value: 20 },
      { name: 'Steel Plate', value: 15 },
      { name: 'Steel Pipe', value: 5 },
    ]
  };
};
