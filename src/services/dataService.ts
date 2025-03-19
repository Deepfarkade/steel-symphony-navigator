
// Fix the typo in the getKpiDetailData function
export const getKpiDetailData = async (kpiId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock KPI data based on the KPI ID
  const kpiDataMap: Record<string, any> = {
    'production-yield': {
      title: 'Production Yield',
      value: '94.8%',
      change: 2.3,
      trend: [92.1, 92.8, 93.5, 93.9, 94.2, 94.8],
      target: 95.5,
      analysis: 'Production yield is showing steady improvement over the last 6 months. Current trend indicates target will be reached within the next quarter if improvement rate maintains.',
      recommendations: [
        'Optimize temperature control in the rolling process to reduce variations',
        'Implement additional quality checks at critical production stages',
        'Review raw material specifications for consistency improvement'
      ]
    },
    'energy-consumption': {
      title: 'Energy Consumption',
      value: '1,235 MWh',
      change: -5.7,
      trend: [1310, 1290, 1275, 1260, 1245, 1235],
      target: 1200,
      analysis: 'Energy consumption has been decreasing steadily, with most significant improvements in heating processes. Further optimization potential exists in auxiliary systems.',
      recommendations: [
        'Implement heat recovery systems in annealing furnaces',
        'Optimize motor operation schedules during non-peak hours',
        'Upgrade insulation in aging equipment to reduce heat loss'
      ]
    },
    'quality-rating': {
      title: 'Quality Rating',
      value: 'A+',
      change: 1.2,
      trend: ['A-', 'A-', 'A', 'A', 'A', 'A+'],
      target: 'A+',
      analysis: 'Quality rating has reached target level after implementation of enhanced quality control procedures. Maintaining this level will require continued vigilance.',
      recommendations: [
        'Maintain rigorous quality control standards that led to improvement',
        'Implement additional training for new personnel',
        'Consider investing in advanced defect detection systems'
      ]
    },
    'on-time-delivery': {
      title: 'On-Time Delivery',
      value: '92.3%',
      change: -0.8,
      trend: [93.5, 93.2, 93.0, 92.7, 92.5, 92.3],
      target: 95.0,
      analysis: 'On-time delivery is showing a slight downward trend over the past 6 months. Logistics and production scheduling coordination issues have been identified as primary causes.',
      recommendations: [
        'Implement improved coordination between production and logistics departments',
        'Review transportation partner performance and consider alternatives',
        'Develop buffer strategies for high-priority customers'
      ]
    }
  };
  
  return kpiDataMap[kpiId] || {
    title: 'KPI Details',
    value: 'N/A',
    change: 0,
    trend: [0, 0, 0, 0, 0, 0],
    target: 0,
    analysis: 'No data available for this KPI',
    recommendations: ['No recommendations available']
  };
};

// Add getLatestNews function
export const getLatestNews = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock news data
  const newsData = [
    {
      id: 1,
      title: 'New Carbon Reduction Technologies in Steel Manufacturing',
      summary: 'Several leading steel producers are investing in innovative carbon capture technologies to reduce emissions by up to 30%.',
      source: 'Steel Industry Journal',
      date: '2023-07-15',
      category: 'Sustainability'
    },
    {
      id: 2,
      title: 'Global Steel Demand Expected to Rise 4.2% in Next Quarter',
      summary: 'Market analysis predicts increased demand in construction and automotive sectors, particularly in emerging markets.',
      source: 'Metal Market Reports',
      date: '2023-07-12',
      category: 'Market Analysis'
    },
    {
      id: 3,
      title: 'AI-Driven Quality Control Systems Reduce Defects by 15%',
      summary: 'Implementation of computer vision and machine learning models is revolutionizing quality assurance in steel production.',
      source: 'Tech & Manufacturing Today',
      date: '2023-07-10',
      category: 'Technology'
    },
    {
      id: 4,
      title: 'New Logistics Optimization Platform Cuts Delivery Times',
      summary: 'Digital platform integrating real-time tracking and AI-optimized routing shows promising results in initial deployments.',
      source: 'Supply Chain Weekly',
      date: '2023-07-08',
      category: 'Logistics'
    },
    {
      id: 5,
      title: 'Breakthrough in High-Strength Lightweight Steel Alloys',
      summary: 'Research team develops new alloy composition promising 25% weight reduction without compromising structural integrity.',
      source: 'Materials Science Digest',
      date: '2023-07-05',
      category: 'Innovation'
    }
  ];
  
  return newsData;
};

