
import React from "react";
import { Button } from "@/components/ui/button";
import { CardElement } from "@stripe/react-stripe-js";

interface CheckoutStepPaymentProps {
  onPrev: () => void;
  onNext: () => void;
}

const CheckoutStepPayment: React.FC<CheckoutStepPaymentProps> = ({ onPrev, onNext }) => {
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
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext} className="bg-book-red hover:bg-red-600">Continue to Shipping</Button>
      </div>
    </div>
  );
};

export default CheckoutStepPayment;
