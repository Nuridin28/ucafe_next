"use client";

import { FoodItem } from "@/types/food";
import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItemType[];
  total: number;
  addItem: (item: FoodItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  getItemQuantity: (id: string) => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, []);

  // Update total whenever items change
  useEffect(() => {
    const newTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (food: FoodItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === food.id);

      if (existingItem) {
        // Don't exceed available quantity
        const newQuantity = Math.min(existingItem.quantity + 1, food.quantity);

        return prevItems.map((item) =>
          item.id === food.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: food.id,
            name: food.name,
            price: food.price,
            quantity: 1,
            maxQuantity: food.quantity,
            imageUrl: food.imageUrl,
          },
        ];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter((item) => item.id !== id);
      }
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === id) {
          // Don't exceed available quantity
          const newQuantity = Math.min(quantity, item.maxQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const getItemQuantity = (id: string) => {
    const item = items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        removeItem,
        updateItemQuantity,
        getItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