// Add getAiAgents function
export const getAiAgents = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock AI agents data
  const agentsData = [
    {
      id: 1,
      name: 'Supply Chain Analyzer',
      description: 'Optimizes steel supply chains, identifies bottlenecks, and provides real-time recommendations',
      status: 'active',
      confidence: 92,
      icon: 'truck'
    },
    {
      id: 2,
      name: 'Quality Predictor',
      description: 'Predicts potential quality issues before they occur using sensor data and historical patterns',
      status: 'active',
      confidence: 87,
      icon: 'check-circle'
    },
    {
      id: 3,
      name: 'Agentic RCA',
      description: 'Performs autonomous root cause analysis on production issues and suggests corrective actions',
      status: 'learning',
      confidence: 78,
      icon: 'zap'
    },
    {
      id: 4,
      name: 'PlanXpert',
      description: 'Creates optimized production schedules based on current orders, capacity, and maintenance needs',
      status: 'active',
      confidence: 94,
      icon: 'calendar'
    },
    {
      id: 5,
      name: 'Smart RCA Generator',
      description: 'Analyzes patterns in machine data to predict maintenance needs before failures occur',
      status: 'learning',
      confidence: 83,
      icon: 'shield'
    }
  ];
  
  return agentsData;
};

// Add getAgentById function
export const getAgentById = async (agentId: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get all agents and find the requested one
  const agents = await getAiAgents();
  return agents.find(agent => agent.id === agentId) || null;
};

// Add getAgentAnalytics function
export const getAgentAnalytics = async (agentId: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock analytics data based on agent ID
  const analyticsMap: Record<number, any> = {
    1: {
      issuesResolved: 47,
      avgResponseTime: 0.8,
      userSatisfaction: 92,
      conversationsCompleted: 183
    },
    2: {
      issuesResolved: 63,
      avgResponseTime: 1.2,
      userSatisfaction: 88,
      conversationsCompleted: 215
    },
    3: {
      issuesResolved: 29,
      avgResponseTime: 2.1,
      userSatisfaction: 76,
      conversationsCompleted: 104
    },
    4: {
      issuesResolved: 82,
      avgResponseTime: 0.6,
      userSatisfaction: 95,
      conversationsCompleted: 247
    },
    5: {
      issuesResolved: 34,
      avgResponseTime: 1.7,
      userSatisfaction: 81,
      conversationsCompleted: 129
    }
  };
  
  return analyticsMap[agentId] || {
    issuesResolved: 0,
    avgResponseTime: 0,
    userSatisfaction: 0,
    conversationsCompleted: 0
  };
};

// Add getAgentRecommendations function
export const getAgentRecommendations = async (agentId: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock recommendations based on agent ID
  const recommendationsMap: Record<number, string[]> = {
    1: [
      'Optimize inventory levels at Distribution Center #3',
      'Consider alternative shipping routes for Northern Europe deliveries',
      'Evaluate supplier performance for raw materials in Q3'
    ],
    2: [
      'Adjust cooling parameters for Batch #AF-239',
      'Increase sampling frequency for high-grade steel sheets',
      'Review calibration on Line 2 thickness sensors'
    ],
    3: [
      'Investigate root cause of recurring stoppages on Line 3',
      'Analyze pattern of quality deviations in night shift production',
      'Review maintenance procedures for Rolling Mill #2'
    ],
    4: [
      'Reschedule maintenance for Furnace #2 to reduce impact',
      'Prioritize high-margin orders for Week 28',
      'Optimize batch sequences to reduce setup times'
    ],
    5: [
      'Replace bearings on Pump System P-12 within 2 weeks',
      'Investigate increased power consumption on Drive Unit D-7',
      'Perform vibration analysis on Conveyor C-4'
    ]
  };
  
  return recommendationsMap[agentId] || ['No recommendations available'];
};

