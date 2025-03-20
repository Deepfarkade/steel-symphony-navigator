
import { faker } from '@faker-js/faker';

// Helper function for simulating API delay
const apiDelay = () => new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));

// Mock user agents
let userAgents = [
  {
    id: 1,
    name: "Supply Chain Optimizer",
    description: "Analyzes your steel supply chain to identify bottlenecks and optimization opportunities.",
    status: "active",
    confidence: 87,
    icon: "truck"
  },
  {
    id: 2,
    name: "Production Intelligence",
    description: "Monitors steel production metrics and suggests ways to improve efficiency and quality.",
    status: "learning",
    confidence: 92,
    icon: "bar-chart"
  },
  {
    id: 3,
    name: "Energy Consumption Analyzer",
    description: "Tracks energy usage across steel operations and recommends sustainability improvements.",
    status: "active",
    confidence: 84,
    icon: "zap"
  }
];

// Mock available agents from marketplace
const availableAgents = [
  {
    id: 4,
    name: "Inventory Forecaster",
    description: "Predicts optimal inventory levels for raw materials and finished steel products.",
    status: "active",
    confidence: 89,
    icon: "package"
  },
  {
    id: 5,
    name: "Logistics Optimizer",
    description: "Routes and schedules transportation for steel products with maximum efficiency.",
    status: "active",
    confidence: 91,
    icon: "truck"
  },
  {
    id: 6,
    name: "Quality Assurance AI",
    description: "Analyzes quality control data to predict and prevent defects in steel production.",
    status: "active",
    confidence: 88,
    icon: "check-circle"
  },
  {
    id: 7,
    name: "Market Trend Analyzer",
    description: "Identifies emerging trends in the steel market to inform strategic decisions.",
    status: "active",
    confidence: 85,
    icon: "trending-up"
  },
  {
    id: 8,
    name: "Maintenance Predictor",
    description: "Forecasts equipment maintenance needs to prevent costly downtime.",
    status: "active",
    confidence: 86,
    icon: "tool"
  },
  {
    id: 9,
    name: "Pricing Strategist",
    description: "Recommends optimal pricing strategies based on market conditions and costs.",
    status: "active",
    confidence: 83,
    icon: "bar-chart-2"
  },
  {
    id: 10,
    name: "Sustainability Monitor",
    description: "Tracks carbon footprint and suggests ways to reduce environmental impact.",
    status: "active",
    confidence: 87,
    icon: "shield"
  },
  {
    id: 11,
    name: "Safety Compliance AI",
    description: "Ensures operations meet safety regulations and identifies potential hazards.",
    status: "active",
    confidence: 94,
    icon: "shield"
  },
  {
    id: 12,
    name: "Customer Insights Agent",
    description: "Analyzes customer feedback and behavior to improve steel product offerings.",
    status: "active",
    confidence: 88,
    icon: "users"
  },
  {
    id: 13,
    name: "Global Trade Navigator",
    description: "Monitors international trade policies and tariffs affecting steel imports/exports.",
    status: "active",
    confidence: 82,
    icon: "globe"
  },
  {
    id: 14,
    name: "Raw Material Sourcing AI",
    description: "Identifies optimal sources for raw materials based on quality and cost.",
    status: "active",
    confidence: 89,
    icon: "package"
  },
  {
    id: 15,
    name: "Workforce Optimizer",
    description: "Analyzes labor allocation and shift scheduling for maximum productivity.",
    status: "active",
    confidence: 85,
    icon: "users"
  },
  {
    id: 16,
    name: "R&D Innovation Assistant",
    description: "Identifies promising areas for steel product innovation and development.",
    status: "active",
    confidence: 87,
    icon: "lightbulb"
  },
  {
    id: 17,
    name: "Regulatory Compliance Monitor",
    description: "Tracks industry regulations to ensure full compliance of steel operations.",
    status: "active",
    confidence: 91,
    icon: "check-square"
  },
  {
    id: 18,
    name: "Competitor Analysis Agent",
    description: "Monitors competitors' activities and market positions in the steel industry.",
    status: "active",
    confidence: 86,
    icon: "eye"
  },
  {
    id: 19,
    name: "Customer Demand Forecaster",
    description: "Predicts future customer demand for various steel products and grades.",
    status: "active",
    confidence: 88,
    icon: "bar-chart"
  },
  {
    id: 20,
    name: "Crisis Management AI",
    description: "Helps navigate supply chain disruptions, market crashes, and other crises.",
    status: "active",
    confidence: 84,
    icon: "alert-triangle"
  }
];

