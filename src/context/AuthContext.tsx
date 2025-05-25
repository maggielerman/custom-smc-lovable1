
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  useAuth as useClerkAuth, 
  useUser, 
  useClerk
} from "@clerk/clerk-react";
import { toast } from "sonner";
import { AuthContextType } from "@/lib/auth/types";
import { ensureProfileExists } from "@/lib/auth/clerk-helpers";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const clerk = useClerk();
  
  // State to track if components should re-render after auth changes
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  // Determine if we're still loading auth data
  const loading = !isAuthLoaded || !isUserLoaded;
  const isLoaded = isAuthLoaded && isUserLoaded;
  
  // Get user ID safely
  const userId = isSignedIn && user ? user.id : null;

  // Helper to test Supabase connection with current auth state
  const testSupabaseConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      const { data, error } = await supabase
        .from('profiles')
        .select('id, clerk_id')
        .limit(1);
      
      if (error) {
        console.error("Supabase connection test failed:", error);
      } else {
        console.log("Supabase connection test successful");
      }
    } catch (err) {
      console.error("Supabase connection test error:", err);
    }
  };

  // Effect to handle auth state changes and profile creation
  useEffect(() => {
    if (isLoaded) {
      setAuthInitialized(true);
      console.log("Auth initialized, signed in:", isSignedIn);
      
      // Test Supabase connection when auth state changes
      testSupabaseConnection();
      
      // If user is signed in, ensure their profile exists in Supabase
      if (isSignedIn && user) {
        console.log("User signed in, ensuring profile exists:", user.id);
        
        // Add some delay to ensure Clerk has fully processed the authentication
        const timer = setTimeout(async () => {
          try {
            const profile = await ensureProfileExists(user);
            if (profile) {
              setProfileData(profile);
              console.log("Profile synchronized successfully");
            } else {
              console.error("Failed to synchronize profile");
            }
          } catch (err) {
            console.error("Failed to ensure profile exists:", err);
            toast.error("There was a problem with your profile. Please try logging out and back in.");
          }
        }, 1500); // Increased delay for better reliability
        
        return () => clearTimeout(timer);
      } else {
        // Clear profile data when user signs out
        setProfileData(null);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Function to refresh authentication state
  const refreshSupabaseSession = async () => {
    if (isSignedIn && user) {
      console.log("Refreshing Supabase session...");
      await testSupabaseConnection();
    }
  };

  const value = {
    session: isSignedIn ? { user } : null,
    user: isSignedIn ? user : null,
    userId: userId,
    profileData: profileData,
    loading,
    isLoaded,
    getToken,
    refreshSupabaseSession,
    signUp: async () => {
      toast.error("Please use the sign up form");
    },
    signIn: async () => {
      toast.error("Please use the sign in form");
    },
    signOut: async () => {
      try {
        console.log("Signing out user...");
        await clerk.signOut();
        setProfileData(null);
        toast.info("You have been signed out");
      } catch (error: any) {
        console.error("AuthContext: Sign out error", error);
        toast.error(error.message || "Failed to sign out");
        throw error;
      }
    },
    signInWithGoogle: async () => {
      toast.error("Please use the sign in form");
    },
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
