import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.id || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id || 'No user');
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            setSession(null);
            setUser(null);
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            setSession(session);
            setUser(session?.user ?? null);
            break;
          case 'USER_UPDATED':
            console.log('User updated');
            setSession(session);
            setUser(session?.user ?? null);
            break;
          default:
            setSession(session);
            setUser(session?.user ?? null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined,
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      console.log('Sign up response:', {
        user: data.user?.id,
        session: data.session?.access_token ? 'Present' : 'None',
        needsConfirmation: !data.session
      });
      
      // Check if user needs email confirmation
      if (!data.session && data.user && !data.user.email_confirmed_at) {
        // Email confirmation is required
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please check your email and click the link to activate your account.",
          variant: "default",
        });
        return;
      }
      
      // If we have a session, the user is automatically signed in
      if (data.session && data.user) {
        console.log('User automatically signed in after signup');
        setSession(data.session);
        setUser(data.user);
        
        toast({
          title: "Welcome to Resumify!",
          description: "Your account has been created successfully. You can now start building your resume.",
        });
      } else {
        // Fallback message
        toast({
          title: "Account created!",
          description: "You can now start building your resume.",
        });
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      const errorMessage = (error as AuthError).message;
      
      // Handle specific error cases
      if (errorMessage.includes('email_address_not_authorized')) {
        toast({
          title: "Email not authorized",
          description: "This email address is not authorized. Please contact support.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('email_not_confirmed')) {
        toast({
          title: "Email not confirmed",
          description: "Please check your email and click the confirmation link before signing in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up failed",
          description: errorMessage || "There was an error creating your account. Please try again.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data.user?.id);
      
      // Update local state immediately
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      console.error('Sign in failed:', error);
      const errorMessage = (error as AuthError).message;
      
      // Handle specific error cases
      if (errorMessage.includes('email_not_confirmed')) {
        toast({
          title: "Email not confirmed",
          description: "Please check your email and click the confirmation link to activate your account.",
          variant: "destructive",
        });
      } else if (errorMessage.includes('invalid_credentials')) {
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign in failed",
          description: errorMessage || "There was an error signing you in. Please try again.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state immediately
      setSession(null);
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      toast({
        title: "Sign out failed",
        description: (error as AuthError).message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};