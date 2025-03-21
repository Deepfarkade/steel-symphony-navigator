
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, BrainCircuit, Save, ArrowLeft, Plus, Upload, Sparkles, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createCustomAgent } from '@/services/dataService';
import { isAdmin } from '@/services/authService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateAgentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [agentData, setAgentData] = useState({
    name: '',
    description: '',
    icon: 'brain-circuit',
    type: 'supply-chain',
    confidence: 80
  });
  
  // Check if user is admin
  const userIsAdmin = isAdmin();
  
  // Redirect non-admin users
  useEffect(() => {
    if (!userIsAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only administrators can create custom agents."
      });
      navigate('/agents');
    }
  }, [userIsAdmin, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAgentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double-check admin permissions
    if (!userIsAdmin) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "You don't have permission to create agents."
      });
      return;
    }
    
    if (!agentData.name || !agentData.description) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a name and description for your agent."
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // In a real app, this would create a new agent with the provided data
      const result = await createCustomAgent(agentData);
      
      toast({
        title: "Agent created successfully",
        description: "Your custom AI agent is now being deployed."
      });
      
      // Redirect to the agent page after a brief delay
      setTimeout(() => {
        navigate(`/agents`);
      }, 1500);
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: "Failed to create the agent. Please try again."
      });
    } finally {
      setIsCreating(false);
    }
  };

  const agentTypes = [
    { value: "supply-chain", label: "Supply Chain" },
    { value: "production", label: "Production" },
    { value: "quality", label: "Quality Control" },
    { value: "logistics", label: "Logistics" },
    { value: "inventory", label: "Inventory Management" },
  ];

  const iconOptions = [
    { value: "brain-circuit", label: "Brain Circuit" },
    { value: "zap", label: "Lightning" },
    { value: "bar-chart", label: "Chart" },
    { value: "truck", label: "Truck" },
    { value: "package", label: "Package" },
    { value: "shield", label: "Shield" },
    { value: "check-circle", label: "Check Circle" }
  ];

  // Show access denied for non-admin users
  if (!userIsAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="ml-64 p-8 transition-all duration-300">
          <Header 
            pageTitle="Access Denied"
            breadcrumbs={[
              { label: 'Home', link: '/' },
              { label: 'AI Agents', link: '/agents' },
              { label: 'Access Denied', link: '#' }
            ]}
          />
          
          <div className="mt-8">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                Only administrators can access this page. If you need to create a custom agent, please contact your administrator.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/agents')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Agents
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8 transition-all duration-300">
        <Header 
          pageTitle="Create Custom Agent"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'AI Agents', link: '/agents' },
            { label: 'Create Agent', link: '/create-agent' }
          ]}
        />
        
        <div className="mb-6">
          <Button 
            variant="outline"
            onClick={() => navigate('/agents')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Create Your Custom AI Agent</CardTitle>
                  <CardDescription className="text-white/80">
                    Design an AI agent tailored to your specific steel operations needs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="name">
                        Agent Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Steel Quality Monitor"
                        value={agentData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="description">
                        Agent Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe what your agent does..."
                        value={agentData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="type">
                        Agent Type
                      </label>
                      <Select
                        value={agentData.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent type" />
                        </SelectTrigger>
                        <SelectContent>
                          {agentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="icon">
                        Agent Icon
                      </label>
                      <Select
                        value={agentData.icon}
                        onValueChange={(value) => handleSelectChange('icon', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="confidence">
                        Initial Confidence Level (%)
                      </label>
                      <Input
                        id="confidence"
                        name="confidence"
                        type="number"
                        min="50"
                        max="99"
                        value={agentData.confidence}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg mt-6">
                      <h3 className="text-sm font-medium text-purple-800 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                        How it works
                      </h3>
                      <p className="text-sm text-purple-700 mt-2">
                        Your custom agent will be trained on your steel operations data and will provide insights and recommendations based on advanced AI analysis.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/agents')}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Agent...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Agent
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentPage;