// Add getModuleInsights function
export const getModuleInsights = async (moduleName: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Mock insights based on module name
  const insightsMap: Record<string, any[]> = {
    'demand-planning': [
      { id: 1, text: 'AI analysis indicates a potential 12% increase in steel plate demand from the automotive sector in Q3 2023.' },
      { id: 2, text: 'Historical pattern suggests preparing for seasonal decline in construction sector orders starting in month 10.' },
      { id: 3, text: 'Price sensitivity analysis shows opportunity to optimize pricing for hot-rolled coils in Asian markets.' }
    ],
    'supply-planning': [
      { id: 1, text: 'Supplier risk assessment identifies potential delays from Supplier XYZ due to regional logistics issues.' },
      { id: 2, text: 'Recommend increasing safety stock of critical alloys by 15% due to global supply chain uncertainties.' },
      { id: 3, text: 'Alternative sourcing options identified for raw material R-235 with potential cost savings of 7%.' }
    ],
    'factory-planning': [
      { id: 1, text: 'Optimized production schedule would reduce changeover times by approximately 14% on Line 2.' },
      { id: 2, text: 'Energy consumption pattern suggests shifting high-energy processes to off-peak hours for cost reduction.' },
      { id: 3, text: 'Preventive maintenance recommended for Rolling Mill #3 within the next 15 days based on sensor data pattern.' }
    ],
    'analytics': [
      { id: 1, text: 'Custom dashboard created for executive team showing key performance metrics across all production facilities.' },
      { id: 2, text: 'New anomaly detection algorithm implemented to identify quality deviations in real-time.' },
      { id: 3, text: 'Correlation analysis reveals strong relationship between ambient temperature and product quality for certain grades.' }
    ]
  };
  
  return insightsMap[moduleName] || [
    { id: 1, text: 'AI analysis of recent data patterns suggests optimization opportunities in this module.' },
    { id: 2, text: 'Machine learning models have identified potential areas for efficiency improvement in key processes.' }
  ];
};

// Add getNotifications function
export const getNotifications = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock notifications data
  const notificationsData = [
    {
      id: 1,
      title: 'Critical Alert: Temperature Threshold Exceeded',
      message: 'Furnace #2 has exceeded optimal temperature range for over 30 minutes. Immediate attention required.',
      type: 'alert',
      timestamp: '2023-07-15T09:23:45Z',
      read: false
    },
    {
      id: 2,
      title: 'Maintenance Reminder',
      message: 'Scheduled maintenance for Rolling Mill #3 is due in 48 hours. Please prepare maintenance team and required parts.',
      type: 'info',
      timestamp: '2023-07-15T08:12:30Z',
      read: true
    },
    {
      id: 3,
      title: 'Order Status Update',
      message: 'Order #47892 for Acme Corp has been completed and is ready for shipping. Awaiting quality approval.',
      type: 'info',
      timestamp: '2023-07-14T16:45:22Z',
      read: false
    },
    {
      id: 4,
      title: 'Inventory Warning',
      message: 'Raw material "Carbon Alloy X-42" is below minimum threshold (current: 18%, minimum: 20%). Consider reordering.',
      type: 'warning',
      timestamp: '2023-07-14T14:33:10Z',
      read: false
    },
    {
      id: 5,
      title: 'Quality Issue Detected',
      message: 'Quality check on Batch #A-238 has detected dimensional inconsistency. Review required before proceeding.',
      type: 'alert',
      timestamp: '2023-07-14T11:27:15Z',
      read: true
    },
    {
      id: 6,
      title: 'System Update Completed',
      message: 'ERP system update has been completed successfully. New features are now available in the Production module.',
      type: 'info',
      timestamp: '2023-07-13T22:15:40Z',
      read: true
    }
  ];
  
  return notificationsData;
};

// Add getProductionData function
export const getProductionData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock production data
  const productionData = [
    { name: 'Jan', value: 42000 },
    { name: 'Feb', value: 43800 },
    { name: 'Mar', value: 48200 },
    { name: 'Apr', value: 45900 },
    { name: 'May', value: 47500 },
    { name: 'Jun', value: 49800 },
    { name: 'Jul', value: 46700 },
    { name: 'Aug', value: 50200 },
    { name: 'Sep', value: 52500 },
    { name: 'Oct', value: 54800 },
    { name: 'Nov', value: 53200 },
    { name: 'Dec', value: 51900 }
  ];
  
  return productionData;
};

