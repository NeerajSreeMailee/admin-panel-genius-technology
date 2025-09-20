"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/types/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log("AuthContext useEffect initialized");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("onAuthStateChanged triggered", { firebaseUser });
      if (firebaseUser) {
        console.log("User is signed in, fetching user data from Firestore");
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = { id: firebaseUser.uid, ...userDoc.data() } as User
          console.log("User data fetched from Firestore", { userData });
          setUser(userData)
          
          // Check if user is admin
          const userIsAdmin = userData.role === 'admin'
          console.log("User admin status", { userIsAdmin, role: userData.role });
          setIsAdmin(userIsAdmin)
        } else {
          console.log("User document not found in Firestore");
        }
      } else {
        console.log("User is signed out");
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
      console.log("Auth state updated", { user, isAdmin, loading: false });
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email and password", { email });
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log("Firebase sign in successful", { userId: result.user.uid });
      
      const userDoc = await getDoc(doc(db, "users", result.user.uid))
      console.log("Fetching user document from Firestore", { exists: userDoc.exists() });
      
      if (userDoc.exists()) {
        const userData = { id: result.user.uid, ...userDoc.data() } as User
        console.log("User data retrieved", { userData });
        setUser(userData)
        
        // Check if user is admin
        const userIsAdmin = userData.role === 'admin'
        console.log("Checking admin status", { userIsAdmin, role: userData.role });
        setIsAdmin(userIsAdmin)
        
        if (userIsAdmin) {
          console.log("User is admin, showing success message");
          toast.success("Welcome back!")
        } else {
          console.log("User is not admin, signing out");
          await signOut(auth)
          throw new Error("Access denied. Admin privileges required.")
        }
      } else {
        console.log("User document not found, throwing error");
        throw new Error("User data not found.")
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Sign in failed")
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      console.log("User created successfully", { userId: firebaseUser.uid });

      const userData: Omit<User, "id"> = {
        email,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        phone: '',
        role: "user", // Default role is user, not admin
        subscribeNewsletter: false,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      }

      await setDoc(doc(db, "users", firebaseUser.uid), userData)
      console.log("User document created in Firestore");

      toast.success("Account created! Welcome to Genius Technology!")
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Sign up failed")
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting Google sign in");
      const provider = new GoogleAuthProvider()
      const { user: firebaseUser } = await signInWithPopup(auth, provider)
      console.log("Google sign in successful", { userId: firebaseUser.uid });

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      console.log("Fetching user document from Firestore", { exists: userDoc.exists() });

      if (!userDoc.exists()) {
        console.log("User document not found, creating new one");
        const userData: Omit<User, "id"> = {
          email: firebaseUser.email!,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          phone: '',
          role: "user", // Default role is user, not admin
          subscribeNewsletter: false,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
        }
        await setDoc(doc(db, "users", firebaseUser.uid), userData)
        console.log("User document created in Firestore");
      }

      // Check if user is admin
      const updatedUserDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      console.log("Fetching updated user document", { exists: updatedUserDoc.exists() });
      
      if (updatedUserDoc.exists()) {
        const userData = { id: firebaseUser.uid, ...updatedUserDoc.data() } as User
        console.log("User data retrieved", { userData });
        const userIsAdmin = userData.role === 'admin'
        console.log("Checking admin status", { userIsAdmin, role: userData.role });
        setIsAdmin(userIsAdmin)
        
        if (userIsAdmin) {
          console.log("User is admin, showing success message");
          toast.success("Welcome!")
        } else {
          console.log("User is not admin, signing out");
          await signOut(auth)
          throw new Error("Access denied. Admin privileges required.")
        }
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast.error(error.message || "Google sign in failed")
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("Attempting to sign out");
      await signOut(auth)
      console.log("Sign out successful");
      toast.success("You have been successfully signed out.")
      // Redirect to login page after logout
      router.push('/login')
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error.message || "Sign out failed")
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log("Attempting password reset", { email });
      await sendPasswordResetEmail(auth, email)
      console.log("Password reset email sent");
      toast.success("Check your email for password reset instructions.")
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Password reset failed")
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
  }

  console.log("AuthContext value updated", { user, loading, isAdmin });

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  console.log("useAuth hook called", { 
    user: context.user, 
    loading: context.loading, 
    isAdmin: context.isAdmin 
  });
  return context
}