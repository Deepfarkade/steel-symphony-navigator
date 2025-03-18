
import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Sparkles, ArrowRight, BarChart2, Zap, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiIntroduction = () => {
  const [visible, setVisible] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const fullText = "I'm your EY Steel Ecosystem Co-Pilot, powered by generative AI. I analyze your steel operations data in real-time to provide actionable insights and optimize your manufacturing processes.";
  
  const aiInsights = [
    "Predicting demand patterns for different steel grades based on historical data and market trends.",
    "Optimizing production scheduling to maximize efficiency and minimize energy consumption.",
    "Identifying potential quality issues before they affect your final product.",
    "Recommending inventory levels to balance carrying costs and service levels."
  ];
  
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setVisible(true);
    
    let index = 0;
    const timer = setInterval(() => {
      setCurrentText(fullText.substring(0, index));
      index++;
      
      if (index > fullText.length) {
        clearInterval(timer);
        setTypingComplete(true);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (typingComplete) {
      const intervalId = setInterval(() => {
        setCurrentInsightIndex(prev => (prev + 1) % aiInsights.length);
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [typingComplete, aiInsights.length]);
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-ey-yellow/60 rounded-full';
      
      // Random position along the height of the container
      const top = Math.random() * 100;
      particle.style.top = `${top}%`;
      particle.style.left = '-5px';
      
      // Random size
      const size = Math.random() * 4 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random opacity
      particle.style.opacity = (Math.random() * 0.5 + 0.3).toString();
      
      // Animation
      particle.animate(
        [
          { left: '-5px', opacity: 0.8 },
          { left: '105%', opacity: 0 }
        ],
        {
          duration: Math.random() * 3000 + 2000,
          easing: 'linear'
        }
      );
      
      particlesRef.current?.appendChild(particle);
      
      // Remove particle when animation is complete
      setTimeout(() => {
        if (particlesRef.current?.contains(particle)) {
          particlesRef.current.removeChild(particle);
        }
      }, 5000);
    };
    
    const particleInterval = setInterval(createParticle, 300);
    
    return () => clearInterval(particleInterval);
  }, []);
  
  return (
    <div className={`relative overflow-hidden ey-card p-6 mb-8 transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Neural network particle animation */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      
      <div className="flex items-start relative z-10">
        <div className="relative">
          <div className="bg-ey-yellow/10 p-3 rounded-full mr-4 flex-shrink-0">
            <BrainCircuit className="h-6 w-6 text-ey-yellow" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-ey-yellow rounded-full animate-ping opacity-75"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold text-ey-darkGray mr-2">
              Generative AI Co-Pilot
            </h2>
            <Sparkles className="h-4 w-4 text-ey-yellow animate-pulse" />
          </div>
          
          <p className="text-ey-lightGray relative mb-4">
            {currentText}
            <span className={`absolute inline-block h-5 w-0.5 bg-ey-yellow ml-1 ${typingComplete ? 'animate-pulse' : ''}`}></span>
          </p>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInsightIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-ey-yellow/5 to-ey-yellow/10 p-3 rounded-lg border border-ey-yellow/20 flex items-start"
            >
              <Brain className="h-5 w-5 text-ey-yellow mr-2 mt-0.5" />
              <p className="text-sm text-ey-darkGray">
                {aiInsights[currentInsightIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex flex-wrap mt-4">
            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-ey-darkGray flex items-center m-1 hover:bg-gray-200 transition-colors cursor-pointer">
              <BarChart2 className="h-3 w-3 mr-1 text-ey-yellow" />
              <span>Production Analytics</span>
            </div>
            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-ey-darkGray flex items-center m-1 hover:bg-gray-200 transition-colors cursor-pointer">
              <Zap className="h-3 w-3 mr-1 text-ey-yellow" />
              <span>Energy Efficiency</span>
            </div>
            <div className="bg-gray-100 rounded-full px-3 py-1 text-sm text-ey-darkGray flex items-center m-1 hover:bg-gray-200 transition-colors cursor-pointer">
              <ArrowRight className="h-3 w-3 mr-1 text-ey-yellow" />
              <span>Get Started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiIntroduction;
