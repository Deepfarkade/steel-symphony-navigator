
import { useState, useEffect } from 'react';
import { generateModuleInsights } from '../services/aiService';

export interface ModuleInsight {
  id: number;
  text: string;
}

export const useModuleInsights = (moduleName: string) => {
  const [insights, setInsights] = useState<ModuleInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching AI-generated insights for ${moduleName} module...`);
        
        // Simulate AI model loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const insightTexts = await generateModuleInsights(moduleName);
        
        const formattedInsights: ModuleInsight[] = insightTexts.map((text, index) => ({
          id: index + 1,
          text
        }));
        
        console.log(`Successfully generated ${formattedInsights.length} AI insights for ${moduleName}`);
        setInsights(formattedInsights);
        setError(null);
      } catch (err) {
        console.error('Error in AI model when fetching module insights:', err);
        setError('The AI model encountered an error while processing your data. Please try again later.');
        setInsights([{
          id: 0,
          text: 'AI model temporarily unavailable. Our system will automatically retry analysis shortly.'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [moduleName]);

  return { insights, isLoading, error };
};
