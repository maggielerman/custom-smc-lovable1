
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("AuthContext: Auth state changed", { event, user: newSession?.user?.email });
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in");
        } else if (event === 'SIGNED_OUT') {
          toast.info("You have been signed out");
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("AuthContext: Checking for existing session");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("AuthContext: Initial session check complete", { 
          hasSession: !!initialSession, 
          userEmail: initialSession?.user?.email 
        });
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error("AuthContext: Error checking session", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log("AuthContext: Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
      console.log("AuthContext: Attempting to sign up", { email });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      toast.success("Registration successful! Check your email to confirm your account.");
    } catch (error: any) {
      console.error("AuthContext: Sign up error", error);
      toast.error(error.message || "An error occurred during signup");
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting to sign in", { email });
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log("AuthContext: Sign in successful", { user: data?.user?.email });
    } catch (error: any) {
      console.error("AuthContext: Sign in error", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthContext: Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("AuthContext: Sign out successful");
    } catch (error: any) {
      console.error("AuthContext: Sign out error", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
