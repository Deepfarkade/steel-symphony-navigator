
import React, { useEffect, useState, useRef } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

const FuturisticWelcome = () => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const loadingMessages = [
    "Initializing neural networks...",
    "Loading generative AI models...",
    "Calibrating steel analysis algorithms...",
    "Connecting to data streams...",
    "Preparing optimization engine..."
  ];
  
  useEffect(() => {
    setShowLogo(true);
    
    let index = 0;
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
      
      if (index % 20 === 0 && index > 0) {
        setLoadingPhase(prev => (prev + 1) % loadingMessages.length);
      }
      
      index++;
    }, 30);
    
    return () => clearInterval(timer);
  }, [loadingMessages.length]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle properties
    const particlesArray: { x: number; y: number; size: number; speedX: number; speedY: number; hue: number }[] = [];
    const numberOfParticles = 100;
    
    // Create particles
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        hue: 50 // Yellow hue
      });
    }
    
    // Animation function
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        const particle = particlesArray[i];
        
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around canvas edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, 0.3)`;
        ctx.fill();
        
        // Connect particles within a certain distance
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${particle.hue}, 100%, 50%, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 bg-[#1A1F2C] flex flex-col items-center justify-center z-50">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className={`transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} mb-8 relative z-10`}>
        <div className="h-24 w-24 bg-ey-yellow rounded-full flex items-center justify-center mb-4 relative">
          <BrainCircuit className="h-12 w-12 text-[#1A1F2C]" />
          <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin-slow"></div>
          <div className="absolute -inset-2 border border-ey-yellow/20 rounded-full"></div>
          <div className="absolute -inset-4 border border-ey-yellow/10 rounded-full"></div>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-2 flex items-center relative z-10">
        <span className="text-white">Steel Ecosystem</span>
        <span className="ml-2 text-ey-yellow flex items-center">
          Co-Pilot
          <Sparkles className="h-6 w-6 ml-2 text-ey-yellow animate-pulse" />
        </span>
      </h1>
      
      <p className="text-gray-300 mb-8 relative z-10">{loadingMessages[loadingPhase]}</p>
      
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4 relative z-10">
        <div 
          className="h-full bg-gradient-to-r from-ey-yellow to-ey-yellow/80 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center relative z-10">
        <div className="h-2 w-2 bg-ey-yellow rounded-full animate-ping mr-2"></div>
        <p className="text-sm text-gray-300">{progress}% - Loading neural networks</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 flex items-center">
        <div className="h-3 w-3 bg-ey-yellow/20 rounded-full"></div>
        <div className="h-0.5 w-20 bg-gradient-to-r from-ey-yellow/20 to-transparent"></div>
      </div>
      <div className="absolute bottom-10 right-10 flex items-center">
        <div className="h-0.5 w-20 bg-gradient-to-l from-ey-yellow/20 to-transparent"></div>
        <div className="h-3 w-3 bg-ey-yellow/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default FuturisticWelcome;
