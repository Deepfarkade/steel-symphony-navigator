import { faker } from '@faker-js/faker';
import axios from 'axios';
import { 
  API_CONFIG, 
  DATA_ENDPOINTS, 
  AGENTS_ENDPOINTS,
  RISK_ENDPOINTS 
} from './apiConfig';

// Helper function for simulating API delay
const apiDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

/**
 * IMPORTANT: This file currently uses mock data.
 * TO CONNECT TO YOUR BACKEND:
 * 1. Remove the apiDelay() calls
 * 2. Replace the mock data returns with actual API calls using the endpoints in apiConfig.ts
 * 3. Uncomment the axios implementation examples provided in each function
 */

// Mock KPI data
export const getKpis = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // Uncomment and replace the mock data when connecting to your backend
  // return axios.get(DATA_ENDPOINTS.kpis, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   },
  //   timeout: API_CONFIG.timeouts.default
  // }).then(response => response.data);
  
  return [
    {
      id: 1,
      title: 'Production Volume',
      value: faker.number.int({ min: 1000, max: 5000 }),
      trend: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      target: faker.number.int({ min: 5000, max: 6000 }),
      status: 'good',
      description: 'Total steel produced this month',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.int({ min: 1000, max: 5000 }))
    },
    {
      id: 2,
      title: 'Energy Consumption',
      value: faker.number.int({ min: 500, max: 2000 }),
      trend: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      target: faker.number.int({ min: 400, max: 1500 }),
      status: 'warning',
      description: 'Energy used per ton of steel',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.int({ min: 500, max: 2000 }))
    },
    {
      id: 3,
      title: 'Downtime Incidents',
      value: faker.number.int({ min: 0, max: 10 }),
      trend: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      target: 2,
      status: 'bad',
      description: 'Number of unplanned downtime events',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.int({ min: 0, max: 10 }))
    },
    {
      id: 4,
      title: 'Material Waste',
      value: faker.number.int({ min: 100, max: 500 }),
      trend: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      target: faker.number.int({ min: 50, max: 200 }),
      status: 'good',
      description: 'Tons of material wasted in production',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.int({ min: 100, max: 500 }))
    },
    {
      id: 5,
      title: 'Order Fulfillment Rate',
      value: faker.number.float({ min: 80, max: 100, fractionDigits: 1 }),
      trend: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      target: 95,
      status: 'good',
      description: 'Percentage of orders fulfilled on time',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.float({ min: 80, max: 100, fractionDigits: 1 }))
    },
    {
      id: 6,
      title: 'Customer Satisfaction',
      value: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      trend: faker.number.float({ min: -5, max: 10, fractionDigits: 1 }),
      target: 4.5,
      status: 'warning',
      description: 'Average customer satisfaction rating',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.float({ min: 1, max: 5, fractionDigits: 1 }))
    }
  ];
};

// Mock notification data
export const getNotifications = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // Uncomment and replace the mock data when connecting to your backend
  // return axios.get(DATA_ENDPOINTS.notifications, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return [
    {
      id: 1,
      type: 'alert',
      message: 'High energy consumption detected in furnace #3',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'unread',
      title: 'High Energy Alert',
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'New maintenance schedule available for rolling mill',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'read',
      title: 'Maintenance Update',
      read: true
    },
    {
      id: 3,
      type: 'warning',
      message: 'Downtime incident reported in casting line',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'unread',
      title: 'Downtime Incident',
      read: false
    },
    {
      id: 4,
      type: 'success',
      message: 'Production target met for hot-rolled coil',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'read',
      title: 'Target Achieved',
      read: true
    }
  ];
};

// Mock chart data
export const getProductionChartData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.productionData, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Steel Production (Tons)',
        data: Array.from({ length: 6 }, () => faker.number.int({ min: 2000, max: 5000 })),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
};

export const getEnergyChartData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.energyData, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Energy Consumption (MWh)',
        data: Array.from({ length: 6 }, () => faker.number.int({ min: 1000, max: 3000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
};

// Mock user preferences
export const getUserPreferences = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.preferences, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    theme: 'light',
    language: 'en',
    notificationsEnabled: true,
    alertsEnabled: true
  };
};

