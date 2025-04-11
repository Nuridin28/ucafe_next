"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { UserNavbar } from "@/components/user-navbar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "user")) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  )
}
