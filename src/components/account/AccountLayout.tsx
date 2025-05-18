
import React, { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import AccountNav from "./AccountNav";
import { toast } from "sonner";

export default function AccountLayout() {
  const { user, loading, isLoaded } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoaded && !user) {
      console.log("AccountLayout: No user found, redirecting to auth");
      toast.error("Please sign in to access your account");
      navigate("/auth", { state: { from: { pathname: "/profile" } } });
    }
  }, [user, isLoaded, navigate]);

  if (loading || !isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-book-red" />
      </div>
    );
  }
  
  // This check ensures the redirect happens properly
  if (isLoaded && !user) {
    return <Navigate to="/auth" state={{ from: { pathname: "/profile" } }} />;
  }
  
  return (
    <>
      <Helmet>
        <title>My Account | Little Origins Books</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          My Account
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <aside className="bg-white p-4 rounded-lg border shadow-sm hidden md:block">
              <AccountNav />
            </aside>
            
            <main>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