// Store for custom agents
let customAgents = [];

// Function to get agents the user has added
export const getAiAgents = async () => {
  await apiDelay();
  return [...userAgents];
};

// Function to get available agents from the marketplace
export const getAvailableAgents = async () => {
  await apiDelay();
  // Return all agents that aren't already in userAgents
  const userAgentIds = userAgents.map(agent => agent.id);
  return availableAgents.filter(agent => !userAgentIds.includes(agent.id));
};

// Function to add an agent to the user's agents
export const addAgentToUser = async (agentId: number) => {
  await apiDelay();
  // Find the agent in the available agents
  const agent = availableAgents.find(a => a.id === agentId);
  
  if (!agent) {
    throw new Error('Agent not found');
  }
  
  // Check if agent is already added
  const isAlreadyAdded = userAgents.some(a => a.id === agentId);
  if (isAlreadyAdded) {
    return { success: true, message: 'Agent already added' };
  }
  
  // Add the agent to the user's agents
  userAgents.push(agent);
  return { success: true, message: 'Agent added successfully' };
};

// Function to remove an agent from the user's agents
export const removeAgentFromUser = async (agentId: number) => {
  await apiDelay();
  const initialLength = userAgents.length;
  userAgents = userAgents.filter(agent => agent.id !== agentId);
  
  if (userAgents.length === initialLength) {
    throw new Error('Agent not found');
  }
  
  return { success: true, message: 'Agent removed successfully' };
};

// Function to get a specific agent by ID
export const getAgentById = async (agentId: number) => {
  await apiDelay();
  const agent = userAgents.find(a => a.id === agentId);
  
  if (!agent) {
    const availableAgent = availableAgents.find(a => a.id === agentId);
    if (availableAgent) {
      return availableAgent;
    } else {
      throw new Error('Agent not found');
    }
  }
  
  return agent;
};

// Function to get analytics for an agent
export const getAgentAnalytics = async (agentId: number) => {
  await apiDelay();
  return {
    issuesResolved: faker.number.int({ min: 32, max: 124 }),
    avgResponseTime: faker.number.float({ min: 1.2, max: 4.8, fractionDigits: 1 }),
    userSatisfaction: faker.number.int({ min: 78, max: 97 }),
    conversationsCompleted: faker.number.int({ min: 45, max: 210 }),
    trendsIdentified: faker.number.int({ min: 8, max: 35 }),
    optimizationSuggestions: faker.number.int({ min: 12, max: 48 }),
    insightsGenerated: 127 + agentId * 10,
    accuracyRate: 92.5 + (agentId % 5),
    tasksCompleted: 348 + agentId * 20,
    activeHours: 720 + agentId * 5
  };
};

// Function to get recommendations from an agent
export const getAgentRecommendations = async (agentId: number) => {
  await apiDelay();
  return [
    {
      id: 1,
      title: "Optimize Inventory Levels",
      description: "Reduce warehouse costs by optimizing inventory levels based on demand forecasts.",
      impact: "High",
      category: "Supply Chain"
    },
    {
      id: 2,
      title: "Energy Consumption Reduction",
      description: "Implement scheduled equipment shutdowns during peak energy cost hours.",
      impact: "Medium",
      category: "Operations"
    },
    {
      id: 3,
      title: "Quality Control Improvement",
      description: "Increase testing frequency for high-variance steel grades to reduce defect rates.",
      impact: "High",
      category: "Quality"
    },
    {
      id: 4,
      title: "Production Optimization",
      description: "Adjust furnace temperature by 3.5% to improve yield and reduce energy consumption",
      impact: "High",
      category: "Efficiency"
    },
    {
      id: 5,
      title: "Inventory Reduction",
      description: "Reduce safety stock levels for Grade 304 steel by 15% based on improved demand forecasting",
      impact: "Medium",
      category: "Cost Saving"
    }
  ];
};

