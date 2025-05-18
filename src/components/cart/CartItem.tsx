
import React from "react";
import { useCart } from "@/context/CartContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    title: string;
    price: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-gray-500">Personalized children's book</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium">${item.price.toFixed(2)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-500"
          onClick={() => removeFromCart(item.id)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
