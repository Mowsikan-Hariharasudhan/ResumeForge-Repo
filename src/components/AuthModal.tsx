import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('signin');
  const { signIn, signUp, user } = useAuth();

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (user && isOpen) {
      console.log('User authenticated, closing modal');
      onClose();
      resetForm();
    }
  }, [user, isOpen, onClose]);

  const validateForm = (isSignUp: boolean) => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      await signIn(email, password);
      // Modal will close automatically via useEffect when user state changes
    } catch (error: any) {
      console.error('Sign in error in modal:', error);
      // Error is already handled in useAuth hook with toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      await signUp(email, password, fullName);
      // Modal will close automatically via useEffect when user state changes
    } catch (error: any) {
      console.error('Sign up error in modal:', error);
      // Error is already handled in useAuth hook with toast
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setErrors({});
    setShowPassword(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-primary text-white p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white">
              Welcome to ResumeForge
            </DialogTitle>
            <p className="text-blue-100 text-center text-sm mt-2">
              Create professional resumes in minutes
            </p>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            {/* Error Message */}
            {errors.general && (
              <Card className="mb-4 border-red-200 bg-red-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{errors.general}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <TabsContent value="signin" className="space-y-4 mt-0">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`pl-10 h-11 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 h-11 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-primary hover:opacity-90 text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-0">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={`pl-10 h-11 ${errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      required
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`pl-10 h-11 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password (min. 6 characters)"
                      className={`pl-10 pr-10 h-11 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                  {!errors.password && password.length > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      {password.length >= 6 ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-green-600">Password strength: Good</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-yellow-500" />
                          <span className="text-yellow-600">Password too short</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-primary hover:opacity-90 text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};