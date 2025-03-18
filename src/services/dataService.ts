// Mock data service to simulate API calls
// In a real application, this would connect to your backend API

// Simulate API delay
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Production data
export const getProductionData = async () => {
  await simulateDelay();
  return Array(12).fill(0).map((_, i) => ({
    name: `Week ${i+1}`,
    value: 75 + Math.random() * 20,
  }));
};

// Energy consumption data
export const getEnergyConsumptionData = async () => {
  await simulateDelay();
  return Array(12).fill(0).map((_, i) => ({
    name: `Week ${i+1}`,
    value: 30 + Math.random() * 15,
  }));
};

// KPI data
export const getKpiData = async () => {
  await simulateDelay();
  return {
    productionYield: {
      value: "94.8%",
      change: 2.3
    },
    energyConsumption: {
      value: "1,235 MWh",
      change: -5.7
    },
    qualityRating: {
      value: "A+",
      change: 1.2
    },
    onTimeDelivery: {
      value: "92.3%",
      change: -0.8
    }
  };
};

// AI insights
export const getAiInsights = async () => {
  await simulateDelay();
  
  return [
    {
      id: 1,
      type: 'alert' as const,
      message: "Production efficiency decreased by 3.2% in Rolling Mill B. Recommend maintenance check.",
      timestamp: new Date().toLocaleString()
    },
    {
      id: 2,
      type: 'success' as const,
      message: "Energy consumption per ton of steel reduced by 5.7%. Continue optimization strategy.",
      timestamp: new Date().toLocaleString()
    },
    {
      id: 3,
      type: 'opportunity' as const,
      message: "Predicted supply chain optimization could save $425,000 in Q3 logistics costs.",
      timestamp: new Date().toLocaleString()
    },
    {
      id: 4,
      type: 'suggestion' as const,
      message: "Adjust blast furnace operations based on current raw material quality for 3.1% yield improvement.",
      timestamp: new Date().toLocaleString()
    },
    {
      id: 5,
      type: 'alert' as const,
      message: "Quality deviations detected in latest steel batch. Review process parameters.",
      timestamp: new Date().toLocaleString()
    }
  ];
};

// Get detailed KPI data by ID
export const getKpiDetailData = async (kpiId: string) => {
  await simulateDelay();
  
  // Different data based on the KPI requested
  switch (kpiId) {
    case 'production-yield':
      return {
        id: kpiId,
        title: 'Production Yield',
        currentValue: '94.8%',
        change: 2.3,
        trendData: Array(12).fill(0).map((_, i) => ({
          name: `Week ${i+1}`,
          value: 85 + Math.random() * 15,
        })),
        breakdownData: [
          { name: 'Hot Rolled', value: 96.2 },
          { name: 'Cold Rolled', value: 94.5 },
          { name: 'Galvanized', value: 93.7 },
          { name: 'Plate', value: 95.1 },
          { name: 'Pipe', value: 92.8 },
        ],
        forecastData: Array(6).fill(0).map((_, i) => ({
          name: `Month ${i+1}`,
          value: 90 + (Math.random() * 10),
          forecast: true,
        })),
        description: 'Production yield measures the percentage of steel products that meet quality standards relative to total production volume.'
      };
    
    case 'energy-consumption':
      return {
        id: kpiId,
        title: 'Energy Consumption',
        currentValue: '1,235 MWh',
        change: -5.7,
        trendData: Array(12).fill(0).map((_, i) => ({
          name: `Week ${i+1}`,
          value: 1000 + Math.random() * 500,
        })),
        breakdownData: [
          { name: 'Blast Furnace', value: 45 },
          { name: 'Rolling', value: 25 },
          { name: 'Heat Treatment', value: 15 },
          { name: 'Coating', value: 10 },
          { name: 'Auxiliary', value: 5 },
        ],
        forecastData: Array(6).fill(0).map((_, i) => ({
          name: `Month ${i+1}`,
          value: 1200 - (i * 20) + (Math.random() * 100),
          forecast: true,
        })),
        description: 'Energy consumption tracks total electricity usage across all steel production facilities and processes.'
      };
      
    case 'quality-rating':
      return {
        id: kpiId,
        title: 'Quality Rating',
        currentValue: 'A+',
        change: 1.2,
        trendData: Array(12).fill(0).map((_, i) => ({
          name: `Week ${i+1}`,
          value: 90 + Math.random() * 10,
        })),
        breakdownData: [
          { name: 'Surface Quality', value: 98 },
          { name: 'Dimensional Accuracy', value: 97 },
          { name: 'Mechanical Properties', value: 96 },
          { name: 'Chemical Composition', value: 99 },
          { name: 'Coating Quality', value: 95 },
        ],
        forecastData: Array(6).fill(0).map((_, i) => ({
          name: `Month ${i+1}`,
          value: 95 + (Math.random() * 5),
          forecast: true,
        })),
        description: 'Quality rating represents the overall grade assigned to steel products based on multiple quality factors and tests.'
      };
      
    case 'on-time-delivery':
      return {
        id: kpiId,
        title: 'On-Time Delivery',
        currentValue: '92.3%',
        change: -0.8,
        trendData: Array(12).fill(0).map((_, i) => ({
          name: `Week ${i+1}`,
          value: 85 + Math.random() * 15,
        })),
        breakdownData: [
          { name: 'Domestic', value: 94 },
          { name: 'International', value: 89 },
          { name: 'Automotive', value: 96 },
          { name: 'Construction', value: 91 },
          { name: 'Industrial', value: 93 },
        ],
        forecastData: Array(6).fill(0).map((_, i) => ({
          name: `Month ${i+1}`,
          value: 92 + (Math.random() * 8 - 4),
          forecast: true,
        })),
        description: 'On-time delivery measures the percentage of customer orders delivered within promised timeframes.'
      };
      
    default:
      return {
        id: kpiId,
        title: 'KPI Details',
        currentValue: '95%',
        change: 2,
        trendData: Array(12).fill(0).map((_, i) => ({
          name: `Week ${i+1}`,
          value: 85 + Math.random() * 15,
        })),
        breakdownData: Array(5).fill(0).map((_, i) => ({
          name: `Category ${i+1}`,
          value: 10 + Math.random() * 30,
        })),
        forecastData: Array(6).fill(0).map((_, i) => ({
          name: `Month ${i+1}`,
          value: 90 + (Math.random() * 10),
          forecast: true,
        })),
        description: 'Detailed KPI analysis and metrics for your steel manufacturing operations.'
      };
  }
};

