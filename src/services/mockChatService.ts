
// Mock responses for when backend is unavailable

const tableData = {
  'order-promising': `
| Order ID | Product  | Quantity | Current Status | Promised Date | Probability |
|----------|----------|----------|----------------|---------------|-------------|
| OR-10234 | Steel-X  | 500 tons | In Production  | 2025-04-15    | 92%         |
| OR-10235 | Alloy-Z  | 300 tons | Pending        | 2025-04-20    | 85%         |
| OR-10236 | Carbon-S | 700 tons | Scheduled      | 2025-05-01    | 78%         |
| OR-10237 | Steel-Y  | 250 tons | Ready          | 2025-04-10    | 98%         |
  `,
  'demand-planning': `
| Product     | Current Demand | Forecasted Demand | Growth Rate | Confidence |
|-------------|---------------|-------------------|-------------|------------|
| Steel Pipes | 1,200 tons    | 1,450 tons        | +20.8%      | High       |
| Steel Beams | 3,500 tons    | 3,850 tons        | +10.0%      | Medium     |
| Steel Coils | 5,200 tons    | 5,720 tons        | +10.0%      | High       |
| Steel Rods  | 980 tons      | 1,078 tons        | +10.0%      | Medium     |
  `,
  'supply-planning': `
| Supplier     | Material     | Capacity | Lead Time | Risk Level | Cost     |
|--------------|--------------|----------|-----------|------------|----------|
| SteelCorp    | Raw Iron     | 2,000t   | 14 days   | Low        | $450/ton |
| MetalWorks   | Scrap Metal  | 800t     | 7 days    | Medium     | $320/ton |
| AlloyTech    | Nickel       | 300t     | 21 days   | High       | $890/ton |
| IronFoundry  | Pig Iron     | 1,500t   | 10 days   | Low        | $380/ton |
  `,
  'factory-planning': `
| Production Line | Capacity | Utilization | Maintenance | Efficiency | Output Quality |
|-----------------|----------|-------------|-------------|------------|---------------|
| Line A          | 500t/day | 87%         | Apr 15-17   | 92%        | High          |
| Line B          | 450t/day | 92%         | May 20-22   | 88%        | Medium        |
| Line C          | 600t/day | 75%         | Apr 10-12   | 95%        | High          |
| Line D          | 350t/day | 81%         | Jun 05-07   | 90%        | Medium        |
  `,
};

const summaries = {
  'order-promising': "Based on the order data, most of your current orders are on track with high delivery probability. Order OR-10237 for Steel-Y is already ready for shipping and has the highest probability at 98%. The order for Carbon-S (OR-10236) has the longest lead time with delivery expected by May 1st and a slightly lower probability of 78%. I recommend prioritizing order processing for OR-10235 as it's still in pending status.",
  'demand-planning': "The demand forecast shows positive growth across all steel products, with Steel Pipes expected to see the highest growth rate at 20.8%. Overall, the average growth rate is approximately 12.7% across your product portfolio. Steel Coils represent your highest volume product and are expected to maintain strong growth with high confidence. I recommend focusing on increasing capacity for Steel Pipes production to meet the significant projected demand increase.",
  'supply-planning': "Your supply chain analysis indicates that AlloyTech presents the highest risk with the longest lead time (21 days) and highest cost ($890/ton) for Nickel. MetalWorks offers the fastest delivery at 7 days for Scrap Metal. SteelCorp and IronFoundry are your most reliable suppliers with low risk assessments. I recommend diversifying your Nickel supply sources to mitigate the high risk and potentially negotiate better terms with AlloyTech.",
  'factory-planning': "Factory performance data shows Line C has the highest efficiency (95%) but is underutilized at only 75% capacity. Line B is your most utilized line at 92% but has slightly lower efficiency. Line A and Line C both produce high-quality output. I recommend increasing utilization of Line C to capitalize on its superior efficiency and output quality, while scheduling an earlier maintenance for Line B to address its efficiency challenges."
};

const genericResponses = [
  "I'm analyzing your request about steel operations. Let me provide you with some insights.",
  "Based on the current market trends, steel demand is expected to grow by 3.8% this year.",
  "Your question touches on several aspects of steel manufacturing. Let me break this down for you.",
  "Let me help you understand how this affects your steel supply chain planning.",
];

/**
 * Provides a mock response based on user input and module context
 */
export const getMockResponse = (userInput: string, moduleContext?: string): string => {
  const normalizedModule = moduleContext?.toLowerCase();
  
  // If the user's message contains a question about data, reports, or analysis
  if (userInput.toLowerCase().includes('data') || 
      userInput.toLowerCase().includes('report') || 
      userInput.toLowerCase().includes('analysis') ||
      userInput.toLowerCase().includes('show') ||
      userInput.toLowerCase().includes('analyze') ||
      userInput.toLowerCase().includes('tell me')) {
    
    // Return module-specific table and summary
    if (normalizedModule && tableData[normalizedModule as keyof typeof tableData]) {
      return tableData[normalizedModule as keyof typeof tableData] + 
             "\n\n" + 
             summaries[normalizedModule as keyof typeof summaries];
    }
    
    // Generic table response for unknown modules
    return `
| Category | Current | Target | Variance | Status |
|----------|---------|--------|----------|--------|
| Production | 1,500 tons | 1,650 tons | -150 tons | At Risk |
| Quality | 98.2% | 99.0% | -0.8% | On Track |
| Efficiency | 87.5% | 90.0% | -2.5% | At Risk |
| Delivery | 96.4% | 95.0% | +1.4% | Exceeding |

Based on this analysis, your production volume and efficiency are currently below target and flagged as at risk. Quality is on track despite being slightly below target. Your delivery performance is exceeding expectations. I recommend focusing improvements on production capacity and operational efficiency to meet your targets for this quarter.`;
  }
  
  // For general questions
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
};
