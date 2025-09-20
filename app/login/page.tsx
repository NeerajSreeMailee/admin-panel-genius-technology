"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/Authcontext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("LoginPage useEffect triggered", { user, isAdmin });
    // If user is already authenticated and is admin, redirect to dashboard
    if (user && isAdmin) {
      console.log("User is authenticated and is admin, redirecting to dashboard");
      // Force a redirect using window.location for more reliable navigation
      if (typeof window !== 'undefined') {
        console.log("Using window.location for redirect");
        window.location.href = '/dashboard';
      } else {
        console.log("Using router.push for redirect");
        router.push("/dashboard");
      }
    }
  }, [user, isAdmin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login form submitted", { email });
    setIsLoading(true)
    
    try {
      console.log("Attempting to sign in...");
      await signIn(email, password)
      console.log("Sign in successful");
      
      // Use window.location for more reliable redirect after login
      console.log("Redirecting to dashboard using window.location");
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      } else {
        // Fallback to router.push if window is not available
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access the admin dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}