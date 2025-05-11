
import React from "react";
import { useBookContext } from "@/context/BookContext";

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
      
      {/* Microdata for product */}
      <div itemScope itemType="https://schema.org/Product" className="hidden">
        {cartItems.map((item, index) => (
          <div key={index}>
            <meta itemProp="name" content={item.title || "Personalized Children's Book"} />
            <meta itemProp="description" content="A customized children's book explaining donor conception" />
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="price" content={(item.price / 100).toString()} />
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="availability" content="https://schema.org/InStock" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;
