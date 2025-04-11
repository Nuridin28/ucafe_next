import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`
}

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

export function validateEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return passwordRegex.test(password)
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}
