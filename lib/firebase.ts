

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDzYBv_8cCVKUKgq8k3sTv7wtKohHUJEg0",
  authDomain: "genius-technology-21eca.firebaseapp.com",
  databaseURL: "https://genius-technology-21eca-default-rtdb.firebaseio.com",
  projectId: "genius-technology-21eca",
  storageBucket: "genius-technology-21eca.firebasestorage.app",
  messagingSenderId: "142866849345",
  appId: "1:142866849345:web:53517864fd928b307bf0c0",
  measurementId: "G-BRKXY2BM4E"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Collection references
export const collections = {
  orders: 'orders',
  categories: 'categories',
  users: 'users',
  quotation: 'quotation'
}