// Mock chat messages
export const getChatMessages = async (module?: string) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.chatMessages(module), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  const messages = [
    {
      id: 1,
      sender: 'AI Assistant',
      text: `Hello! How can I assist you with ${module ? module : 'your operations'} today?`,
      timestamp: faker.date.recent().toLocaleTimeString()
    },
    {
      id: 2,
      sender: 'User',
      text: 'What is the current production volume?',
      timestamp: faker.date.recent().toLocaleTimeString()
    },
    {
      id: 3,
      sender: 'AI Assistant',
      text: 'The current production volume is 4,200 tons.',
      timestamp: faker.date.recent().toLocaleTimeString()
    }
  ];
  
  return messages;
};

// All available agents (full marketplace)
const allAvailableAgents = [
  {
    id: 101,
    name: 'Supply Chain Optimizer',
    description: 'Continuously analyzes your supply chain for efficiency improvements',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'truck',
    confidence: 94,
    compatibility: 'high',
    type: 'operational',
    lastUpdated: '2023-11-12'
  },
  {
    id: 102,
    name: 'Production Intelligence',
    description: 'Monitors production data to identify patterns and optimization opportunities',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'bar-chart',
    confidence: 92,
    compatibility: 'high',
    type: 'analytical',
    lastUpdated: '2023-10-28'
  },
  {
    id: 103,
    name: 'Energy Consumption Analyzer',
    description: 'Analyzes energy usage and recommends efficiency improvements',
    status: 'learning' as 'active' | 'learning' | 'inactive',
    icon: 'zap',
    confidence: 86,
    compatibility: 'medium',
    type: 'operational',
    lastUpdated: '2023-11-05'
  },
  {
    id: 104,
    name: 'Sustainability Monitor',
    description: 'Tracks sustainability metrics and suggests green initiatives',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'globe',
    confidence: 90,
    compatibility: 'high',
    type: 'strategic',
    lastUpdated: '2023-11-01'
  },
  {
    id: 105,
    name: 'Crisis Management AI',
    description: 'Predicts potential supply chain disruptions and provides mitigation strategies',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'alert-triangle',
    confidence: 89,
    compatibility: 'medium',
    type: 'strategic',
    lastUpdated: '2023-10-15'
  },
  {
    id: 106,
    name: 'What-If Scenarios Analyzer',
    description: 'Runs simulations on different business scenarios to provide insights on potential outcomes',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'lightbulb',
    confidence: 92,
    compatibility: 'high',
    type: 'strategic',
    lastUpdated: '2023-11-10'
  },
  {
    id: 107,
    name: 'Predictive Maintenance AI',
    description: 'Predicts equipment failures and optimizes maintenance schedules',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'tool',
    confidence: 88,
    compatibility: 'high',
    type: 'operational',
    lastUpdated: '2023-11-15'
  },
  {
    id: 108,
    name: 'Logistics Optimization AI',
    description: 'Optimizes logistics and transportation routes for cost savings',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'truck',
    confidence: 91,
    compatibility: 'high',
    type: 'operational',
    lastUpdated: '2023-11-20'
  },
  {
    id: 109,
    name: 'Demand Forecasting AI',
    description: 'Predicts future demand for steel products',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'bar-chart-2',
    confidence: 93,
    compatibility: 'high',
    type: 'analytical',
    lastUpdated: '2023-11-25'
  },
  {
    id: 110,
    name: 'Risk Management AI',
    description: 'Identifies and assesses potential risks in the steel manufacturing process',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'alert-triangle',
    confidence: 89,
    compatibility: 'high',
    type: 'strategic',
    lastUpdated: '2023-11-30'
  },
  {
    id: 111,
    name: 'Quality Control Monitor',
    description: 'Analyzes product quality and identifies improvement areas',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'check-circle',
    confidence: 93,
    compatibility: 'high',
    type: 'operational',
    lastUpdated: '2023-12-05'
  },
  {
    id: 112,
    name: 'Market Trend Analyzer',
    description: 'Identifies steel market trends and predicts price movements',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'trending-up',
    confidence: 88,
    compatibility: 'medium',
    type: 'analytical',
    lastUpdated: '2023-12-10'
  },
  {
    id: 113,
    name: 'Carbon Footprint Tracker',
    description: 'Monitors carbon emissions and suggests reduction strategies',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'leaf',
    confidence: 90,
    compatibility: 'high',
    type: 'sustainability',
    lastUpdated: '2023-12-15'
  },
  {
    id: 114,
    name: 'Inventory Management AI',
    description: 'Optimizes inventory levels to reduce costs',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'package',
    confidence: 94,
    compatibility: 'high',
    type: 'operational',
    lastUpdated: '2023-12-20'
  },
  {
    id: 115,
    name: 'Employee Performance Optimizer',
    description: 'Analyzes worker productivity and suggests improvements',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'users',
    confidence: 88,
    compatibility: 'medium',
    type: 'hr',
    lastUpdated: '2023-12-25'
  },
  {
    id: 116,
    name: 'Equipment Efficiency Analyzer',
    description: 'Monitors equipment performance and suggests optimizations',
    status: 'active' as 'active' | 'learning' | 'inactive',
    icon: 'settings',
    confidence: 93,
    compatibility: 'high',
    type: 'operational',
    lastUpdated: '2023-12-30'
  }
];

