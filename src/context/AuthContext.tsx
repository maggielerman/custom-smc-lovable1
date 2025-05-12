
import React, { createContext, useContext } from "react";
import { 
  useAuth as useClerkAuth, 
  useUser, 
  useSignIn, 
  useSignUp,
  useClerk
} from "@clerk/clerk-react";
import { toast } from "sonner";

interface AuthContextType {
  session: any | null;
  user: any | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, isSignedIn } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const clerk = useClerk();

  // Determine if we're still loading auth data
  const loading = !isAuthLoaded || !isUserLoaded || !isSignInLoaded || !isSignUpLoaded;

  const handleSignUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
      console.log("AuthContext: Attempting to sign up", { email });
      
      await signUp.create({
        emailAddress: email,
        password,
        firstName: metadata?.first_name || undefined,
        lastName: metadata?.last_name || undefined
      });
      
      // Check signup status
      if (signUp.status === 'complete') {
        toast.success("Registration successful! You can now sign in.");
      } else {
        // Handle all other statuses
        toast.success("Registration successful! Check your email to confirm your account.");
      }
      
    } catch (error: any) {
      console.error("AuthContext: Sign up error", error);
      toast.error(error.errors?.[0]?.message || "An error occurred during signup");
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Attempting to sign in", { email });
      
      await signIn.create({
        identifier: email,
        password,
      });
      
      if (signIn.status === 'complete') {
        console.log("AuthContext: Sign in successful");
        toast.success("Successfully signed in");
      }
      
    } catch (error: any) {
      console.error("AuthContext: Sign in error", error);
      toast.error(error.errors?.[0]?.message || "Failed to sign in");
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("AuthContext: Attempting to sign out");
      await clerk.signOut();
      console.log("AuthContext: Sign out successful");
      toast.info("You have been signed out");
    } catch (error: any) {
      console.error("AuthContext: Sign out error", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const value = {
    session: isSignedIn ? { user } : null,
    user: isSignedIn ? user : null,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
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
