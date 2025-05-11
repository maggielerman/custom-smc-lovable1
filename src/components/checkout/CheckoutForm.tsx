
import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import CheckoutStepDetails from "./steps/CheckoutStepDetails";
import CheckoutStepPayment from "./steps/CheckoutStepPayment";
import CheckoutStepShipping from "./steps/CheckoutStepShipping";
import CheckoutSummary from "./CheckoutSummary";

interface CheckoutFormProps {
  bookName: string;
}

type CheckoutStep = 'details' | 'payment' | 'shipping';

const CheckoutForm: React.FC<CheckoutFormProps> = ({ bookName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('details');
  
  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      toast.error("Stripe has not been properly initialized");
      return;
    }
    
    setLoading(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      // Create a payment method using the card element
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name,
          email,
          address: {
            line1: address,
            city,
            postal_code: zip,
            country,
          }
        }
      });
      
      if (error) {
        throw new Error(error.message || "Payment failed");
      }
      
      // In a real implementation, you would send the payment method ID to your server
      // to create a payment intent and confirm the payment
      
      // Simulate successful payment for now
      console.log("Payment method created successfully:", paymentMethod.id);
      toast.success("Order placed successfully! Check your email for confirmation.");
      
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 1500);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step === 'details') {
      if (!name || !email) {
        toast.error("Please fill in all required fields");
        return;
      }
      setStep('payment');
    } else if (step === 'payment') setStep('shipping');
  };
  
  const prevStep = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('details');
  };
  
  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">{bookName}</h2>
        <div className="text-xl font-bold text-book-red">$29.99</div>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center text-white",
            step === 'details' ? "bg-book-red" : "bg-gray-300"
          )}>
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div className={cn("h-1 w-16", step === 'details' ? "bg-gray-300" : "bg-book-red")}></div>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center text-white",
            step === 'payment' ? "bg-book-red" : step === 'details' ? "bg-gray-300" : "bg-book-green"
          )}>
            <CreditCard className="h-5 w-5" />
          </div>
          <div className={cn("h-1 w-16", step === 'shipping' ? "bg-book-red" : "bg-gray-300")}></div>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center text-white",
            step === 'shipping' ? "bg-book-red" : "bg-gray-300"
          )}>
            <Truck className="h-5 w-5" />
          </div>
        </div>
      </div>
      
      <form className="space-y-6">
        {step === 'details' && (
          <CheckoutStepDetails
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            onNext={nextStep}
          />
        )}
        
        {step === 'payment' && (
          <CheckoutStepPayment
            onPrev={prevStep}
            onNext={nextStep}
          />
        )}
        
        {step === 'shipping' && (
          <CheckoutStepShipping
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            zip={zip}
            setZip={setZip}
            country={country}
            setCountry={setCountry}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
            stripeAvailable={!!stripe}
          />
        )}
      </form>
      
      <CheckoutSummary />
    </div>
  );
};

// Import here to avoid circular dependencies
import { CardElement } from "@stripe/react-stripe-js";

export default CheckoutForm;
