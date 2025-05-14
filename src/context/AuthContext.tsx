
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  useAuth as useClerkAuth, 
  useUser, 
  useSignIn, 
  useSignUp,
  useClerk
} from "@clerk/clerk-react";
import { toast } from "sonner";
import { AuthContextType } from "@/lib/auth/types";
import { 
  ensureProfileExists,
  handleSignUp as clerkSignUp,
  handleSignIn as clerkSignIn,
  handleSignInWithGoogle as clerkSignInWithGoogle,
  handleSignOut as clerkSignOut
} from "@/lib/auth/clerk-helpers";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signIn: clerkSignInHook, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp: clerkSignUpHook, isLoaded: isSignUpLoaded } = useSignUp();
  const clerk = useClerk();
  
  // State to track if components should re-render after auth changes
  const [authInitialized, setAuthInitialized] = useState(false);

  // Determine if we're still loading auth data
  const loading = !isAuthLoaded || !isUserLoaded || !isSignInLoaded || !isSignUpLoaded;
  const isLoaded = isAuthLoaded && isUserLoaded && isSignInLoaded && isSignUpLoaded;
  
  // Get user ID safely
  const userId = isSignedIn && user ? user.id : null;

  // Effect to handle auth state changes and force re-renders
  useEffect(() => {
    if (isLoaded) {
      setAuthInitialized(true);
      console.log("Auth initialized, signed in:", isSignedIn);
      
      // If user is signed in, ensure their profile exists in Supabase
      if (isSignedIn && user) {
        ensureProfileExists(user);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const value = {
    session: isSignedIn ? { user } : null,
    user: isSignedIn ? user : null,
    userId: userId,
    loading,
    isLoaded,
    signUp: (email, password, metadata) => clerkSignUp(clerkSignUpHook, clerkSignInHook, clerk, email, password, metadata),
    signIn: (email, password) => clerkSignIn(clerkSignInHook, clerk, email, password),
    signOut: () => clerkSignOut(clerk),
    signInWithGoogle: () => clerkSignInWithGoogle(clerkSignInHook),
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
