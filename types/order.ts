import type { FoodItem } from "./food"

export interface OrderItem {
  id: string
  quantity: number
  food: FoodItem
}

export interface Order {
  id: string
  orderNumber: string
  user: {
    id: string
    name: string
    email: string
  }
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}
