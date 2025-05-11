
import React, { useState } from "react";
import { useBookContext } from "@/context/BookContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CreditCard, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

// Using the provided Stripe publishable key
const stripePromise = loadStripe("pk_test_51RNY1lFpmfNltxVgEAw8VQ9RaSsfW6zbfBL6qPOXAqY0FmnxvlXOXKHBzypgo3DFoZ6zKPzjc6rTWKabx4Onbo1x00EixeAYJL");

const BookCheckout: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, childName } = useBookContext();

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <CheckoutForm bookName={childName ? `${childName}'s Special Story` : "Your Special Story"} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

interface CheckoutFormProps {
  bookName: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ bookName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'shipping'>('details');
  
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
      return;
    }
    
    setLoading(true);
    
    // In a real implementation, you would:
    // 1. Send order details to your backend
    // 2. Create a payment intent with Stripe
    // 3. Confirm the payment with the card element
    
    try {
      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This is where you'd normally process the actual payment
      // const { paymentMethod, error } = await stripe.createPaymentMethod({
      //   type: 'card',
      //   card: elements.getElement(CardElement)!,
      //   billing_details: { name, email }
      // });
      
      toast.success("Order placed successfully! Check your email for confirmation.");
      setTimeout(() => {
        window.location.href = '/order-confirmation';
      }, 1000);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step === 'details') setStep('payment');
    else if (step === 'payment') setStep('shipping');
  };
  
  const prevStep = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('details');
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-book-red focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-book-red focus:outline-none"
                required
              />
            </div>
            <Button onClick={nextStep} className="w-full mt-4 bg-book-red hover:bg-red-600">Continue to Payment</Button>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} className="bg-book-red hover:bg-red-600">Continue to Shipping</Button>
            </div>
          </div>
        );
      case 'shipping':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-book-red focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-book-red focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-book-red focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-book-red focus:outline-none"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-book-green hover:bg-green-600 text-white"
                disabled={!stripe || loading}
              >
                {loading ? "Processing..." : "Complete Order"}
              </Button>
            </div>
          </div>
        );
    }
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
        {renderStepContent()}
      </form>
      
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between mb-2">
          <span>Book Price</span>
          <span>$24.99</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>$29.99</span>
        </div>
      </div>
    </div>
  );
};

export default BookCheckout;