// User's currently deployed agents (tracked in memory for demo)
let userAgents: any[] = [];

// Function to get available agents (all agents not currently deployed by the user)
export const getAvailableAgents = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(AGENTS_ENDPOINTS.available, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  // Get all agents that are not currently deployed by the user
  const userAgentIds = userAgents.map(agent => agent.id);
  return allAvailableAgents.filter(agent => !userAgentIds.includes(agent.id));
};

// Function to get AI agents for the current user
export const getAiAgents = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(AGENTS_ENDPOINTS.deployed, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return [...userAgents]; // Return a copy to prevent unintended mutations
};

// Function to add an AI agent to the current user
export const addAgentToUser = async (agentId: number) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.post(AGENTS_ENDPOINTS.add, { agentId }, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  const availableAgents = await getAvailableAgents();
  const agentToAdd = availableAgents.find(agent => agent.id === agentId);
  
  if (agentToAdd) {
    // Add to user's agents only if not already there
    if (!userAgents.some(a => a.id === agentId)) {
      userAgents.push({...agentToAdd});
    }
    return true;
  }
  
  return false;
};

// Function to remove an AI agent from the current user
export const removeAgentFromUser = async (agentId: number) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.delete(AGENTS_ENDPOINTS.remove(agentId), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  // Remove from user's agents
  userAgents = userAgents.filter(agent => agent.id !== agentId);
  return true;
};

// Mock module insights
export const getModuleInsights = async (moduleName: string) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.moduleInsights(moduleName), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  const insights = {
    'demand-planning': [
      'AI forecasts indicate a 15% increase in demand for Q1 2024.',
      'Supply chain disruptions may impact raw material availability.',
      'Optimize production schedule to meet anticipated demand.'
    ],
    'supply-planning': [
      'Raw material prices are expected to increase by 10% in the next quarter.',
      'Negotiate long-term contracts with suppliers to mitigate price volatility.',
      'Explore alternative sourcing options to reduce costs.'
    ],
    'order-promising': [
      'AI predicts a 5% increase in on-time delivery performance.',
      'Optimize order promising process to improve customer satisfaction.',
      'Implement real-time order tracking to enhance visibility.'
    ],
    'factory-planning': [
      'AI analysis suggests a 20% improvement in production efficiency.',
      'Optimize machine utilization to reduce downtime.',
      'Implement predictive maintenance to prevent equipment failures.'
    ],
    'inventory-optimization': [
      'AI recommends reducing inventory levels by 10% to free up working capital.',
      'Optimize inventory management to minimize storage costs.',
      'Implement a just-in-time inventory system to reduce waste.'
    ],
    'inventory-liquidation': [
      'AI identifies $1 million in excess inventory that can be liquidated.',
      'Develop a liquidation strategy to recover value from obsolete inventory.',
      'Offer discounts and promotions to accelerate inventory turnover.'
    ],
    'logistics': [
      'AI suggests optimizing transportation routes to reduce shipping costs by 15%.',
      'Consolidate shipments to improve efficiency.',
      'Negotiate better rates with carriers to lower transportation expenses.'
    ],
    'risk-management': [
      'AI predicts a 20% increase in the likelihood of supply chain disruptions.',
      'Develop a risk mitigation plan to address potential disruptions.',
      'Diversify sourcing options to reduce reliance on single suppliers.'
    ],
    'analytics': [
      'AI analysis reveals a 10% increase in customer satisfaction.',
      'Track key performance indicators to monitor progress.',
      'Implement a data-driven decision-making process to improve performance.'
    ]
  };
  
  return insights[moduleName as keyof typeof insights] || ['No insights available for this module.'];
};

