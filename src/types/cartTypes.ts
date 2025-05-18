
import { CartItem } from "./bookTypes";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  saveCartWithName: (name: string) => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isLoading?: boolean;
}
