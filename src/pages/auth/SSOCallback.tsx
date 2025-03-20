
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleSSOCallback } from '@/services/ssoService';

const SSOCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse the URL parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        
        if (error) {
          throw new Error(`SSO Error: ${error}`);
        }
        
        if (!code || !state) {
          throw new Error('Missing required parameters (code or state)');
        }
        
        // Call the actual SSO callback handler from ssoService
        const user = await handleSSOCallback(code, state);
        
        if (!user) {
          throw new Error('Authentication failed');
        }
        
        // Set session expiry (7 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
        
        setStatus('success');
        
        // Notify the user
        toast({
          title: "SSO Login Successful",
          description: "You have been successfully logged in.",
        });
        
        // Redirect to home page after a brief delay to show success message
        setTimeout(() => {
          navigate('/');
        }, 1500);
        
      } catch (error) {
        console.error('SSO callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
        
        // Notify the user
        toast({
          variant: "destructive",
          title: "SSO Login Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
        
        // Navigate back to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };
    
    processCallback();
  }, [location.search, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ey-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ey-yellow rounded-full flex items-center justify-center">
              <BrainCircuit className="h-8 w-8 text-ey-darkGray" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-ey-darkGray dark:text-white mb-2">
            {status === 'loading' && 'Processing SSO Login...'}
            {status === 'success' && 'Login Successful!'}
            {status === 'error' && 'Login Failed'}
          </h1>
          <p className="text-ey-lightGray">
            {status === 'loading' && 'Please wait while we authenticate your account...'}
            {status === 'success' && 'Redirecting you to the dashboard...'}
            {status === 'error' && errorMessage}
          </p>
        </div>
        
        <div className="relative">
          {status === 'loading' && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ey-yellow"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-green-800 dark:text-green-200">Authentication successful!</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <p className="text-red-800 dark:text-red-200">Authentication failed.</p>
              <p className="text-red-600 dark:text-red-300 text-sm mt-2">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SSOCallback;
