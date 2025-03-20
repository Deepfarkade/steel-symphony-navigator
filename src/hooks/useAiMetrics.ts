
import { useMemo } from 'react';

interface AiMetrics {
  accuracy: string;
  confidence: string;
  optimization: string;
  patternRecognition: number;
  anomalyDetection: number;
  predictivePower: number;
}

export const useAiMetrics = (module: string): AiMetrics => {
  const metrics = useMemo(() => {
    const metricsByModule: Record<string, AiMetrics> = {
      'demand-planning': {
        accuracy: '94.3%',
        confidence: '97.1%',
        optimization: '86.5%',
        patternRecognition: 85,
        anomalyDetection: 90,
        predictivePower: 78
      },
      'supply-planning': {
        accuracy: '91.7%',
        confidence: '93.4%',
        optimization: '89.2%',
        patternRecognition: 82,
        anomalyDetection: 88,
        predictivePower: 85
      },
      'order-promising': {
        accuracy: '96.2%',
        confidence: '95.8%',
        optimization: '82.1%',
        patternRecognition: 89,
        anomalyDetection: 86,
        predictivePower: 79
      },
      'factory-planning': {
        accuracy: '93.5%',
        confidence: '96.2%',
        optimization: '90.3%',
        patternRecognition: 86,
        anomalyDetection: 92,
        predictivePower: 83
      },
      'inventory-optimization': {
        accuracy: '95.1%',
        confidence: '92.7%',
        optimization: '93.4%',
        patternRecognition: 90,
        anomalyDetection: 88,
        predictivePower: 91
      },
      'inventory-liquidation': {
        accuracy: '89.8%',
        confidence: '91.3%',
        optimization: '87.6%',
        patternRecognition: 82,
        anomalyDetection: 85,
        predictivePower: 80
      },
      'logistics': {
        accuracy: '92.9%',
        confidence: '94.7%',
        optimization: '88.3%',
        patternRecognition: 87,
        anomalyDetection: 89,
        predictivePower: 84
      },
      'risk-management': {
        accuracy: '97.2%',
        confidence: '98.1%',
        optimization: '85.9%',
        patternRecognition: 91,
        anomalyDetection: 94,
        predictivePower: 89
      },
      'analytics': {
        accuracy: '98.5%',
        confidence: '97.6%',
        optimization: '91.2%',
        patternRecognition: 93,
        anomalyDetection: 95,
        predictivePower: 92
      }
    };

    // Return metrics for the specified module, or default metrics if not found
    return metricsByModule[module] ?? {
      accuracy: '93.8%',
      confidence: '94.5%',
      optimization: '88.7%',
      patternRecognition: 87,
      anomalyDetection: 89,
      predictivePower: 85
    };
  }, [module]);

  return metrics;
};
