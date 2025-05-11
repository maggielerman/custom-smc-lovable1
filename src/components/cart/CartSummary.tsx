
import React from "react";
import { useBookContext } from "@/context/BookContext";
import ProductSchema from "@/components/seo/ProductSchema";

const CartSummary: React.FC = () => {
  const { cartItems } = useBookContext();
  
  // Convert cents to dollars for display
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0) / 100;
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
      
      {/* Structured data for products */}
      {cartItems.map((item, index) => (
        <ProductSchema
          key={index}
          bookTitle={item.title || "Personalized Children's Book"}
          price={item.price}
          description="A customized children's book explaining donor conception"
        />
      ))}
    </div>
  );
};

export default CartSummary;
