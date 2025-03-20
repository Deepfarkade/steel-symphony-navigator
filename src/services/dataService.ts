import { faker } from '@faker-js/faker';

// Helper function for simulating API delay
const apiDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

// Mock KPI data
export const getKpis = async () => {
  await apiDelay();
  
  return [
    {
      id: 1,
      title: 'Production Volume',
      value: faker.number.int({ min: 1000, max: 5000 }),
      trend: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
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
      trend: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
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
      trend: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
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
      trend: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
      target: faker.number.int({ min: 50, max: 200 }),
      status: 'good',
      description: 'Tons of material wasted in production',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.int({ min: 100, max: 500 }))
    },
    {
      id: 5,
      title: 'Order Fulfillment Rate',
      value: faker.number.float({ min: 80, max: 100, precision: 0.1 }),
      trend: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
      target: 95,
      status: 'good',
      description: 'Percentage of orders fulfilled on time',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.float({ min: 80, max: 100, precision: 0.1 }))
    },
    {
      id: 6,
      title: 'Customer Satisfaction',
      value: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      trend: faker.number.float({ min: -5, max: 10, precision: 0.1 }),
      target: 4.5,
      status: 'warning',
      description: 'Average customer satisfaction rating',
      lastUpdated: faker.date.recent().toLocaleDateString(),
      chartData: Array.from({ length: 7 }, () => faker.number.float({ min: 1, max: 5, precision: 0.1 }))
    }
  ];
};

// Mock notification data
export const getNotifications = async () => {
  await apiDelay();
  
  return [
    {
      id: 1,
      type: 'alert',
      message: 'High energy consumption detected in furnace #3',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'unread'
    },
    {
      id: 2,
      type: 'info',
      message: 'New maintenance schedule available for rolling mill',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'read'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Downtime incident reported in casting line',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'unread'
    },
    {
      id: 4,
      type: 'success',
      message: 'Production target met for hot-rolled coil',
      timestamp: faker.date.recent().toLocaleTimeString(),
      status: 'read'
    }
  ];
};

