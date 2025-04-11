// Import types from the types folder
import type { FoodItem } from "@/types/food"
import type { Order } from "@/types/order"
import type { User, UserProfile } from "@/types/user"
import type { CafeProfile } from "@/types/cafe"

// Authentication
export async function loginUser(email: string, password: string): Promise<User> {
  // This will be implemented by the user
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Login failed")
  }

  return await res.json()
}

export async function registerUser(name: string, email: string, password: string) {
  // This will be implemented by the user
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Registration failed")
  }

  return await res.json()
}

export async function logoutUser() {
  // This will be implemented by the user
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Logout failed")
  }

  return await res.json()
}

export async function getCurrentUser(): Promise<User> {
  // This will be implemented by the user
  const res = await fetch("/api/auth/me")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Not authenticated")
  }

  return await res.json()
}

// User Profile
export async function getUserProfile(): Promise<UserProfile> {
  // This will be implemented by the user
  const res = await fetch("/api/user/profile")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch profile")
  }

  return await res.json()
}

export async function updateUserProfile(data: { name: string }) {
  // This will be implemented by the user
  const res = await fetch("/api/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to update profile")
  }

  return await res.json()
}

// Cafe Profile
export async function getCafeProfile(): Promise<CafeProfile> {
  // This will be implemented by the user
  const res = await fetch("/api/admin/cafe")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch cafe profile")
  }

  return await res.json()
}

export async function updateCafeProfile(data: CafeProfile) {
  // This will be implemented by the user
  const res = await fetch("/api/admin/cafe", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to update cafe profile")
  }

  return await res.json()
}

// Food Items
export async function getAllFood(): Promise<FoodItem[]> {
  // This will be implemented by the user
  const res = await fetch("/api/food")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch food items")
  }

  return await res.json()
}

export async function getFoodRecommendations(): Promise<FoodItem[]> {
  // This will be implemented by the user
  const res = await fetch("/api/food/recommendations")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch food recommendations")
  }

  return await res.json()
}

export async function getFoodById(id: string): Promise<FoodItem> {
  // This will be implemented by the user
  const res = await fetch(`/api/food/${id}`)

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch food item")
  }

  return await res.json()
}

export async function createFood(data: FormData) {
  // This will be implemented by the user
  const res = await fetch("/api/admin/food", {
    method: "POST",
    body: data,
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to create food item")
  }

  return await res.json()
}

export async function updateFood(id: string, data: FormData) {
  // This will be implemented by the user
  const res = await fetch(`/api/admin/food/${id}`, {
    method: "PUT",
    body: data,
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to update food item")
  }

  return await res.json()
}

export async function deleteFood(id: string) {
  // This will be implemented by the user
  const res = await fetch(`/api/admin/food/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to delete food item")
  }

  return await res.json()
}

// Orders
export async function createOrder(data: {
  items: { foodId: string; quantity: number }[]
}) {
  // This will be implemented by the user
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to create order")
  }

  return await res.json()
}

export async function getUserOrders(): Promise<Order[]> {
  // This will be implemented by the user
  const res = await fetch("/api/user/orders")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch user orders")
  }

  return await res.json()
}

export async function getAllOrders(): Promise<Order[]> {
  // This will be implemented by the user
  const res = await fetch("/api/admin/orders")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch all orders")
  }

  return await res.json()
}

export async function updateOrderStatus(id: string, status: string) {
  // This will be implemented by the user
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to update order status")
  }

  return await res.json()
}

// Admin Dashboard
export async function getAdminDashboardStats() {
  // This will be implemented by the user
  const res = await fetch("/api/admin/dashboard")

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || "Failed to fetch admin dashboard stats")
  }

  return await res.json()
}
