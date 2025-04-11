export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface UserProfile {
  id: string
  name: string
  email: string
}
