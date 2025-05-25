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
  
  // Helper to refresh the Supabase session with a new Clerk token
  const refreshSupabaseSession = async () => {
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      const expiresAt = session?.expires_at ? session.expires_at * 1000 : 0;

      // The Supabase client's accessToken function handles token refresh automatically now.
      // No need for explicit setSession here.
      // We can still trigger a session refresh if needed by making a Supabase call,
      // which will use the accessToken function.

    } catch (err) {
      console.error("Failed to refresh Supabase session", err);
    }
  };

  // Determine if we're still loading auth data
  const loading = !isAuthLoaded || !isUserLoaded;
  const isLoaded = isAuthLoaded && isUserLoaded;
  
  // Get user ID safely
  const userId = isSignedIn && user ? user.id : null;

  // Effect to sync Clerk session with Supabase
  useEffect(() => {
    const syncAuthState = async () => {
      if (isLoaded) {
        // When using the accessToken function in the Supabase client,
        // the token is automatically managed by the client for each request.
        // No need for manual setSession based on Clerk token here.

        if (!isSignedIn || !user) {
           // Optionally clear Supabase session if user signs out. This might be redundant
           // if the accessToken function returns null when not signed in.
           // await supabase.auth.setSession({ access_token: "", refresh_token: "" });
           console.log("Clerk user signed out. Supabase client will use null token.");
           setProfileData(null);
        } else {
           console.log("Clerk user signed in. Supabase client will use Clerk token automatically.");
           // The ensureProfileExists call should now work because the Supabase client
           // is configured to send the Clerk token, and RLS (once updated) will use it.
        }

      }
    };

    syncAuthState();
  }, [isLoaded, isSignedIn, user, getToken]); // Keep getToken as a dependency if ensureProfileExists or other logic directly uses it later

  // Effect to handle auth state changes and force re-renders
  useEffect(() => {
    if (isLoaded) {
      setAuthInitialized(true);
      console.log("Auth initialized, signed in:", isSignedIn);
      
      // If user is signed in, ensure their profile exists in Supabase
      if (isSignedIn && user) {
        // Add some delay to ensure Clerk has fully processed the authentication
        const timer = setTimeout(async () => {
          console.log("Ensuring profile exists for user:", user.id);
          try {
            const profile = await ensureProfileExists(user);
            setProfileData(profile);
          } catch (err) {
            console.error("Failed to ensure profile exists:", err);
            toast.error("There was a problem with your profile. Please try logging out and back in.");
          }
        }, 1000); // Increased delay for better reliability
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Since we're using Clerk components, we don't need explicit functions for signUp, signIn
  // We only need signOut which might be called from nav/account areas
  const value = {
    session: isSignedIn ? { user } : null,
    user: isSignedIn ? user : null,
    userId: userId,
    profileData: profileData,
    loading,
    isLoaded,
    // Pass the getToken method from Clerk's useAuth hook
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
