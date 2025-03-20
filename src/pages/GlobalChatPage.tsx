import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AiChatInterface from '@/components/AiChatInterface';
import { Brain, BrainCircuit, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';
import { ChatProvider } from '@/context/ChatContext';

const GlobalChatPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleSidebarChange = (event: CustomEvent) => {
      const { isCollapsed } = event.detail;
      setSidebarCollapsed(isCollapsed);
    };

    // Add event listener for sidebar state change
    document.addEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    
    // Check if sidebar is already collapsed on mount
    const currentState = document.body.getAttribute('data-sidebar-collapsed');
    if (currentState === 'true') {
      setSidebarCollapsed(true);
    }
    
    return () => {
      document.removeEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    };
  }, []);
  
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-ey-black/90">
      <Navigation />
      <div 
        data-main-content 
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-64'} p-8`}
      >
        <Header pageTitle="EY Steel Co-Pilot Chat" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EY Steel Ecosystem Co-Pilot (SECP)</h1>
              <p className="text-white/80">Your AI assistant for all steel manufacturing operations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-ey-yellow mr-2" />
                <h3 className="font-semibold">Advanced Analysis</h3>
              </div>
              <p className="text-sm text-white/80">Ask complex questions about your steel operations, production data, and market trends.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-ey-yellow mr-2" />
                <h3 className="font-semibold">AI Recommendations</h3>
              </div>
              <p className="text-sm text-white/80">Get data-driven recommendations for optimizing your steel production and supply chain.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <BrainCircuit className="h-5 w-5 text-ey-yellow mr-2" />
                <h3 className="font-semibold">Module Integration</h3>
              </div>
              <p className="text-sm text-white/80">Seamlessly connect with all EY SECP modules for comprehensive assistance.</p>
            </div>
          </div>
        </motion.div>
        
        <Card className="max-w-6xl mx-auto p-0 overflow-hidden">
          <div className="bg-white h-[calc(100vh-300px)]">
            <ChatProvider>
              <AiChatInterface disableFloatingButton={true} />
            </ChatProvider>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlobalChatPage;
