import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'
import { User, Quotation } from '@/types/firebase'

export async function getUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export async function getQuotations(): Promise<Quotation[]> {
  try {
    const quotationsRef = collection(db, 'quotations')
    const q = query(quotationsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Quotation))
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return []
  }
}

export async function getRecentUsers(limitCount: number = 5): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
  } catch (error) {
    console.error('Error fetching recent users:', error)
    return []
  }
}

export async function getRecentQuotations(limitCount: number = 5): Promise<Quotation[]> {
  try {
    const quotationsRef = collection(db, 'quotations')
    const q = query(quotationsRef, orderBy('createdAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Quotation))
  } catch (error) {
    console.error('Error fetching recent quotations:', error)
    return []
  }
}