// Function to create a custom agent
export const createCustomAgent = async (agentData: any) => {
  await apiDelay();
  const newAgent = {
    id: 100 + userAgents.length,
    name: agentData.name,
    description: agentData.description,
    status: "learning",
    confidence: agentData.confidence || 80,
    icon: agentData.icon || "brain-circuit"
  };
  
  userAgents.push(newAgent);
  return { 
    success: true, 
    message: 'Custom agent created successfully',
    agent: newAgent,
    agentId: newAgent.id
  };
};

// Function to get Co-Pilot analytics data
export const getCoPilotAnalytics = async () => {
  await apiDelay();
  return {
    modelsAnalyzed: faker.number.int({ min: 12, max: 48 }),
    dataPointsProcessed: faker.number.int({ min: 150000, max: 500000 }),
    predictionsGenerated: faker.number.int({ min: 230, max: 890 })
  };
};

// Mock AI Insights data
export const getAiInsights = async () => {
  await apiDelay();
  return [
    {
      id: 1,
      type: 'alert',
      message: 'Steel mill #3 showing 23% increased energy consumption - maintenance check recommended.',
      timestamp: new Date().toLocaleString()
    },
    {
      id: 2,
      type: 'success',
      message: 'Production yield increased by 3.5% after implementing AI-suggested process changes.',
      timestamp: new Date().toLocaleString()
    },
    {
      id: 3,
      type: 'opportunity',
      message: 'Market analysis suggests potential 8% growth in automotive-grade steel demand next quarter.',
      timestamp: new Date().toLocaleString()
    },
    {
      id: 4,
      type: 'suggestion',
      message: 'Optimizing furnace cool-down cycles could reduce energy costs by approximately 12%.',
      timestamp: new Date().toLocaleString()
    }
  ];
};

// Mock Production Data
export const getProductionData = async (days = 30) => {
  await apiDelay();
  return [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
    { name: 'Aug', value: 6500 },
    { name: 'Sep', value: 8000 },
    { name: 'Oct', value: 7500 },
    { name: 'Nov', value: 9000 },
    { name: 'Dec', value: 8500 }
  ];
};

// Mock Energy Consumption Data
export const getEnergyConsumptionData = async (days = 30) => {
  await apiDelay();
  return [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1800 },
    { name: 'Mar', value: 3000 },
    { name: 'Apr', value: 2700 },
    { name: 'May', value: 3600 },
    { name: 'Jun', value: 3300 },
    { name: 'Jul', value: 4200 },
    { name: 'Aug', value: 3900 },
    { name: 'Sep', value: 4800 },
    { name: 'Oct', value: 4500 },
    { name: 'Nov', value: 5400 },
    { name: 'Dec', value: 5100 }
  ];
};

// Mock KPI Data
export const getKpiData = async () => {
  await apiDelay();
  return {
    productionYield: { value: '94.8%', change: 2.3 },
    energyConsumption: { value: '1,235 MWh', change: -5.7 },
    qualityRating: { value: 'A+', change: 1.2 },
    onTimeDelivery: { value: '92.3%', change: -0.8 }
  };
};

// Module insights
export const getModuleInsights = async (module: string) => {
  await apiDelay();
  return [
    `AI-powered analysis of ${module} shows opportunity for 12% efficiency improvement`,
    `Recent market trends suggest adjusting your ${module} strategy for Q3`,
    `Predictive model indicates potential supply chain disruption affecting ${module} in 2 weeks`,
    `Competitive analysis shows your ${module} performance is 8% above industry average`
  ];
};

