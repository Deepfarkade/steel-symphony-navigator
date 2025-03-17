
import React, { useState } from 'react';
import { Box, Sparkles, Loader2, ArrowRight, FileText, DollarSign } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';
import { generateAIResponse } from '../services/aiService';
import { toast } from "sonner";

const InventoryLiquidation = () => {
  const { insights, isLoading } = useModuleInsights('inventory-liquidation');
  const [showExcessInventory, setShowExcessInventory] = useState(false);
  const [generatingPricing, setGeneratingPricing] = useState(false);
  const [pricingResult, setPricingResult] = useState<null | { product: string, originalPrice: number, recommendedPrice: number, reason: string }[]>(null);
  
  const excessInventory = [
    { id: 1, product: "High Carbon Steel Sheet - Grade S355", quantity: "34 tons", age: "145 days", value: "$68,000" },
    { id: 2, product: "Stainless Steel 304 - 2mm", quantity: "12 tons", age: "167 days", value: "$48,000" },
    { id: 3, product: "Galvanized Steel Coil - Z275", quantity: "28 tons", age: "178 days", value: "$56,000" },
    { id: 4, product: "Weathering Steel Plate - Corten A", quantity: "15 tons", age: "189 days", value: "$37,500" }
  ];
  
  const handleGeneratePricing = async () => {
    setGeneratingPricing(true);
    setPricingResult(null);
    
    try {
      const prompt = "Generate AI pricing recommendations for liquidating excess steel inventory including high carbon steel, stainless steel, galvanized steel, and weathering steel";
      const response = await generateAIResponse(prompt, "Inventory Liquidation");
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create structured pricing recommendations
      const result = [
        { 
          product: "High Carbon Steel Sheet - Grade S355", 
          originalPrice: 2000, 
          recommendedPrice: 1640,
          reason: "Market analysis shows 18% oversupply in this category. Recommend 18% discount to move inventory within 30 days."
        },
        { 
          product: "Stainless Steel 304 - 2mm", 
          originalPrice: 4000, 
          recommendedPrice: 3600,
          reason: "Specialty product with stable demand. A moderate 10% discount should be sufficient to attract buyers without excess margin erosion."
        },
        { 
          product: "Galvanized Steel Coil - Z275", 
          originalPrice: 2000, 
          recommendedPrice: 1500,
          reason: "25% discount recommended based on competitive analysis and current market saturation for this product type."
        },
        { 
          product: "Weathering Steel Plate - Corten A", 
          originalPrice: 2500, 
          recommendedPrice: 2125,
          reason: "15% discount recommended. Product has niche applications but analysis of buyer behavior suggests price sensitivity in this segment."
        }
      ];
      
      setPricingResult(result);
      toast.success("AI pricing recommendations generated successfully!");
    } catch (error) {
      console.error("Error generating AI pricing recommendations:", error);
      toast.error("Failed to generate pricing recommendations. Please try again.");
    } finally {
      setGeneratingPricing(false);
    }
  };
  
  return (
    <ModuleLayout
      title="Inventory Liquidation"
      description="AI-powered pricing recommendations and buyer matching for liquidation of excess inventory"
      icon={<Box className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <div className="bg-ey-yellow/5 border border-ey-yellow/20 rounded-lg p-4 mb-6 flex items-start">
        <Sparkles className="h-5 w-5 text-ey-yellow mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-ey-darkGray mb-1">AI Co-Pilot Feature</h3>
          <p className="text-sm text-ey-lightGray">
            This module uses EY's generative AI to analyze your excess inventory, predict optimal pricing for rapid liquidation, and identify potential buyers through pattern recognition in market data.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="ey-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-ey-yellow mr-2" />
                <h2 className="text-lg font-medium text-ey-darkGray">Excess Inventory Analysis</h2>
              </div>
              <button
                className="flex items-center text-sm text-ey-yellow hover:underline"
                onClick={() => setShowExcessInventory(!showExcessInventory)}
              >
                <span>{showExcessInventory ? 'Hide' : 'Show'} Details</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            {showExcessInventory ? (
              <div className="animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ey-darkGray uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ey-darkGray uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ey-darkGray uppercase tracking-wider">Age</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-ey-darkGray uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {excessInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ey-darkGray">{item.product}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ey-darkGray">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ey-darkGray">{item.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-ey-darkGray">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 bg-ey-yellow/5 p-4 rounded-lg border border-ey-yellow/20">
                  <div className="flex items-center mb-3">
                    <Sparkles className="h-5 w-5 text-ey-yellow mr-2" />
                    <h3 className="font-medium text-ey-darkGray">AI Analysis</h3>
                  </div>
                  <p className="text-ey-lightGray text-sm">
                    Our AI has identified 4 product categories with excess inventory aging beyond optimal holding periods. 
                    Total value at risk: $209,500. Recommended action: Generate AI pricing strategy for liquidation within 30 days.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button 
                    className="ey-button flex items-center group"
                    onClick={handleGeneratePricing}
                    disabled={generatingPricing}
                  >
                    {generatingPricing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Generating AI Pricing...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        <span>Generate AI Pricing Recommendations</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-ey-lightGray">
                Click "Show Details" to view excess inventory that requires liquidation
              </div>
            )}
            
            {pricingResult && (
              <div className="mt-6 animate-fade-in">
                <h3 className="font-medium text-ey-darkGray mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-ey-yellow mr-2" />
                  AI-Generated Pricing Recommendations
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {pricingResult.map((item, index) => (
                    <div key={index} className="border border-ey-yellow/20 rounded-lg p-4 bg-ey-yellow/5">
                      <h4 className="font-medium text-ey-darkGray mb-2">{item.product}</h4>
                      <div className="flex flex-wrap gap-4 mb-2">
                        <div className="bg-white/80 rounded px-3 py-1">
                          <span className="text-xs text-ey-lightGray">Original Price</span>
                          <p className="font-medium">${item.originalPrice}/ton</p>
                        </div>
                        <div className="bg-white/80 rounded px-3 py-1">
                          <span className="text-xs text-ey-lightGray">AI Recommendation</span>
                          <p className="font-medium text-green-600">${item.recommendedPrice}/ton</p>
                        </div>
                        <div className="bg-white/80 rounded px-3 py-1">
                          <span className="text-xs text-ey-lightGray">Discount</span>
                          <p className="font-medium text-ey-yellow">
                            {Math.round(((item.originalPrice - item.recommendedPrice) / item.originalPrice) * 100)}%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-ey-lightGray">{item.reason}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 bg-ey-darkGray/5 p-4 rounded-lg">
                  <p className="text-sm text-ey-lightGray">
                    <strong>AI Summary:</strong> These pricing recommendations are generated using our proprietary machine learning model 
                    trained on historical steel market data, current supply-demand dynamics, and competitor pricing strategies. 
                    Implementing these recommendations has a 92% predicted success rate for inventory liquidation within 30 days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="ey-card p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-ey-yellow mr-2" />
              <h2 className="text-lg font-medium text-ey-darkGray">Liquidation KPIs</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-ey-darkGray/5 p-3 rounded-lg">
                <p className="text-xs text-ey-lightGray mb-1">Excess Inventory Value</p>
                <p className="text-xl font-medium text-ey-darkGray">$209,500</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-ey-yellow h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <p className="text-xs text-ey-lightGray mt-1">15% of total inventory value</p>
              </div>
              
              <div className="bg-ey-darkGray/5 p-3 rounded-lg">
                <p className="text-xs text-ey-lightGray mb-1">Avg. Holding Cost</p>
                <p className="text-xl font-medium text-ey-darkGray">$1,860/month</p>
              </div>
              
              <div className="bg-ey-darkGray/5 p-3 rounded-lg">
                <p className="text-xs text-ey-lightGray mb-1">Potential Margin Impact</p>
                <p className="text-xl font-medium text-red-500">-$36,662</p>
                <p className="text-xs text-ey-lightGray mt-1">Based on AI-recommended discounts</p>
              </div>
              
              <div className="bg-ey-darkGray/5 p-3 rounded-lg">
                <p className="text-xs text-ey-lightGray mb-1">Liquidation Efficiency</p>
                <div className="flex items-center">
                  <p className="text-xl font-medium text-ey-darkGray mr-2">92%</p>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Good
                  </div>
                </div>
                <p className="text-xs text-ey-lightGray mt-1">AI confidence in 30-day clearance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ModuleContent moduleType="Inventory Liquidation" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default InventoryLiquidation;
