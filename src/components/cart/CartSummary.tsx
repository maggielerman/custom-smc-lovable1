
import React from "react";
import { useBookContext } from "@/context/BookContext";

const CartSummary: React.FC = () => {
  const { cartTotal } = useBookContext();
  const shippingCost = 5.00;
  const total = cartTotal + shippingCost;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${cartTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>${shippingCost.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
