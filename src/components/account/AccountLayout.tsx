
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import AccountNav from "./AccountNav";

export default function AccountLayout() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-book-red" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
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
