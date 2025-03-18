
// Data Service for EY Steel Co-Pilot

import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL in production

// Generic fetch function with error handling
async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    
    // In development mode, use mocked data
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mocked data for development');
      return getMockData(endpoint) as T;
    }
    
    throw error;
  }
}

// Mock data for development
function getMockData(endpoint: string): any {
  // KPI Dashboard data
  if (endpoint.includes('/kpi')) {
    return {
      productionYield: { value: '94.8%', change: 2.3 },
      energyConsumption: { value: '1,235 MWh', change: -5.7 },
      qualityRating: { value: 'A+', change: 1.2 },
      onTimeDelivery: { value: '92.3%', change: -0.8 }
    };
  }
  
  // Production data
  if (endpoint.includes('/production-data')) {
    return [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 },
      { name: 'Jul', value: 3490 },
    ];
  }
  
  // Energy data
  if (endpoint.includes('/energy-data')) {
    return [
      { name: 'Jan', value: 2400 },
      { name: 'Feb', value: 1398 },
      { name: 'Mar', value: 9800 },
      { name: 'Apr', value: 3908 },
      { name: 'May', value: 4800 },
      { name: 'Jun', value: 3800 },
      { name: 'Jul', value: 4300 },
    ];
  }
  
  // AI Insights
  if (endpoint.includes('/ai-insights')) {
    return [
      {
        id: 1,
        type: 'alert',
        message: 'Blast furnace #3 showing abnormal temperature fluctuations. Maintenance recommended.',
        timestamp: '3 hours ago'
      },
      {
        id: 2,
        type: 'suggestion',
        message: 'Energy efficiency could be improved by 12% by optimizing production scheduling.',
        timestamp: '5 hours ago'
      },
      {
        id: 3,
        type: 'opportunity',
        message: 'Detected increased demand pattern for high-grade steel in automotive sector.',
        timestamp: '8 hours ago'
      },
      {
        id: 4,
        type: 'success',
        message: 'Quality metrics for stainless steel production have improved by 8% this month.',
        timestamp: '1 day ago'
      },
    ];
  }
  
  // Module-specific insights
  if (endpoint.includes('/module-insights')) {
    const module = endpoint.split('/').pop();
    return generateModuleInsights(module || '');
  }
  
  return { error: 'No mock data available for this endpoint' };
}

// Generate insights for specific modules
function generateModuleInsights(moduleName: string): { id: number; text: string }[] {
  const insights = {
    'demand-planning': [
      { id: 1, text: 'AI prediction: Automotive sector steel demand expected to increase by 8.2% in Q3 based on production schedules' },
      { id: 2, text: 'Machine learning analysis shows construction steel demand follows seasonal pattern with 12% variation' },
      { id: 3, text: 'Generative AI has identified export opportunities for specialty steels in Southeast Asian markets' },
    ],
    'supply-planning': [
      { id: 1, text: 'Neural network forecast: Iron ore prices projected to rise 5% in next month based on shipping data' },
      { id: 2, text: 'AI supplier analysis has identified alternative vendor for manganese with 3% cost saving potential' },
      { id: 3, text: 'Carbon credits needed for Q3 steel manufacturing estimated at 12,000 tons by our predictive model' },
    ],
    'factory-planning': [
      { id: 1, text: 'AI performance analytics: Blast furnace #2 efficiency improved 3.1% after recent maintenance' },
      { id: 2, text: 'ML shift scheduling optimization can reduce overtime by 8% while maintaining production targets' },
      { id: 3, text: 'Anomaly detection showing unusual energy usage pattern in rolling mill #3, investigation recommended' },
    ],
    // Add more module-specific insights here
  };
  
  return insights[moduleName as keyof typeof insights] || [
    { id: 1, text: 'AI analysis complete. Multiple optimization opportunities identified for this module.' },
    { id: 2, text: 'Machine learning prediction suggests potential efficiency improvements in your processes.' },
    { id: 3, text: 'Generative AI recommends reviewing current parameters based on historical performance data.' },
  ];
}

// ---- API Functions ----

// Get KPI data
export const getKpiData = async () => {
  return fetchData<any>('/kpi');
};

// Get production data
export const getProductionData = async () => {
  return fetchData<any[]>('/production-data');
};

// Get energy consumption data
export const getEnergyConsumptionData = async () => {
  return fetchData<any[]>('/energy-data');
};

// Get AI insights
export const getAiInsights = async () => {
  return fetchData<any[]>('/ai-insights');
};

// Get module-specific insights
export const getModuleInsights = async (moduleName: string) => {
  return fetchData<any[]>(`/module-insights/${moduleName}`);
};

// Submit data to the API
export const submitData = async (endpoint: string, data: any) => {
  try {
    const response = await fetchData(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    toast({
      title: 'Success',
      description: 'Data submitted successfully',
    });
    
    return response;
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to submit data',
    });
    throw error;
  }
};

export default {
  getKpiData,
  getProductionData,
  getEnergyConsumptionData,
  getAiInsights,
  getModuleInsights,
  submitData
};
