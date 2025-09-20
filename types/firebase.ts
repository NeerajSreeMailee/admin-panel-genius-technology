import { Timestamp } from 'firebase/firestore'

// Firebase collection types based on your actual data structure

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'user' | 'admin'
  subscribeNewsletter: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Quotation {
  id: string
  budget: string
  company: string
  email: string
  fullName: string
  message: string
  phone: string
  products: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
}

export interface Order {
  id: string
  customerId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
  name: string
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  imageUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}