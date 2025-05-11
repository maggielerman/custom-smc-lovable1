
import React from "react";
import { useBookContext } from "@/context/BookContext";

const CheckoutSummary: React.FC = () => {
  const { cartItems } = useBookContext();
  
  // Convert cents to dollars for display
  const subtotal = cartItems.reduce((total, item) => total + item.price, 0) / 100;
  const shipping = 5.00;
  const total = subtotal + shipping;

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between mb-2">
        <span>Book Price</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CheckoutSummary;