// Mock latest news
export const getLatestNews = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.latestNews, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return [
    {
      id: 1,
      title: 'Steel Prices Surge on Increased Demand',
      summary: 'Global steel prices have surged in recent weeks due to increased demand from infrastructure projects and automotive manufacturing.',
      source: 'Steel Industry News',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Market Analysis',
      content: 'Global steel prices have surged in recent weeks due to increased demand from infrastructure projects and automotive manufacturing. This unexpected rise has led to supply chain challenges for many manufacturers. Industry experts predict this trend may continue into the next quarter as global construction projects increase.'
    },
    {
      id: 2,
      title: 'New Technology Reduces Energy Consumption in Steel Production',
      summary: 'A new technology developed by a leading steel manufacturer promises to reduce energy consumption in steel production by up to 20%.',
      source: 'Tech News Daily',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Technology',
      content: 'A new technology developed by a leading steel manufacturer promises to reduce energy consumption in steel production by up to 20%. This breakthrough utilizes advanced heat recovery systems and optimized furnace designs. Early adopters have reported significant cost savings alongside reduced carbon emissions, marking a major step forward in sustainable steel manufacturing.'
    },
    {
      id: 3,
      title: 'Sustainability Initiatives Gain Traction in the Steel Industry',
      summary: 'More steel companies are adopting sustainability initiatives to reduce their environmental impact and meet growing customer demand for green steel.',
      source: 'Green Business Journal',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Sustainability',
      content: 'More steel companies are adopting sustainability initiatives to reduce their environmental impact and meet growing customer demand for green steel. From carbon capture technologies to renewable energy investments, the industry is transforming rapidly. Companies leading this green revolution are seeing increased market share as environmentally conscious customers prioritize sustainable materials.'
    },
    {
      id: 4,
      title: 'Logistics Disruptions Impact Steel Supply Chains',
      summary: 'Ongoing logistics disruptions are impacting steel supply chains, leading to delays and increased costs for manufacturers.',
      source: 'Supply Chain News',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Logistics',
      content: 'Ongoing logistics disruptions are impacting steel supply chains, leading to delays and increased costs for manufacturers. Port congestion, container shortages, and rising fuel prices continue to create bottlenecks worldwide. Industry leaders are implementing advanced logistics planning tools and diversifying transportation methods to mitigate these challenges.'
    },
    {
      id: 5,
      title: 'Innovation in Steel Manufacturing',
      summary: 'New approaches to steel manufacturing are paving the way for stronger and more sustainable materials.',
      source: 'Manufacturing Today',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Innovation',
      content: 'New approaches to steel manufacturing are paving the way for stronger and more sustainable materials. Recent innovations include ultra-high-strength steel alloys and advanced coating technologies that significantly extend product lifespans. These developments are opening new markets in aerospace, automotive, and construction industries where weight reduction and durability are critical factors.'
    }
  ];
};

