
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

const AiIntroduction = () => {
  const [visible, setVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const fullText = "I'm your EY Steel Ecosystem Co-Pilot, powered by generative AI. I analyze your steel operations data in real-time to provide actionable insights and optimize your manufacturing processes.";
  
  useEffect(() => {
    setVisible(true);
    
    let index = 0;
    const timer = setInterval(() => {
      setCurrentText(fullText.substring(0, index));
      index++;
      
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className={`ey-card p-6 mb-8 transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-start">
        <div className="bg-ey-yellow/10 p-3 rounded-full mr-4 flex-shrink-0">
          <BrainCircuit className="h-6 w-6 text-ey-yellow" />
        </div>
        <div>
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold text-ey-darkGray mr-2">
              Generative AI Co-Pilot
            </h2>
            <Sparkles className="h-4 w-4 text-ey-yellow animate-pulse" />
          </div>
          
          <p className="text-ey-lightGray relative">
            {currentText}
            <span className={`absolute inline-block h-5 w-0.5 bg-ey-yellow ml-1 ${index > fullText.length ? 'animate-pulse' : ''}`}></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiIntroduction;