// Latest news
export const getLatestNews = async () => {
  await apiDelay();
  return [
    {
      id: 1,
      title: 'Steel Production Reaches 5-Year High',
      summary: 'Global steel production has reached its highest level in five years, with particularly strong growth in emerging markets.',
      source: 'Steel Industry Report',
      date: '2023-05-15',
      category: 'Market Trends',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'New Green Steel Production Methods Show Promise',
      summary: 'Innovative hydrogen-based reduction methods are showing considerable promise in reducing carbon emissions in steel production.',
      source: 'Green Manufacturing Today',
      date: '2023-05-12',
      category: 'Innovation',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Supply Chain Disruptions Affect Steel Delivery Times',
      summary: 'Recent global events have led to significant disruptions in steel supply chains, affecting delivery times across multiple markets.',
      source: 'Supply Chain Digest',
      date: '2023-05-10',
      category: 'Supply Chain',
      imageUrl: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Steel Prices Expected to Stabilize in Q3',
      summary: 'After significant volatility, analysts predict steel prices will stabilize in the third quarter, providing relief to manufacturers.',
      source: 'Metal Market Analysis',
      date: '2023-05-08',
      category: 'Pricing',
      imageUrl: '/placeholder.svg'
    }
  ];
};

// Notifications
export const getNotifications = async () => {
  await apiDelay();
  return [
    {
      id: 1,
      title: 'Production Alert',
      message: 'Mill #3 efficiency has dropped by 15%. Maintenance team dispatched.',
      type: 'alert',
      timestamp: '2023-05-15T09:24:00',
      read: false
    },
    {
      id: 2,
      title: 'Order Fulfilled',
      message: 'Order #28745 for Automotive Steel has been shipped ahead of schedule.',
      type: 'success',
      timestamp: '2023-05-15T08:15:00',
      read: true
    },
    {
      id: 3,
      title: 'New Insight Available',
      message: 'AI has generated new insights for optimizing your supply chain. View now.',
      type: 'info',
      timestamp: '2023-05-14T16:30:00',
      read: false
    },
    {
      id: 4,
      title: 'Maintenance Scheduled',
      message: 'Preventive maintenance scheduled for Furnace #2 on May 20.',
      type: 'info',
      timestamp: '2023-05-14T11:45:00',
      read: true
    },
    {
      id: 5,
      title: 'Price Change Alert',
      message: 'Raw material prices increased by 5%. Impact analysis available.',
      type: 'warning',
      timestamp: '2023-05-13T14:20:00',
      read: false
    }
  ];
};

// KPI Detail Data
export const getKpiDetailData = async (kpiId: string) => {
  await apiDelay();
  // Simulated KPI detail data based on the kpiId
  const baseData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    actual: Math.floor(Math.random() * 100) + 50,
    target: 85,
    industry: 75
  }));

  // Add some variation based on the KPI ID
  switch (kpiId) {
    case 'production-yield':
      return {
        title: 'Production Yield',
        unit: '%',
        data: baseData.map(item => ({ ...item, actual: item.actual % 30 + 70 })),
        insights: [
          'Production yield has exceeded targets for 4 consecutive months',
          'Implementing predictive maintenance has reduced downtime by 23%',
          'Consider applying successful process improvements from Mill #3 to other facilities'
        ]
      };
    case 'energy-consumption':
      return {
        title: 'Energy Consumption',
        unit: 'MWh',
        data: baseData.map(item => ({ ...item, actual: item.actual * 10 + 800 })),
        insights: [
          'Energy consumption is 12% below industry average',
          'Peak usage occurs during mid-day operations',
          'Recommendation: Evaluate shift scheduling to optimize energy costs'
        ]
      };
    case 'quality-rating':
      return {
        title: 'Quality Rating',
        unit: 'Score',
        data: baseData.map(item => ({ ...item, actual: item.actual % 20 + 80 })),
        insights: [
          'Quality ratings have been consistently A or A+ for the past quarter',
          'Defect rate has decreased by 18% year-over-year',
          'Focus area: Further reduce variation in tensile strength measurements'
        ]
      };
    case 'on-time-delivery':
      return {
        title: 'On-Time Delivery',
        unit: '%',
        data: baseData.map(item => ({ ...item, actual: item.actual % 25 + 75 })),
        insights: [
          'On-time delivery has improved by 7% after logistics AI implementation',
          'Weather-related delays account for 65% of late deliveries',
          'Recommendation: Increase safety stock for weather-sensitive routes'
        ]
      };
    default:
      return {
        title: 'KPI Details',
        unit: '',
        data: baseData,
        insights: [
          'This KPI has shown consistent improvement over the past quarter',
          'Performance is 15% above industry average',
          'AI analysis suggests potential for further 8-10% improvement'
        ]
      };
  }
};

