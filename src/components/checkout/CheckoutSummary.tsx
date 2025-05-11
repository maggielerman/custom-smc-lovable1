
import React from "react";

const CheckoutSummary: React.FC = () => {
  return (
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
  );
};

export default CheckoutSummary;
