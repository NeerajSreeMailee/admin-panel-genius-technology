import { collection, getDocs, query, orderBy, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Product, Quotation, OrderSummary, PaymentSummary } from '@/components/tables'

// Fetch Products from mobile collection (title is document ID)
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'mobile')
    const snapshot = await getDocs(productsRef)

    return snapshot.docs.map(doc => ({
      id: doc.id, // This is the title/product name
      title: doc.id, // Document ID is the title
      brand: doc.data().Brand || '',
      category: doc.data().Category || '',
      description: doc.data().description || '',
      images: doc.data().images || [],
      price: doc.data().price || 0,
      type: doc.data().type || '',
      available_quantity: doc.data().available_quantity || 0,
    })).sort((a, b) => a.brand.localeCompare(b.brand)) // Sort by brand
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Fetch Quotations
export async function fetchQuotations(): Promise<Quotation[]> {
  try {
    const quotationsRef = collection(db, 'quotation')
    const q = query(quotationsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      budget: doc.data().budget || '',
      company: doc.data().company || '',
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      email: doc.data().email || '',
      fullName: doc.data().fullName || '',
      message: doc.data().message || '',
      phone: doc.data().phone || '',
      products: doc.data().products || '',
      status: doc.data().status || 'pending',
    }))
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return []
  }
}

// Fetch Orders (summary view)
export async function fetchOrders(): Promise<OrderSummary[]> {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        orderId: data.orderId || doc.id,
        customerEmail: data.customerEmail || '',
        customerPhone: data.customerPhone || '',
        status: data.status || '',
        paymentStatus: data.paymentStatus || '',
        paymentMethod: data.paymentMethod || '',
        total: data.total || 0,
        subtotal: data.subtotal || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        itemCount: data.items?.length || 0,
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// Fetch Payments (from orders collection)
export async function fetchPayments(): Promise<PaymentSummary[]> {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => {
      const data = doc.data()
      const paymentDetails = data.paymentDetails || {}

      return {
        orderId: data.orderId || doc.id,
        paymentId: data.paymentId || paymentDetails.paymentTransactionId || doc.id,
        customerEmail: data.customerEmail || '',
        paymentMethod: data.paymentMethod || paymentDetails.method || 'N/A',
        paymentStatus: data.paymentStatus || paymentDetails.paymentStatus || 'pending',
        amount: paymentDetails.amount || data.total || 0,
        currency: paymentDetails.currency || 'INR',
        fee: paymentDetails.fee || 0,
        tax: paymentDetails.tax || data.tax || 0,
        createdAt: paymentDetails.created_at?.toDate() || data.createdAt?.toDate() || new Date(),
        razorpayOrderId: paymentDetails.razorpayOrderId || '',
        paymentTransactionId: paymentDetails.paymentTransactionId || paymentDetails.paymentSignature || '',
      }
    }) // Removed filter - show all orders as payment records
  } catch (error) {
    console.error('Error fetching payments:', error)
    return []
  }
}

// Fetch dashboard stats
export async function fetchDashboardStats() {
  try {
    const [products, orders, quotations] = await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchQuotations()
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'delivered').length
    const pendingQuotations = quotations.filter(q => q.status === 'pending').length

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalQuotations: quotations.length,
      pendingQuotations,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalQuotations: 0,
      pendingQuotations: 0,
    }
  }
}

// Add new product to mobile collection
export async function addProduct(productData: Omit<Product, 'id'>) {
  try {
    // Use the title as the document ID
    const productRef = doc(db, 'mobile', productData.title)

    // Prepare the data for Firebase (exclude id and title from the document data)
    const { title, ...firebaseData } = productData

    await setDoc(productRef, {
      Brand: firebaseData.brand, // Note: Firebase uses 'Brand' with capital B
      Category: firebaseData.category, // Note: Firebase uses 'Category' with capital C
      description: firebaseData.description,
      images: firebaseData.images || [],
      price: firebaseData.price,
      type: firebaseData.type,
      available_quantity: firebaseData.available_quantity,
    })

    console.log('Product added successfully with ID:', productData.title)
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

// Update existing product in mobile collection
export async function updateProduct(productId: string, productData: Omit<Product, 'id'>) {
  try {
    const productRef = doc(db, 'mobile', productId)
    
    // Prepare the data for Firebase (exclude id and title from the document data)
    const { title, ...firebaseData } = productData
    
    await updateDoc(productRef, {
      Brand: firebaseData.brand, // Note: Firebase uses 'Brand' with capital B
      Category: firebaseData.category, // Note: Firebase uses 'Category' with capital C
      description: firebaseData.description,
      images: firebaseData.images || [],
      price: firebaseData.price,
      type: firebaseData.type,
      available_quantity: firebaseData.available_quantity,
    })
    
    console.log('Product updated successfully:', productId)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Fetch recent orders (limited number)
export async function fetchRecentOrders(limitCount: number = 5): Promise<OrderSummary[]> {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.slice(0, limitCount).map(doc => {
      const data = doc.data()
      return {
        orderId: data.orderId || doc.id,
        customerEmail: data.customerEmail || '',
        customerPhone: data.customerPhone || '',
        status: data.status || '',
        paymentStatus: data.paymentStatus || '',
        paymentMethod: data.paymentMethod || '',
        total: data.total || 0,
        subtotal: data.subtotal || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        itemCount: data.items?.length || 0,
      }
    })
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return []
  }
}