
import React from "react";
import { Button } from "@/components/ui/button";

interface CheckoutStepDetailsProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
}

const CheckoutStepDetails: React.FC<CheckoutStepDetailsProps> = ({
  name,
  setName,
  email,
  setEmail,
  onNext,
}) => {
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
      <Button onClick={onNext} className="w-full mt-4 bg-book-red hover:bg-red-600">
        Continue to Payment
      </Button>
    </div>
  );
};

export default CheckoutStepDetails;
