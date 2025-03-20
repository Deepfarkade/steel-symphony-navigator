
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrainCircuit, EyeIcon, EyeOffIcon, LockKeyhole, UserRound } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser, checkAuthStatus } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { initiateSSO } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = checkAuthStatus();
    if (user) {
      navigate('/');
    }
  }, [navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      await authenticateUser(values.email, values.password);
      
      toast({
        title: "Success!",
        description: "You have been logged in successfully.",
      });
      
      // Navigate to home page after successful login
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = (provider: 'google' | 'microsoft' | 'okta' | 'onelogin') => {
    initiateSSO(provider);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Side - EY Branding */}
      <div className="w-full md:w-1/2 bg-ey-darkGray p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-ey-yellow rounded-full flex items-center justify-center">
                <BrainCircuit className="h-10 w-10 text-ey-darkGray" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">EY Steel Ecosystem</h1>
            <div className="text-2xl font-semibold text-ey-yellow flex items-center justify-center">
              Co-Pilot
              <span className="ml-2 relative">
                <span className="absolute -top-1 -right-4">
                  <div className="h-2 w-2 bg-ey-yellow rounded-full animate-ping"></div>
                </span>
              </span>
            </div>
            <p className="mt-4 text-ey-lightGray">AI-powered steel operations analytics</p>
          </div>
          
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h2 className="text-lg text-white mb-2">Enterprise-Grade Analytics</h2>
              <p className="text-ey-lightGray text-sm">Real-time insights into your steel manufacturing processes</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h2 className="text-lg text-white mb-2">AI-Powered Optimization</h2>
              <p className="text-ey-lightGray text-sm">Machine learning algorithms that improve efficiency and reduce costs</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h2 className="text-lg text-white mb-2">Predictive Maintenance</h2>
              <p className="text-ey-lightGray text-sm">Detect equipment issues before they cause downtime</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ey-darkGray mb-2">Welcome Back</h2>
            <p className="text-ey-lightGray">Log in to access your Steel Co-Pilot</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ey-darkGray">Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          className="pl-10" 
                          {...field} 
                        />
                      </FormControl>
                      <UserRound className="absolute left-3 top-3 h-4 w-4 text-ey-lightGray" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ey-darkGray">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10" 
                          {...field} 
                        />
                      </FormControl>
                      <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-ey-lightGray" />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-ey-lightGray" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-ey-lightGray" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-ey-yellow focus:ring-ey-yellow border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-ey-lightGray">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-ey-yellow hover:text-ey-yellow/80">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ey-yellow hover:bg-ey-yellow/90 text-ey-darkGray"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  Or continue with
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center border-gray-300"
                  onClick={() => handleSSOLogin('google')}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
                  </svg>
                  Google
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center border-gray-300"
                  onClick={() => handleSSOLogin('microsoft')}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4 24H0V12.6h11.4V24z" fill="#F1511B"/>
                    <path d="M24 24H12.6V12.6H24V24z" fill="#80CC28"/>
                    <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#00ADEF"/>
                    <path d="M24 11.4H12.6V0H24v11.4z" fill="#FBBC09"/>
                  </svg>
                  Microsoft
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center border-gray-300"
                  onClick={() => handleSSOLogin('okta')}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.389 0 0 5.389 0 12s5.389 12 12 12 12-5.389 12-12S18.611 0 12 0zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#007DC1"/>
                  </svg>
                  Okta
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center border-gray-300"
                  onClick={() => handleSSOLogin('onelogin')}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 15.6c-2.04 0-3.6-1.56-3.6-3.6 0-2.04 1.56-3.6 3.6-3.6 2.04 0 3.6 1.56 3.6 3.6 0 2.04-1.56 3.6-3.6 3.6z" fill="#1C1F2A"/>
                  </svg>
                  OneLogin
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-ey-lightGray">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-ey-yellow hover:text-ey-yellow/80">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
