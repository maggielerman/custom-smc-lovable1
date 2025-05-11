
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-16 w-16 text-book-green" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for your order. Your custom book is now being created with care just for you.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between py-2 border-b">
                <span>Custom Book</span>
                <span>$24.99</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total</span>
                <span>$29.99</span>
              </div>
            </div>
            
            <div className="bg-book-red/10 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-2">What's Next?</h3>
              <p className="text-gray-700 mb-4">
                We've sent a confirmation to your email with your order details. Your custom book will be printed and shipped within 3-5 business days.
              </p>
              <p className="text-gray-700">
                Order #: ORD-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-book-green hover:bg-green-600"
              >
                <Home className="h-4 w-4" />
                Return to Home Page
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
