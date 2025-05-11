
import React from "react";
import { Button } from "@/components/ui/button";

interface CheckoutStepShippingProps {
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  zip: string;
  setZip: (zip: string) => void;
  country: string;
  setCountry: (country: string) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  stripeAvailable: boolean;
}

const CheckoutStepShipping: React.FC<CheckoutStepShippingProps> = ({
  address,
  setAddress,
  city,
  setCity,
  zip,
  setZip,
  country, 
  setCountry,
  onPrev,
  onSubmit,
  loading,
  stripeAvailable,
}) => {
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
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button 
          onClick={onSubmit} 
          className="bg-book-green hover:bg-green-600 text-white"
          disabled={!stripeAvailable || loading}
        >
          {loading ? "Processing..." : "Complete Order"}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutStepShipping;
