
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"login" | "register">("login");

  // Set active tab based on query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  // If user is already logged in, redirect to home or the page they were trying to access
  useEffect(() => {
    if (isLoaded && user) {
      console.log("Auth page: User authenticated, redirecting", { user: user.id });
      const from = location.state?.from?.pathname || "/";
      console.log(`Auth page: Redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [user, isLoaded, navigate, location]);

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-book-red mb-4" />
        <p className="text-gray-600">Checking authentication...</p>
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
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-md rounded-lg p-8 border border-gray-200",
                  headerTitle: "text-xl font-semibold text-gray-800",
                  headerSubtitle: "text-sm text-gray-500",
                  formButtonPrimary: "bg-book-red hover:bg-red-700 text-white rounded-md px-4 py-2 font-medium",
                  formFieldInput: "rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-book-red focus:border-transparent",
                  footerActionLink: "text-book-red hover:text-red-700 font-medium",
                  socialButtonsBlockButton: "border border-gray-300 rounded-md p-2.5 hover:bg-gray-50",
                  formFieldLabel: "text-sm font-medium text-gray-700",
                  dividerText: "text-sm text-gray-500",
                  formFieldAction: "text-sm text-book-red hover:text-red-700",
                  identityPreviewEditButton: "text-book-red hover:text-red-700"
                }
              }}
              signUpUrl="/auth?tab=register"
              redirectUrl={location.state?.from?.pathname || "/"}
            />
          </TabsContent>
          
          <TabsContent value="register">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-md rounded-lg p-8 border border-gray-200",
                  headerTitle: "text-xl font-semibold text-gray-800",
                  headerSubtitle: "text-sm text-gray-500",
                  formButtonPrimary: "bg-book-red hover:bg-red-700 text-white rounded-md px-4 py-2 font-medium",
                  formFieldInput: "rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-book-red focus:border-transparent",
                  footerActionLink: "text-book-red hover:text-red-700 font-medium",
                  socialButtonsBlockButton: "border border-gray-300 rounded-md p-2.5 hover:bg-gray-50",
                  formFieldLabel: "text-sm font-medium text-gray-700",
                  dividerText: "text-sm text-gray-500",
                  formFieldAction: "text-sm text-book-red hover:text-red-700",
                  identityPreviewEditButton: "text-book-red hover:text-red-700"
                }
              }}
              signInUrl="/auth"
              redirectUrl="/"
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Auth;
