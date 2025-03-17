
// AI Service for handling all AI-related functionality across modules

interface AIResponse {
  text: string;
  confidence: number;
}

// Mock AI service that simulates AI responses
export const generateAIResponse = async (prompt: string, context?: string): Promise<AIResponse> => {
  console.log(`AI prompt received: ${prompt}`);
  console.log(`Context: ${context || 'No context provided'}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Map of prompts to responses for simulation
  const responses: Record<string, string> = {
    'demand forecast': 'Based on historical data and current market trends, I predict a 7.2% increase in demand for automotive-grade steel over the next quarter.',
    'supply chain': 'Analysis shows potential disruption in coal supply from Australia. Consider alternative sources or increased stockpiling.',
    'order optimization': 'Optimizing current orders by steel grade can improve production efficiency by 5.3% and reduce lead times by 2.1 days.',
    'factory planning': 'Blast furnace maintenance can be optimized by scheduling during projected low-demand periods in August.',
    'inventory': 'Current inventory levels of high-carbon steel are 15% above optimal. Consider promotional pricing to reduce excess stock.',
    'logistics': 'Consolidating shipments to the Midwest region can save approximately $42,000 in transport costs next month.',
    'risk assessment': 'Rising energy costs present a significant risk to Q3 profitability. Consider hedging energy futures.',
  };
  
  // Default response if no match is found
  let responseText = 'I\'ve analyzed the data and found potential opportunities for optimization in your steel operations.';
  
  // Check for keywords in the prompt
  Object.keys(responses).forEach(key => {
    if (prompt.toLowerCase().includes(key)) {
      responseText = responses[key];
    }
  });
  
  return {
    text: responseText,
    confidence: 0.87 + Math.random() * 0.1, // Simulate confidence score between 0.87 and 0.97
  };
};

// Generate insights for specific modules
export const generateModuleInsights = async (moduleName: string): Promise<string[]> => {
  console.log(`Generating insights for module: ${moduleName}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const moduleInsights: Record<string, string[]> = {
    'demand-planning': [
      'Automotive sector demand expected to increase by 8.2% in Q3',
      'Construction steel demand shows seasonal pattern with 12% variation',
      'Export opportunities identified in Southeast Asian markets',
    ],
    'supply-planning': [
      'Iron ore prices projected to rise 5% in next month',
      'Alternative supplier for manganese identified with 3% cost saving',
      'Carbon credits needed for Q3 manufacturing estimated at 12,000 tons',
    ],
    'order-promising': [
      'On-time delivery rate can be improved by 4.3% with buffer adjustment',
      'Priority customers experiencing 1.2 days longer lead times than target',
      'Order batching opportunity identified for Midwest customers',
    ],
    'factory-planning': [
      'Blast furnace #2 efficiency improved 3.1% after recent maintenance',
      'Shift schedule optimization can reduce overtime by 8%',
      'Energy usage per ton showing upward trend in rolling mill #3',
    ],
    'inventory-optimization': [
      'Raw material holding costs increased 6.5% year over year',
      'Safety stock levels for alloy steels can be reduced by 7%',
      'Slow-moving inventory identified in structural steel category',
    ],
    'inventory-liquidation': [
      '34 tons of specialty steel nearing quality degradation date',
      'Potential buyer identified for off-spec stainless steel inventory',
      'Price reduction of 12% estimated to move excess inventory within 30 days',
    ],
    'logistics': [
      'Rail transport delays averaging 2.3 days longer than previous quarter',
      'Alternative shipping route identified for West Coast deliveries',
      'Fuel surcharges expected to increase by 3.8% next month',
    ],
    'risk-management': [
      'Weather risks identified for Gulf Coast shipping in hurricane season',
      'Regulatory changes in emissions standards expected in Q4',
      'Currency exchange rate volatility affecting European market profitability',
    ],
    'analytics': [
      'Production yield improved 2.1% compared to previous quarter',
      'Energy consumption per ton decreased 3.5% year over year',
      'Quality incidents decreased 18% following SPC implementation',
    ],
  };
  
  // Return insights for the specified module, or default insights if module not found
  return moduleInsights[moduleName] || [
    'AI analysis complete. Optimization opportunities identified.',
    'Data patterns suggest potential for efficiency improvements.',
    'Trend analysis shows changes in market conditions worth investigating.',
  ];
};