// Add getEnergyConsumptionData function
export const getEnergyConsumptionData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock energy consumption data
  const energyData = [
    { name: 'Jan', value: 1230 },
    { name: 'Feb', value: 1280 },
    { name: 'Mar', value: 1340 },
    { name: 'Apr', value: 1290 },
    { name: 'May', value: 1320 },
    { name: 'Jun', value: 1380 },
    { name: 'Jul', value: 1360 },
    { name: 'Aug', value: 1410 },
    { name: 'Sep', value: 1340 },
    { name: 'Oct', value: 1290 },
    { name: 'Nov', value: 1260 },
    { name: 'Dec', value: 1310 }
  ];
  
  return energyData;
};

// Add getKpiData function
export const getKpiData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock KPI data
  const kpiData = {
    'production-yield': {
      title: 'Production Yield',
      value: '94.8%',
      change: 2.3,
      status: 'up',
      color: 'green'
    },
    'energy-consumption': {
      title: 'Energy Consumption',
      value: '1,235 MWh',
      change: -5.7,
      status: 'down',
      color: 'green'
    },
    'quality-rating': {
      title: 'Quality Rating',
      value: 'A+',
      change: 1.2,
      status: 'up',
      color: 'green'
    },
    'on-time-delivery': {
      title: 'On-Time Delivery',
      value: '92.3%',
      change: -0.8,
      status: 'down',
      color: 'red'
    }
  };
  
  return kpiData;
};

// Add getAiInsights function
export const getAiInsights = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Mock AI insights
  const insights = [
    {
      id: 1,
      title: 'Potential Production Bottleneck',
      description: 'Analysis of recent production data indicates a developing bottleneck in the annealing process. Throughput has decreased by 7% over the past 10 days.',
      category: 'Production',
      priority: 'High',
      recommendations: [
        'Review annealing furnace temperature controls',
        'Analyze operator shift patterns for consistency',
        'Consider maintenance inspection of feed mechanisms'
      ]
    },
    {
      id: 2,
      title: 'Inventory Optimization Opportunity',
      description: 'Current inventory levels for Grade-A steel coils are 23% above optimal levels based on current and forecasted orders.',
      category: 'Inventory',
      priority: 'Medium',
      recommendations: [
        'Adjust production schedule to reduce Grade-A output by 15% for next 2 weeks',
        'Review safety stock levels based on updated lead time data',
        'Explore promotional opportunities with sales team'
      ]
    },
    {
      id: 3,
      title: 'Energy Consumption Anomaly',
      description: 'Electricity usage in Rolling Mill #2 has increased by 12% with no corresponding increase in production output.',
      category: 'Energy',
      priority: 'Medium',
      recommendations: [
        'Perform diagnostic check on main drive motors',
        'Verify calibration of energy monitoring systems',
        'Review process parameters for optimization opportunities'
      ]
    },
    {
      id: 4,
      title: 'Quality Trend Alert',
      description: 'Slight increase in surface defect rates for thin gauge products over the past 3 production runs.',
      category: 'Quality',
      priority: 'High',
      recommendations: [
        'Inspect and clean tension rollers in finishing section',
        'Review recent changes in raw material characteristics',
        'Temporarily increase sampling rate at final inspection'
      ]
    }
  ];
  
  return insights;
};

// Add getCoPilotAnalytics function
export const getCoPilotAnalytics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock Co-Pilot analytics
  const analytics = {
    modelsAnalyzed: 14,
    dataPointsProcessed: 1236000,
    predictionsGenerated: 348,
    accuracyRate: 94.2,
    activeAgents: 5,
    insightsGenerated: 28
  };
  
  return analytics;
};

// Add getProductionDetailData function
export const getProductionDetailData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock detailed production data
  const detailData = {
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
  
  return detailData;
};

// Add getEnergyDetailData function
export const getEnergyDetailData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock detailed energy data
  const detailData = {
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
  
  return detailData;
};
