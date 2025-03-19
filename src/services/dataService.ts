
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
