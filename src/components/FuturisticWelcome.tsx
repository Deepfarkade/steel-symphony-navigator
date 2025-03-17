
import React, { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

const FuturisticWelcome = () => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  
  useEffect(() => {
    setShowLogo(true);
    
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 30);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-ey-darkGray flex flex-col items-center justify-center z-50">
      <div className={`transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'} mb-8`}>
        <div className="h-24 w-24 bg-ey-yellow rounded-full flex items-center justify-center mb-4">
          <BrainCircuit className="h-12 w-12 text-ey-darkGray" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
        <span className="text-gradient">Steel Ecosystem</span>
        <span className="ml-2 text-ey-yellow flex items-center">
          Co-Pilot
          <Sparkles className="h-6 w-6 ml-2 text-ey-yellow animate-pulse" />
        </span>
      </h1>
      
      <p className="text-ey-lightGray mb-8">Initializing AI systems...</p>
      
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-ey-yellow transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center">
        <div className="h-2 w-2 bg-ey-yellow rounded-full animate-ping mr-2"></div>
        <p className="text-sm text-ey-lightGray">{progress}% - Loading neural networks</p>
      </div>
    </div>
  );
};

export default FuturisticWelcome;
