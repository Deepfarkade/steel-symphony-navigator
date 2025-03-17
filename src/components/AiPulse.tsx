
import React from 'react';

const AiPulse = () => {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-1 z-10">
      <div className="h-full bg-gradient-to-b from-ey-yellow via-ey-yellow/10 to-transparent">
        <div className="absolute top-[10%] w-full h-8 bg-ey-yellow animate-pulse-light rounded-full blur-sm"></div>
        <div className="absolute top-[30%] w-full h-12 bg-ey-yellow animate-pulse-light rounded-full blur-sm delay-300"></div>
        <div className="absolute top-[60%] w-full h-10 bg-ey-yellow animate-pulse-light rounded-full blur-sm delay-700"></div>
        <div className="absolute top-[80%] w-full h-6 bg-ey-yellow animate-pulse-light rounded-full blur-sm delay-500"></div>
      </div>
    </div>
  );
};

export default AiPulse;