// Mock chart data
export const getProductionChartData = async () => {
  await apiDelay();
  
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

// Mock AI agent data
let userAgents = [
  {
    id: 101,
    name: 'Supply Chain Optimizer',
    description: 'Continuously analyzes your supply chain for efficiency improvements',
    status: 'active',
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
    status: 'active',
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
    status: 'learning',
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
    status: 'active',
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
    status: 'active',
    icon: 'alert-triangle',
    confidence: 89,
    compatibility: 'medium',
    type: 'strategic',
    lastUpdated: '2023-10-15'
  },
  {
    id: 401,
    name: 'What-If Scenarios Analyzer',
    description: 'Runs simulations on different business scenarios to provide insights on potential outcomes',
    status: 'active',
    icon: 'lightbulb',
    confidence: 92,
    compatibility: 'high',
    type: 'strategic',
    lastUpdated: '2023-11-10'
  }
];

// Mock available agents
export const getAvailableAgents = async () => {
  await apiDelay();
  
  return [
    {
      id: 401,
      name: 'What-If Scenarios Analyzer',
      description: 'Runs simulations on different business scenarios to provide insights on potential outcomes',
      status: 'active',
      icon: 'lightbulb',
      confidence: 92,
      compatibility: 'high',
      type: 'strategic',
      lastUpdated: '2023-11-10'
    },
    {
      id: 402,
      name: 'Predictive Maintenance AI',
      description: 'Predicts equipment failures and optimizes maintenance schedules',
      status: 'active',
      icon: 'tool',
      confidence: 88,
      compatibility: 'high',
      type: 'operational',
      lastUpdated: '2023-11-15'
    },
    {
      id: 403,
      name: 'Logistics Optimization AI',
      description: 'Optimizes logistics and transportation routes for cost savings',
      status: 'active',
      icon: 'truck',
      confidence: 91,
      compatibility: 'high',
      type: 'operational',
      lastUpdated: '2023-11-20'
    },
    {
      id: 404,
      name: 'Demand Forecasting AI',
      description: 'Predicts future demand for steel products',
      status: 'active',
      icon: 'bar-chart-2',
      confidence: 93,
      compatibility: 'high',
      type: 'analytical',
      lastUpdated: '2023-11-25'
    },
    {
      id: 405,
      name: 'Risk Management AI',
      description: 'Identifies and assesses potential risks in the steel manufacturing process',
      status: 'active',
      icon: 'alert-triangle',
      confidence: 89,
      compatibility: 'high',
      type: 'strategic',
      lastUpdated: '2023-11-30'
    }
  ];
};

// Function to get AI agents for the current user
export const getAiAgents = async () => {
  await apiDelay();
  return userAgents;
};

// Function to add an AI agent to the current user
export const addAgentToUser = async (agentId: number) => {
  await apiDelay();
  
  const agentToAdd = getAvailableAgents().then(agents => agents.find(agent => agent.id === agentId));
  
  if (agentToAdd) {
    userAgents.push(await agentToAdd);
    return true;
  }
  
  return false;
};

// Function to remove an AI agent from the current user
export const removeAgentFromUser = async (agentId: number) => {
  await apiDelay();
  
  userAgents = userAgents.filter(agent => agent.id !== agentId);
  return true;
};

// Mock module insights
export const getModuleInsights = async (moduleName: string) => {
  await apiDelay();
  
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
  
  return insights[moduleName] || ['No insights available for this module.'];
};

// Mock latest news
export const getLatestNews = async () => {
  await apiDelay();
  
  return [
    {
      id: 1,
      title: 'Steel Prices Surge on Increased Demand',
      summary: 'Global steel prices have surged in recent weeks due to increased demand from infrastructure projects and automotive manufacturing.',
      source: 'Steel Industry News',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Market Analysis'
    },
    {
      id: 2,
      title: 'New Technology Reduces Energy Consumption in Steel Production',
      summary: 'A new technology developed by a leading steel manufacturer promises to reduce energy consumption in steel production by up to 20%.',
      source: 'Tech News Daily',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Technology'
    },
    {
      id: 3,
      title: 'Sustainability Initiatives Gain Traction in the Steel Industry',
      summary: 'More steel companies are adopting sustainability initiatives to reduce their environmental impact and meet growing customer demand for green steel.',
      source: 'Green Business Journal',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Sustainability'
    },
    {
      id: 4,
      title: 'Logistics Disruptions Impact Steel Supply Chains',
      summary: 'Ongoing logistics disruptions are impacting steel supply chains, leading to delays and increased costs for manufacturers.',
      source: 'Supply Chain News',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Logistics'
    },
    {
      id: 5,
      title: 'Innovation in Steel Manufacturing',
      summary: 'New approaches to steel manufacturing are paving the way for stronger and more sustainable materials.',
      source: 'Manufacturing Today',
      date: faker.date.recent().toLocaleDateString(),
      category: 'Innovation'
    }
  ];
};

export const getCoPilotAnalytics = async () => {
  await apiDelay();
  
  return {
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

// Ensure we have a What-If Scenarios agent in the available agents
export const getAvailableAgents = async () => {
  await apiDelay();
  
  return [
    {
      id: 401,
      name: 'What-If Scenarios Analyzer',
      description: 'Runs simulations on different business scenarios to provide insights on potential outcomes',
      status: 'active',
      icon: 'lightbulb',
      confidence: 92,
      compatibility: 'high',
      type: 'strategic',
      lastUpdated: '2023-11-10'
    },
    {
      id: 402,
      name: 'Predictive Maintenance AI',
      description: 'Predicts equipment failures and optimizes maintenance schedules',
      status: 'active',
      icon: 'tool',
      confidence: 88,
      compatibility: 'high',
      type: 'operational',
      lastUpdated: '2023-11-15'
    },
    {
      id: 403,
      name: 'Logistics Optimization AI',
      description: 'Optimizes logistics and transportation routes for cost savings',
      status: 'active',
      icon: 'truck',
      confidence: 91,
      compatibility: 'high',
      type: 'operational',
      lastUpdated: '2023-11-20'
    },
    {
      id: 404,
      name: 'Demand Forecasting AI',
      description: 'Predicts future demand for steel products',
      status: 'active',
      icon: 'bar-chart-2',
      confidence: 93,
      compatibility: 'high',
      type: 'analytical',
      lastUpdated: '2023-11-25'
    },
    {
      id: 405,
      name: 'Risk Management AI',
      description: 'Identifies and assesses potential risks in the steel manufacturing process',
      status: 'active',
      icon: 'alert-triangle',
      confidence: 89,
      compatibility: 'high',
      type: 'strategic',
      lastUpdated: '2023-11-30'
    }
  ];
};
