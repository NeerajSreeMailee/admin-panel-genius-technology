"use client"

import { useAuth } from "@/context/Authcontext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("AdminProtected useEffect triggered", { user, isAdmin, loading });
    if (!loading) {
      if (!user) {
        console.log("User not authenticated, redirecting to login");
        // Use window.location for more reliable redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        } else {
          router.push('/login');
        }
        toast.error("You must be logged in to access this page.")
      } else if (!isAdmin) {
        console.log("User not admin, redirecting to login");
        // Use window.location for more reliable redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        } else {
          router.push('/login');
        }
        toast.error("Access denied. Admin privileges required.")
      } else {
        console.log("User is authenticated and is admin, allowing access");
      }
    }
  }, [user, isAdmin, loading, router])

  console.log("AdminProtected render", { user, isAdmin, loading });

  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    console.log("Rendering null because user is not authenticated or not admin");
    return null
  }

  console.log("Rendering protected content");
  return <>{children}</>
}