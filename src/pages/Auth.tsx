
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/";
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
    await signIn(email, password);
    // No need to navigate, useEffect will handle it
  };

  const handleRegister = async (email: string, password: string, firstName: string, lastName: string) => {
    const metadata = {
      first_name: firstName || undefined,
      last_name: lastName || undefined
    };
    
    await signUp(email, password, metadata);
    setActiveTab("login");
  };

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-book-red"></div>
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
            <LoginForm onSubmit={handleLogin} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSubmit={handleRegister} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Auth;
