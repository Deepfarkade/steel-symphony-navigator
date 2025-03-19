
import axios from 'axios';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getKpis = async () => {
  // Simulate API call
  await delay(800);
  
  return [
    {
      id: '1',
      title: 'Production Volume',
      value: '182,456',
      change: '+5.8%',
      trend: 'up',
      chart: [35, 45, 42, 56, 78, 65, 80],
      module: 'factory-planning'
    },
    {
      id: '2',
      title: 'Cost per Ton',
      value: '$842',
      change: '-2.3%',
      trend: 'down',
      chart: [65, 55, 58, 45, 38, 35, 30],
      module: 'supply-planning'
    },
    {
      id: '3',
      title: 'Inventory Level',
      value: '34,281',
      change: '+0.5%',
      trend: 'flat',
      chart: [45, 48, 44, 46, 45, 47, 45],
      module: 'inventory-optimization'
    },
    {
      id: '4',
      title: 'Delivery Time',
      value: '18.3 days',
      change: '-12.5%',
      trend: 'down',
      chart: [68, 65, 58, 52, 45, 40, 35],
      module: 'logistics'
    },
    {
      id: '5',
      title: 'Order Fulfillment',
      value: '96.8%',
      change: '+1.2%',
      trend: 'up',
      chart: [88, 90, 92, 91, 94, 95, 97],
      module: 'order-promising'
    },
    {
      id: '6',
      title: 'Supplier Reliability',
      value: '92.1%',
      change: '-0.8%',
      trend: 'flat',
      chart: [94, 93, 95, 92, 93, 91, 92],
      module: 'risk-management'
    }
  ];
};

export const getAiInsights = async () => {
  // Simulate API call
  await delay(1000);
  
  return [
    {
      id: 1,
      type: 'alert',
      message: 'Potential supply chain disruption detected in Southeast Asia. Consider activating alternate suppliers for copper components.',
      timestamp: '2023-06-12T08:30:00Z'
    },
    {
      id: 2,
      type: 'opportunity',
      message: 'Price of aluminum is predicted to decrease 4% next month. Consider increasing inventory purchases.',
      timestamp: '2023-06-12T10:15:00Z'
    },
    {
      id: 3,
      type: 'suggestion',
      message: 'High inventory of product line XJ-290 detected. Consider production slowdown or promotional pricing.',
      timestamp: '2023-06-11T15:45:00Z'
    },
    {
      id: 4,
      type: 'success',
      message: 'New production schedule optimization reduced energy consumption by 7.2% while maintaining output levels.',
      timestamp: '2023-06-10T11:30:00Z'
    },
    {
      id: 5,
      type: 'alert',
      message: 'Quality control metrics showing anomalies in Factory 3, Line 2. Inspection recommended.',
      timestamp: '2023-06-09T14:20:00Z'
    }
  ];
};

export const getChartData = async (type: string) => {
  // Simulate API call
  await delay(1200);
  
  if (type === 'production') {
    return [
      { name: 'Jan', value: 4200 },
      { name: 'Feb', value: 4500 },
      { name: 'Mar', value: 4800 },
      { name: 'Apr', value: 4600 },
      { name: 'May', value: 5200 },
      { name: 'Jun', value: 5800 },
      { name: 'Jul', value: 6100 },
      { name: 'Aug', value: 5900 },
      { name: 'Sep', value: 6300 },
      { name: 'Oct', value: 6700 },
      { name: 'Nov', value: 7000 },
      { name: 'Dec', value: 6800 }
    ];
  }
  
  if (type === 'energy') {
    return [
      { name: 'Jan', value: 980 },
      { name: 'Feb', value: 1040 },
      { name: 'Mar', value: 1100 },
      { name: 'Apr', value: 1060 },
      { name: 'May', value: 1200 },
      { name: 'Jun', value: 1340 },
      { name: 'Jul', value: 1420 },
      { name: 'Aug', value: 1380 },
      { name: 'Sep', value: 1460 },
      { name: 'Oct', value: 1520 },
      { name: 'Nov', value: 1580 },
      { name: 'Dec', value: 1540 }
    ];
  }
  
  return [];
};

