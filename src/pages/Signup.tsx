
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrainCircuit, CheckIcon, EyeIcon, EyeOffIcon, LockKeyhole, MailIcon, UserRound } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from '@/services/authService';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      await registerUser(values.name, values.email, values.password);
      
      // Show success message
      setSignupSuccess(true);
      
      toast({
        title: "Account created!",
        description: "You've been successfully registered.",
      });
      
      // Set session expiry (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      localStorage.setItem('ey-session-expiry', expiryDate.toISOString());
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "There was an error creating your account.",
      });
    } finally {
      setIsLoading(false);
    }
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
            <p className="mt-4 text-ey-lightGray">Next-generation steel operations platform</p>
          </div>
          
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-start space-x-2">
              <div className="mt-1 bg-ey-yellow rounded-full p-1">
                <CheckIcon className="h-3 w-3 text-ey-darkGray" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Real-time analytics</h3>
                <p className="text-ey-lightGray text-xs">Monitor your operations in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="mt-1 bg-ey-yellow rounded-full p-1">
                <CheckIcon className="h-3 w-3 text-ey-darkGray" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">AI-Powered decision support</h3>
                <p className="text-ey-lightGray text-xs">Get intelligent recommendations</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="mt-1 bg-ey-yellow rounded-full p-1">
                <CheckIcon className="h-3 w-3 text-ey-darkGray" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Seamless integration</h3>
                <p className="text-ey-lightGray text-xs">Works with your existing systems</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="mt-1 bg-ey-yellow rounded-full p-1">
                <CheckIcon className="h-3 w-3 text-ey-darkGray" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Enterprise security</h3>
                <p className="text-ey-lightGray text-xs">Bank-level encryption and compliance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ey-darkGray mb-2">Create an Account</h2>
            <p className="text-ey-lightGray">Sign up to start using the Steel Co-Pilot</p>
          </div>
          
          {signupSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Account Created!</h3>
              <p className="text-green-700">You've been successfully registered.</p>
              <p className="text-green-600 text-sm mt-2">Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ey-darkGray">Full Name</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
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
                        <MailIcon className="absolute left-3 top-3 h-4 w-4 text-ey-lightGray" />
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
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ey-darkGray">Confirm Password</FormLabel>
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
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-ey-yellow focus:ring-ey-yellow border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-ey-lightGray">
                    I agree to the <a href="#" className="text-ey-yellow hover:text-ey-yellow/80">Terms of Service</a> and <a href="#" className="text-ey-yellow hover:text-ey-yellow/80">Privacy Policy</a>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-ey-yellow hover:bg-ey-yellow/90 text-ey-darkGray"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-ey-lightGray">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-ey-yellow hover:text-ey-yellow/80">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
