import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Loader2 } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isProcessing, setIsProcessing] = useState(false);
  const { handleRedirectCallback } = useClerk();

  // Handle OAuth callback
  useEffect(() => {
    async function processOAuthCallback() {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('oauth_callback')) {
        try {
          setIsProcessing(true);
          await handleRedirectCallback({ redirectUrl: window.location.href });
        } catch (err) {
          console.error("OAuth callback error:", err);
        } finally {
          setIsProcessing(false);
        }
      }
    }
    
    processOAuthCallback();
  }, [handleRedirectCallback]);

  // If user is already logged in, redirect to home
  useEffect(() => {
    console.log("Auth page: User state changed", { user, loading });
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/";
      console.log(`Auth page: Redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Set active tab based on query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsProcessing(true);
      console.log("Auth page: Calling signIn");
      await signIn(email, password);
      console.log("Auth page: signIn completed");
      // No need to navigate, useEffect will handle it
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsProcessing(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsProcessing(true);
      const metadata = {
        first_name: firstName || undefined,
        last_name: lastName || undefined
      };
      
      await signUp(email, password, metadata);
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // If still loading auth state, show loading
  if (loading || isProcessing) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-book-red mb-4" />
        <p className="text-gray-600">{isProcessing ? "Processing your request..." : "Checking authentication..."}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{activeTab === "login" ? "Sign In" : "Create Account"} | Little Origins Books</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-md">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSubmit={handleLogin} onGoogleSignIn={handleGoogleLogin} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSubmit={handleRegister} onGoogleSignIn={handleGoogleLogin} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Auth;
