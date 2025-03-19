
// Mock data service for steel industry application
import axios from 'axios';

interface KpiData {
  value: string | number;
  change: number;
}

// Simulated APIs for steel industry data

export const getProductionData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock production data
  return [
    { date: '2024-01', value: 15420 },
    { date: '2024-02', value: 16100 },
    { date: '2024-03', value: 15800 },
    { date: '2024-04', value: 16500 },
    { date: '2024-05', value: 17200 },
    { date: '2024-06', value: 18100 },
    { date: '2024-07', value: 17650 },
  ];
};

export const getEnergyConsumptionData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock energy data
  return [
    { date: '2024-01', value: 1250 },
    { date: '2024-02', value: 1310 },
    { date: '2024-03', value: 1260 },
    { date: '2024-04', value: 1200 },
    { date: '2024-05', value: 1150 },
    { date: '2024-06', value: 1120 },
    { date: '2024-07', value: 1080 },
  ];
};

export const getKpiData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate mock KPI data
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

export const getAiInsights = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Generate mock AI insights
  return [
    "Production yields can be improved by 3.2% by adjusting rolling mill temperature by 5°C",
    "Energy consumption patterns suggest potential for 8% savings with modified operating schedules",
    "Quality issues in the East plant show correlation with specific raw material supplier batches",
    "Logistics data indicates an opportunity to optimize delivery routes, potentially saving 12% in fuel costs"
  ];
};

export const getAiAgents = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate mock AI agents data
  return [
    {
      id: 1,
      name: "Agentic RCA",
      description: "AI-powered Root Cause Analysis for steel manufacturing issues",
      status: "active",
      confidence: 93,
      icon: "brain-circuit"
    },
    {
      id: 2,
      name: "Smart RCA Generator",
      description: "Generates comprehensive root cause analysis reports with recommendations",
      status: "inactive",
      confidence: 88,
      icon: "bar-chart"
    },
    {
      id: 3,
      name: "PlanXpert",
      description: "Production planning optimization with real-time constraints handling",
      status: "active",
      confidence: 95,
      icon: "zap"
    },
    {
      id: 4,
      name: "QualityGuard",
      description: "Predictive quality control system that detects potential issues before they occur",
      status: "active",
      confidence: 91,
      icon: "check-circle"
    },
    {
      id: 5,
      name: "RiskRadar",
      description: "Supply chain risk detection and proactive mitigation recommendations",
      status: "inactive",
      confidence: 86,
      icon: "shield"
    }
  ];
};

export const getLatestNews = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock industry news
  return [
    {
      id: 1,
      title: "Steel Industry Embraces AI for Sustainable Manufacturing",
      summary: "Leading steel producers are implementing advanced AI systems to reduce carbon emissions and optimize production.",
      source: "Steel Industry Today",
      date: "2024-07-15",
      category: "Innovation"
    },
    {
      id: 2,
      title: "New Breakthrough in Carbon Capture Technology for Steel Production",
      summary: "Researchers announce promising results in carbon capture methods specifically designed for steel manufacturing facilities.",
      source: "Green Manufacturing Journal",
      date: "2024-07-12",
      category: "Sustainability"
    },
    {
      id: 3,
      title: "Global Steel Market Projected to Grow 5.8% in Next Quarter",
      summary: "Industry analysts predict stronger than expected growth in steel demand driven by infrastructure investments.",
      source: "Metal Market Reports",
      date: "2024-07-10",
      category: "Market Analysis"
    },
    {
      id: 4,
      title: "AI-Powered Quality Control Reduces Defects by 32%",
      summary: "Implementation of machine learning quality control systems shows significant improvements in steel product quality.",
      source: "Manufacturing Innovation",
      date: "2024-07-08",
      category: "Technology"
    },
    {
      id: 5,
      title: "Supply Chain Resilience: New Strategies for Steel Producers",
      summary: "Industry leaders share innovative approaches to building more robust and adaptive supply chains.",
      source: "Supply Chain Digest",
      date: "2024-07-05",
      category: "Logistics"
    }
  ];
};

export const getCoPilotAnalytics = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock co-pilot usage analytics
  return {
    modelsAnalyzed: 12,
    dataPointsProcessed: 15000,
    predictionsGenerated: 87
  };
};

export const getNotifications = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock notifications
  return [
    {
      id: 1,
      title: "Production Anomaly Detected",
      message: "AI system detected unusual pattern in Line 3 production data",
      type: "alert",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false
    },
    {
      id: 2,
      title: "Maintenance Recommendation",
      message: "Predictive maintenance suggests servicing Rolling Mill 2 within next 72 hours",
      type: "info",
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      read: true
    },
    {
      id: 3,
      title: "Supply Chain Risk Alert",
      message: "Potential disruption in raw material supply from Vendor XYZ",
      type: "warning",
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      read: false
    }
  ];
};

// API functions for individual agents
export const getAgentById = async (agentId: number) => {
  const allAgents = await getAiAgents();
  return allAgents.find(agent => agent.id === agentId) || null;
};

export const getAgentAnalytics = async (agentId: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return {
    issuesResolved: 35 + Math.floor(Math.random() * 20),
    avgResponseTime: 2.4 + (Math.random() * 1.5),
    userSatisfaction: 88 + Math.floor(Math.random() * 10),
    conversationsCompleted: 143 + Math.floor(Math.random() * 50)
  };
};

export const getAgentRecommendations = async (agentId: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const recommendations = [
    "Adjust production schedule to account for maintenance downtime",
    "Investigate supplier quality issues affecting finished product",
    "Review energy consumption patterns to identify optimization opportunities",
    "Consider inventory rebalancing based on current demand patterns",
    "Evaluate alternative logistics routes to reduce delivery times"
  ];
  
  // Return 2-3 random recommendations
  return recommendations
    .sort(() => 0.5 - Math.random())
    .slice(0, 2 + Math.floor(Math.random() * 2));
};