export const getAiAgents = async () => {
  // Simulate API call
  await delay(1500);
  
  return [
    {
      id: 1,
      name: 'Production Optimizer',
      description: 'Optimizes production schedules based on real-time data, demand forecasts, and resource availability.',
      status: 'active',
      confidence: 94,
      icon: 'factory'
    },
    {
      id: 2,
      name: 'Logistics Navigator',
      description: 'Analyzes transportation routes, weather data, and carrier performance to optimize shipping and delivery.',
      status: 'active',
      confidence: 87,
      icon: 'truck'
    },
    {
      id: 3,
      name: 'Inventory Manager',
      description: 'Monitors inventory levels and recommends optimal reorder points to minimize costs while avoiding stockouts.',
      status: 'active',
      confidence: 92,
      icon: 'bar-chart'
    },
    {
      id: 4,
      name: 'Energy Efficiency Monitor',
      description: 'Tracks energy consumption patterns and suggests optimization strategies to reduce costs and carbon footprint.',
      status: 'active',
      confidence: 89,
      icon: 'zap'
    },
    {
      id: 5,
      name: 'Quality Assurance Sentinel',
      description: 'Monitors quality control metrics to detect anomalies and predict potential issues before they affect production.',
      status: 'inactive',
      confidence: 78,
      icon: 'check-circle'
    },
    {
      id: 6,
      name: 'Risk Assessment Guardian',
      description: 'Analyzes global data sources to identify potential supply chain disruptions and suggest mitigation strategies.',
      status: 'inactive',
      confidence: 81,
      icon: 'shield'
    }
  ];
};

export const getActiveAiAgents = async () => {
  // Simulate API call
  await delay(800);
  
  // Return only active agents
  const allAgents = await getAiAgents();
  return allAgents.filter(agent => agent.status === 'active');
};

export const getModuleInsights = async (module: string) => {
  // Simulate API call
  await delay(1000);
  
  // Return insights related to the specified module
  switch(module) {
    case 'demand-planning':
      return [
        'Demand for high-strength steel increased by 12% in the automotive sector',
        'Seasonal pattern detected in construction steel demand, consider adjusting production schedule',
        'New market opportunity identified in renewable energy sector for specialized steel components'
      ];
    case 'supply-planning':
      return [
        'Iron ore supplier in Brazil reporting 2-week shipping delays due to port congestion',
        'Alternative supplier for manganese identified with competitive pricing',
        'Opportunity to consolidate orders from multiple suppliers to reduce shipping costs'
      ];
    case 'factory-planning':
      return [
        'Production Line 3 showing 7% efficiency improvement after recent maintenance',
        'Potential bottleneck identified in heat treatment process during peak production periods',
        'Energy consumption optimization opportunity during overnight shifts'
      ];
    default:
      return [
        'AI analysis suggests 5% potential efficiency improvement',
        'Market trends indicate shifting demand patterns in your sector',
        'Consider reviewing your strategy based on recent industry developments'
      ];
  }
};

export const getKpiDetailData = async (id: string) => {
  // Simulate API call
  await delay(1200);
  
  const kpis = await getKpis();
  const kpi = kpis.find(k => k.id === id);
  
  if (!kpi) {
    throw new Error('KPI not found');
  }
  
  // Extended data for KPI details page
  return {
    ...kpi,
    description: 'This KPI measures the core performance metric for steel production operations.',
    historicalData: [
      { month: 'January', value: 168250 },
      { month: 'February', value: 170100 },
      { month: 'March', value: 172800 },
      { month: 'April', value: 174500 },
      { month: 'May', value: 177200 },
      { month: 'June', value: 180000 },
      { month: 'July', value: 182456 }
    ],
    insights: [
      'Performance has improved 5.8% over the last quarter',
      'Current trajectory suggests reaching the annual target by October',
      'Outperforming industry average by approximately 3.2%'
    ],
    recommendations: [
      'Consider increasing capacity in high-performing production lines',
      'Review resource allocation to maintain positive momentum',
      'Share best practices with underperforming facilities'
    ]
  };
};

export const getProductionDetailData = async () => {
  // Simulate API call
  await delay(1500);
  
  return {
    title: 'Steel Production Output',
    description: 'Monthly production volume across all facilities',
    unit: 'tons',
    data: [
      { month: 'Jan', actual: 4200, target: 4000, previous: 3800 },
      { month: 'Feb', actual: 4500, target: 4200, previous: 4100 },
      { month: 'Mar', actual: 4800, target: 4400, previous: 4300 },
      { month: 'Apr', actual: 4600, target: 4600, previous: 4400 },
      { month: 'May', actual: 5200, target: 4800, previous: 4600 },
      { month: 'Jun', actual: 5800, target: 5000, previous: 4900 },
      { month: 'Jul', actual: 6100, target: 5200, previous: 5100 },
      { month: 'Aug', actual: 5900, target: 5400, previous: 5300 },
      { month: 'Sep', actual: 6300, target: 5600, previous: 5500 },
      { month: 'Oct', actual: 6700, target: 5800, previous: 5700 },
      { month: 'Nov', actual: 7000, target: 6000, previous: 5900 },
      { month: 'Dec', actual: 6800, target: 6200, previous: 6100 }
    ],
    insights: [
      'Production exceeded targets by 12.3% on average',
      'Highest efficiency observed in Q3, potentially due to process improvements',
      'Year-over-year growth of 17.2% compared to previous period'
    ],
    facilities: [
      { name: 'Pittsburgh Plant', contribution: 32 },
      { name: 'Cleveland Facility', contribution: 28 },
      { name: 'Detroit Operations', contribution: 24 },
      { name: 'Chicago Mill', contribution: 16 }
    ]
  };
};