// Function to get AI insights
export const getAiInsights = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.aiInsights, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return [
    {
      id: 1,
      type: 'alert',
      message: 'Energy consumption in Plant B exceeds target by 15%',
      timestamp: faker.date.recent().toLocaleTimeString()
    },
    {
      id: 2,
      type: 'success',
      message: 'Production efficiency improved by 7% this week',
      timestamp: faker.date.recent().toLocaleTimeString()
    },
    {
      id: 3,
      type: 'opportunity',
      message: 'Potential 5% cost reduction through supplier consolidation',
      timestamp: faker.date.recent().toLocaleTimeString()
    },
    {
      id: 4,
      type: 'suggestion',
      message: 'Consider increasing inventory of raw material X due to predicted shortage',
      timestamp: faker.date.recent().toLocaleTimeString()
    }
  ];
};

// Function to get production data
export const getProductionData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.productionData, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i+1}`,
    value: faker.number.int({ min: 2000, max: 5000 })
  }));
};

// Function to get energy consumption data
export const getEnergyConsumptionData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.energyData, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i+1}`,
    value: faker.number.int({ min: 500, max: 1500 })
  }));
};

// Function to get KPI data
export const getKpiData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.kpis, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    productionYield: {
      value: '94.8%',
      change: 2.3
    },
    energyConsumption: {
      value: '1,235 MWh',
      change: -5.7
    },
    qualityRating: {
      value: 'A+',
      change: 1.2
    },
    onTimeDelivery: {
      value: '92.3%',
      change: -0.8
    }
  };
};

// Function to get Agent by ID
export const getAgentById = async (agentId: number) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(AGENTS_ENDPOINTS.details(agentId), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  // First check user's deployed agents
  const userAgent = userAgents.find(a => a.id === agentId);
  if (userAgent) {
    return {...userAgent};
  }
  
  // If not found, check available agents
  const availableAgent = allAvailableAgents.find(a => a.id === agentId);
  return availableAgent ? {...availableAgent} : null;
};

// Function to get agent analytics
export const getAgentAnalytics = async (agentId: number) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(AGENTS_ENDPOINTS.analytics(agentId), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    issuesResolved: faker.number.int({ min: 20, max: 150 }),
    avgResponseTime: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
    userSatisfaction: faker.number.int({ min: 70, max: 99 }),
    conversationsCompleted: faker.number.int({ min: 50, max: 500 })
  };
};

// Function to get agent recommendations
export const getAgentRecommendations = async (agentId: number) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(AGENTS_ENDPOINTS.recommendations(agentId), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return [
    {
      id: 1,
      title: 'Optimize Production Schedule',
      description: 'Adjust production schedule to reduce downtime during shift changes',
      impact: 'High',
      category: 'Efficiency'
    },
    {
      id: 2,
      title: 'Energy Efficiency',
      description: 'Replace outdated equipment in Zone 3 to reduce energy consumption',
      impact: 'Medium',
      category: 'Sustainability'
    },
    {
      id: 3,
      title: 'Supply Chain Risk',
      description: 'Diversify suppliers for critical raw materials to mitigate supply chain disruptions',
      impact: 'High',
      category: 'Risk Management'
    }
  ];
};

