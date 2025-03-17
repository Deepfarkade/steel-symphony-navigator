
import { useState, useEffect } from 'react';
import { generateModuleInsights } from '../services/aiService';

interface ModuleInsight {
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
        const insightTexts = await generateModuleInsights(moduleName);
        
        const formattedInsights: ModuleInsight[] = insightTexts.map((text, index) => ({
          id: index + 1,
          text
        }));
        
        setInsights(formattedInsights);
        setError(null);
      } catch (err) {
        console.error('Error fetching module insights:', err);
        setError('Failed to load AI insights. Please try again later.');
        setInsights([{
          id: 0,
          text: 'AI insights are currently unavailable. Please check back later.'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [moduleName]);

  return { insights, isLoading, error };
};
