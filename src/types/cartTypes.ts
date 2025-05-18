
import { CartItem } from "./bookTypes";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  saveCartWithName: (name: string) => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isLoading?: boolean;
}