// Function to create custom agent
export const createCustomAgent = async (agentData: any) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.post(AGENTS_ENDPOINTS.createCustom, agentData, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  const newAgent = {
    id: 500 + userAgents.length,
    name: agentData.name,
    description: agentData.description,
    status: 'learning' as 'active' | 'learning' | 'inactive',
    icon: agentData.icon || 'bot',
    confidence: agentData.confidence || 75,
    compatibility: 'medium',
    type: agentData.type || 'custom',
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  userAgents.push(newAgent);
  
  return newAgent;
};

// Function to get KPI detail data
export const getKpiDetailData = async (kpiId: string) => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.kpiDetail(kpiId), {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  // Mock data based on the KPI ID
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

// Function to get production detail data
export const getProductionDetailData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.productionData + '/details', {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
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

// Function to get energy detail data
export const getEnergyDetailData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.energyData + '/details', {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
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

// Function to get co-pilot analytics
export const getCoPilotAnalytics = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(DATA_ENDPOINTS.coPilotAnalytics, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    modelsAnalyzed: faker.number.int({ min: 12, max: 50 }),
    dataPointsProcessed: faker.number.int({ min: 10000, max: 100000 }),
    predictionsGenerated: faker.number.int({ min: 150, max: 1200 }),
    aiInteractions: faker.number.int({ min: 350, max: 1200 }),
    insightsGenerated: faker.number.int({ min: 120, max: 450 }),
    decisionsAided: faker.number.int({ min: 40, max: 150 }),
    costSavings: faker.number.float({ min: 150000, max: 500000, fractionDigits: 0 }),
    timeReduction: faker.number.float({ min: 15, max: 40, fractionDigits: 1 }),
    predictiveAccuracy: faker.number.float({ min: 82, max: 98, fractionDigits: 1 }),
    anomaliesDetected: faker.number.int({ min: 10, max: 50 }),
    topQueryCategories: [
      { name: 'Demand Forecasting', value: faker.number.int({ min: 20, max: 40 }) },
      { name: 'Inventory Levels', value: faker.number.int({ min: 15, max: 35 }) },
      { name: 'Production Scheduling', value: faker.number.int({ min: 10, max: 30 }) },
      { name: 'Supply Chain Risks', value: faker.number.int({ min: 5, max: 25 }) },
      { name: 'Cost Optimization', value: faker.number.int({ min: 5, max: 20 }) }
    ],
    userFeedback: {
      positive: faker.number.int({ min: 50, max: 90 }),
      neutral: faker.number.int({ min: 5, max: 30 }),
      negative: faker.number.int({ min: 1, max: 10 })
    },
    popularModules: [
      { name: 'Supply Planning', usage: faker.number.int({ min: 100, max: 300 }) },
      { name: 'Demand Planning', usage: faker.number.int({ min: 80, max: 250 }) },
      { name: 'Inventory Optimization', usage: faker.number.int({ min: 50, max: 200 }) },
      { name: 'Risk Management', usage: faker.number.int({ min: 40, max: 150 }) },
      { name: 'Analytics', usage: faker.number.int({ min: 30, max: 100 }) }
    ]
  };
};

// Risk management specific data
export const getRiskAssessmentData = async () => {
  await apiDelay();
  
  // BACKEND INTEGRATION:
  // return axios.get(RISK_ENDPOINTS.riskAssessment, {
  //   headers: {
  //     ...API_CONFIG.headers,
  //     ...API_CONFIG.headers.getAuthHeader()
  //   }
  // }).then(response => response.data);
  
  return {
    overallRiskScore: faker.number.int({ min: 50, max: 85 }),
    riskCategories: [
      { name: 'Supply Chain Disruption', score: faker.number.int({ min: 40, max: 90 }) },
      { name: 'Demand Volatility', score: faker.number.int({ min: 30, max: 80 }) },
      { name: 'Regulatory Compliance', score: faker.number.int({ min: 60, max: 95 }) },
      { name: 'Environmental Factors', score: faker.number.int({ min: 50, max: 85 }) },
      { name: 'Geopolitical Events', score: faker.number.int({ min: 40, max: 75 }) }
    ],
    keyRisks: [
      {
        id: 1,
        title: 'Raw Material Shortage',
        impact: 'High',
        probability: 'Medium',
        category: 'Supply Chain',
        mitigation: 'Diversify supplier base and increase safety stock levels'
      },
      {
        id: 2,
        title: 'Energy Price Fluctuation',
        impact: 'Medium',
        probability: 'High',
        category: 'Operational',
        mitigation: 'Implement energy efficiency measures and consider hedging'
      },
      {
        id: 3,
        title: 'New Carbon Regulations',
        impact: 'High',
        probability: 'Medium',
        category: 'Regulatory',
        mitigation: 'Accelerate sustainability initiatives and improve carbon tracking'
      }
    ],
    riskTrends: Array(6).fill(0).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      score: 40 + Math.random() * 40
    }))
  };
};

// Update auth service to use the new API config
export const updateAuthService = () => {
  // This function would be called to apply the API configuration to the auth service
  console.log("Auth service updated to use centralized API configuration");
  return true;
};