// Production chart details
export const getProductionDetailData = async () => {
  await apiDelay();
  return {
    title: 'Steel Production Analysis',
    subtitle: 'Monthly Production Metrics',
    data: [
      { month: 'Jan', actual: 12500, planned: 12000, lastYear: 11000 },
      { month: 'Feb', actual: 11800, planned: 12000, lastYear: 10500 },
      { month: 'Mar', actual: 13200, planned: 12500, lastYear: 11200 },
      { month: 'Apr', actual: 14100, planned: 13000, lastYear: 12000 },
      { month: 'May', actual: 15000, planned: 14000, lastYear: 12800 },
      { month: 'Jun', actual: 15500, planned: 14500, lastYear: 13200 },
      { month: 'Jul', actual: 16200, planned: 15000, lastYear: 13800 },
      { month: 'Aug', actual: 15800, planned: 15500, lastYear: 14000 },
      { month: 'Sep', actual: 16500, planned: 16000, lastYear: 14500 },
      { month: 'Oct', actual: 17200, planned: 16500, lastYear: 15000 },
      { month: 'Nov', actual: 17800, planned: 17000, lastYear: 15500 },
      { month: 'Dec', actual: 18500, planned: 18000, lastYear: 16000 }
    ],
    insights: [
      'Production has consistently exceeded targets by an average of 4.3%',
      'Year-over-year growth shows a 15.2% increase in output',
      'Q4 shows the strongest performance, with December reaching a record high',
      'Efficiency improvements have enabled higher production with the same equipment'
    ],
    recommendations: [
      'Consider increasing planned targets for next year by 10%',
      'Analyze Q4 operations for best practices that can be applied year-round',
      'Review raw material forecasting to ensure supplies can meet increased production'
    ]
  };
};

// Energy chart details
export const getEnergyDetailData = async () => {
  await apiDelay();
  return {
    title: 'Energy Consumption Analysis',
    subtitle: 'Monthly Energy Metrics',
    data: [
      { month: 'Jan', consumption: 2400, benchmark: 2600, target: 2300 },
      { month: 'Feb', consumption: 1800, benchmark: 2500, target: 2200 },
      { month: 'Mar', consumption: 3000, benchmark: 2800, target: 2500 },
      { month: 'Apr', consumption: 2700, benchmark: 2700, target: 2400 },
      { month: 'May', consumption: 3600, benchmark: 3000, target: 2700 },
      { month: 'Jun', consumption: 3300, benchmark: 3200, target: 2900 },
      { month: 'Jul', consumption: 4200, benchmark: 3500, target: 3200 },
      { month: 'Aug', consumption: 3900, benchmark: 3600, target: 3300 },
      { month: 'Sep', consumption: 4800, benchmark: 3800, target: 3500 },
      { month: 'Oct', consumption: 4500, benchmark: 3700, target: 3400 },
      { month: 'Nov', consumption: 5400, benchmark: 3900, target: 3600 },
      { month: 'Dec', consumption: 5100, benchmark: 3800, target: 3500 }
    ],
    insights: [
      'Energy consumption exceeds industry benchmarks by 18% on average',
      'Summer months show the highest consumption due to increased cooling needs',
      'Consumption has been consistently above target levels throughout the year',
      'The gap between actual consumption and targets is widening in recent months'
    ],
    recommendations: [
      'Conduct energy audit focusing on heavy consumption periods',
      'Implement energy recovery systems in high-use processes',
      'Consider shifting energy-intensive operations to off-peak hours',
      'Evaluate renewable energy options to reduce overall consumption costs'
    ]
  };
};

// Websocket service mock
export const subscribeToRealTimeData = (callback: (data: any) => void) => {
  const interval = setInterval(() => {
    callback({
      timestamp: new Date().toISOString(),
      productionRate: Math.floor(Math.random() * 100) + 900,
      energyUsage: Math.floor(Math.random() * 50) + 450,
      qualityScore: Math.floor(Math.random() * 10) + 90,
      alerts: Math.random() > 0.7 ? [{
        id: Date.now(),
        message: 'Anomaly detected in production line 3',
        severity: 'medium'
      }] : []
    });
  }, 5000);
  
  return () => clearInterval(interval);
};
