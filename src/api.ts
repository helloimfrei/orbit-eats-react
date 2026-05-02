export type Restaurant = {
  id: number;
  name: string;
  galaxy: string;
  cuisine: string;
  distance: string;
  deliveryTime: string;
  tag: string;
  image: string;
  rating: number;
  deliveryFee: number;
  description: string;
  address: string;
  menuItems: MenuItem[];
};

export type MenuItem = {
  name: string;
  description: string;
  price: number;
};

export type RestaurantFilters = {
  search?: string;
  galaxy?: string;
  cuisine?: string;
  tag?: string;
  maxDistance?: string;
  maxDelivery?: string;
  sort?: string;
};

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export type SampleOrder = {
  store: string;
  address: string;
  phone: string;
  payment: string;
  items: OrderItem[];
  tax: number;
  serviceFee: number;
  deliveryFee: number;
  savings: number;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data as T;
}

export async function fetchRestaurants(filters: RestaurantFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const data = await request<{ restaurants: Restaurant[] }>(
    `/api/restaurants${params.toString() ? `?${params.toString()}` : ""}`
  );
  return data.restaurants;
}

export async function fetchRestaurant(id: string) {
  const data = await request<{ restaurant: Restaurant }>(`/api/restaurants/${id}`);
  return data.restaurant;
}

export async function fetchRestaurantMeta() {
  return request<{
    galaxies: string[];
    cuisines: string[];
    tags: string[];
  }>("/api/restaurants/meta");
}

export async function fetchSampleOrder() {
  return request<SampleOrder>("/api/order/sample");
}

export async function submitOrder(payload: {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryFee?: number;
  tip: number;
  items: OrderItem[];
}) {
  return request<{ orderId: number; total: number }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStoredUser(): AuthUser | null {
  const raw = window.localStorage.getItem("orbitUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    window.localStorage.removeItem("orbitUser");
    window.localStorage.removeItem("orbitToken");
    return null;
  }
}

export function storeAuth(response: AuthResponse) {
  window.localStorage.setItem("orbitUser", JSON.stringify(response.user));
  window.localStorage.setItem("orbitToken", response.token);
  window.dispatchEvent(new Event("orbit-auth-change"));
}

export function clearAuth() {
  window.localStorage.removeItem("orbitUser");
  window.localStorage.removeItem("orbitToken");
  window.dispatchEvent(new Event("orbit-auth-change"));
}