export const getEnergyDetailData = async () => {
  // Simulate API call
  await delay(1500);
  
  return {
    title: 'Energy Consumption',
    description: 'Monthly energy usage across all production facilities',
    unit: 'MWh',
    data: [
      { month: 'Jan', actual: 980, target: 1000, previous: 1050 },
      { month: 'Feb', actual: 1040, target: 1020, previous: 1080 },
      { month: 'Mar', actual: 1100, target: 1040, previous: 1120 },
      { month: 'Apr', actual: 1060, target: 1060, previous: 1100 },
      { month: 'May', actual: 1200, target: 1080, previous: 1150 },
      { month: 'Jun', actual: 1340, target: 1100, previous: 1400 },
      { month: 'Jul', actual: 1420, target: 1120, previous: 1460 },
      { month: 'Aug', actual: 1380, target: 1140, previous: 1430 },
      { month: 'Sep', actual: 1460, target: 1160, previous: 1510 },
      { month: 'Oct', actual: 1520, target: 1180, previous: 1580 },
      { month: 'Nov', actual: 1580, target: 1200, previous: 1630 },
      { month: 'Dec', actual: 1540, target: 1220, previous: 1600 }
    ],
    insights: [
      'Energy consumption is 15.2% higher than targeted levels',
      'Summer months show increased energy usage due to cooling requirements',
      'Energy efficiency improved by 3.7% compared to previous year despite higher production'
    ],
    breakdown: [
      { category: 'Heating', percentage: 42 },
      { category: 'Motors & Drives', percentage: 28 },
      { category: 'Lighting', percentage: 12 },
      { category: 'Cooling', percentage: 18 }
    ]
  };
};

export const getLatestNews = async () => {
  // Simulate API call
  await delay(1000);
  
  return [
    {
      id: '1',
      title: 'Global Steel Demand Expected to Rise 4.3% in Next Quarter',
      summary: 'Industry analysts project increased demand driven by infrastructure projects and automotive sector recovery.',
      source: 'Steel Industry Journal',
      publishedAt: '2 hours ago',
      url: '#',
      imageUrl: 'https://source.unsplash.com/random/300x200/?steel,industry',
      category: 'Market Trends'
    },
    {
      id: '2',
      title: 'New Carbon Reduction Technologies Show Promise for Steel Manufacturing',
      summary: 'Breakthrough innovations could reduce carbon emissions by up to 30% while maintaining production quality and volume.',
      source: 'CleanTech Report',
      publishedAt: '5 hours ago',
      url: '#',
      imageUrl: 'https://source.unsplash.com/random/300x200/?factory,industrial',
      category: 'Technology'
    },
    {
      id: '3',
      title: 'Supply Chain Disruptions Easing for Raw Materials in Steel Production',
      summary: 'Global logistics improvements and increased mining output are normalizing supply chains after months of constraints.',
      source: 'Supply Chain Weekly',
      publishedAt: 'Yesterday',
      url: '#',
      imageUrl: 'https://source.unsplash.com/random/300x200/?logistics,shipping',
      category: 'Supply Chain'
    },
    {
      id: '4',
      title: 'EU Announces New Steel Import Regulations Starting Next Year',
      summary: 'Updated regulatory framework will introduce stricter carbon footprint requirements for imported steel products.',
      source: 'European Trade Monitor',
      publishedAt: '2 days ago',
      url: '#',
      imageUrl: 'https://source.unsplash.com/random/300x200/?europe,flag',
      category: 'Regulations'
    },
    {
      id: '5',
      title: 'Leading Steel Producer Invests $2.5B in Smart Factory Upgrades',
      summary: 'Major industry player announces comprehensive modernization plan featuring AI-driven production systems.',
      source: 'Industry Today',
      publishedAt: '3 days ago',
      url: '#',
      imageUrl: 'https://source.unsplash.com/random/300x200/?automated,factory',
      category: 'Investment'
    },
    {
      id: '6',
      title: 'Research Shows High-Strength Steel Gaining Market Share in Construction',
      summary: 'Architectural and engineering firms increasingly specify advanced steel formulations for structural applications.',
      source: 'Materials Insights',
      publishedAt: '4 days ago',
      url: '#',
      imageUrl: 'https://source.unsplash.com/random/300x200/?construction,building',
      category: 'Market Trends'
    }
  ];
};
