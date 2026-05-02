import type { MenuItem, Restaurant } from "./api";

const CART_KEY = "orbitCart";
export const CART_EVENT = "orbit-cart-change";

export type CartItem = MenuItem & {
  quantity: number;
};

export type Cart = {
  restaurantId: number;
  restaurantName: string;
  deliveryFee: number;
  items: CartItem[];
};

function emitCartChange() {
  window.dispatchEvent(new Event(CART_EVENT));
}

export function getCart(): Cart | null {
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return null;

  try {
    const cart = JSON.parse(raw) as Cart;
    return cart.items.length > 0 ? cart : null;
  } catch {
    window.localStorage.removeItem(CART_KEY);
    return null;
  }
}

export function saveCart(cart: Cart | null) {
  if (!cart || cart.items.length === 0) {
    window.localStorage.removeItem(CART_KEY);
  } else {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  emitCartChange();
}

export function addToCart(restaurant: Restaurant, item: MenuItem) {
  const currentCart = getCart();
  const cart: Cart =
    currentCart?.restaurantId === restaurant.id
      ? currentCart
      : {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          deliveryFee: restaurant.deliveryFee,
          items: [],
        };
  const existingItem = cart.items.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
}

export function updateCartItemQuantity(itemName: string, quantity: number) {
  const cart = getCart();
  if (!cart) return;

  cart.items = cart.items
    .map((item) => item.name === itemName ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);

  saveCart(cart);
}

export function clearCart() {
  saveCart(null);
}

export function getCartItemCount() {
  return getCart()?.items.reduce((total, item) => total + item.quantity, 0) || 0;
}