// Get module insights
export const getModuleInsights = async (moduleName: string) => {
  await simulateDelay();
  
  // Default insights for any module
  const defaultInsights = [
    { id: 1, text: 'AI analysis complete. Optimization opportunities identified.' },
    { id: 2, text: 'Machine learning prediction suggests potential improvements.' },
    { id: 3, text: 'Trend analysis shows positive direction over the last quarter.' }
  ];
  
  // Return module-specific insights from the API
  // In a real app, this would fetch from your backend API
  return defaultInsights;
};

// Get detailed production chart data
export const getProductionDetailData = async () => {
  await simulateDelay();
  
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

// Get detailed energy consumption data
export const getEnergyDetailData = async () => {
  await simulateDelay();
  
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

// Get notifications for the notification center
export const getNotifications = async () => {
  await simulateDelay();
  
  return [
    {
      id: '1',
      title: 'Production Yield Increased',
      message: 'The production yield has increased by 2.3% in the last week.',
      type: 'success' as const,
      timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
      read: false,
      module: 'factory-planning'
    },
    {
      id: '2',
      title: 'Energy Consumption Alert',
      message: 'Energy consumption has exceeded the weekly threshold by 5%.',
      type: 'warning' as const,
      timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000),
      read: true,
      module: 'factory-planning'
    },
    {
      id: '3',
      title: 'New AI Model Deployed',
      message: 'The steel prediction model has been updated with new algorithm.',
      type: 'info' as const,
      timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '4',
      title: 'Supply Chain Disruption',
      message: 'Potential supply chain disruption detected in raw materials delivery.',
      type: 'critical' as const,
      timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      module: 'supply-planning'
    },
    {
      id: '5',
      title: 'Quality Inspection Completed',
      message: 'Monthly quality inspection has been completed with A+ rating.',
      type: 'success' as const,
      timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      module: 'quality-control'
    },
  ];
};

// Create a new function to get AI Agents data
export const getAiAgents = async () => {
  await simulateDelay();
  
  return [
    {
      id: 1,
      name: "Supply Chain Assistant",
      description: "Optimizes supply chain operations, predicts disruptions, and recommends mitigation strategies",
      status: "active",
      confidence: 94.2,
      icon: "truck"
    },
    {
      id: 2,
      name: "Data Analyzer",
      description: "Processes production data to identify patterns, anomalies, and optimization opportunities",
      status: "active",
      confidence: 97.5,
      icon: "bar-chart"
    },
    {
      id: 3,
      name: "Energy Efficiency Agent",
      description: "Monitors and recommends energy usage optimizations across steel manufacturing processes",
      status: "active",
      confidence: 92.8,
      icon: "zap"
    },
    {
      id: 4,
      name: "Quality Control Agent",
      description: "Predicts quality issues before they occur and recommends preventive actions",
      status: "active",
      confidence: 96.1,
      icon: "check-circle"
    },
    {
      id: 5,
      name: "Risk Management Assistant",
      description: "Identifies potential business and operational risks and suggests mitigation plans",
      status: "active",
      confidence: 93.7,
      icon: "shield"
    }
  ];
};
