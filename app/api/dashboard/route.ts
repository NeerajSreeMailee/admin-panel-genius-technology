import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'

// Helper function to convert Firestore Timestamp to JavaScript Date
function toDate(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  return new Date(timestamp)
}

// Helper function to get the month name from a date
function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    switch (type) {
      case 'sales':
        return await getSalesData()
      case 'categories':
        return await getCategoryData()
      case 'revenue':
        return await getRevenueData()
      case 'order-status':
        return await getOrderStatusData()
      default:
        const [sales, categories, revenue, orderStatus] = await Promise.all([
          getSalesData(),
          getCategoryData(),
          getRevenueData(),
          getOrderStatusData()
        ])
        return NextResponse.json({
          sales: sales,
          categories: categories,
          revenue: revenue,
          orderStatus: orderStatus
        })
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

async function getSalesData() {
  try {
    // Fetch orders from the last 7 months
    const ordersRef = collection(db, 'orders')
    const ordersSnapshot = await getDocs(ordersRef)
    
    // Group orders by month
    const ordersByMonth: Record<string, { count: number, revenue: number }> = {}
    
    ordersSnapshot.forEach(doc => {
      const order = doc.data()
      const orderDate = toDate(order.createdAt)
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`
      const monthName = getMonthName(orderDate)
      
      if (!ordersByMonth[monthKey]) {
        ordersByMonth[monthKey] = { count: 0, revenue: 0 }
      }
      
      ordersByMonth[monthKey].count += 1
      ordersByMonth[monthKey].revenue += order.total || 0
    })
    
    // Convert to array format for the chart
    const salesData = Object.entries(ordersByMonth).map(([key, data]) => {
      const [year, monthIndex] = key.split('-')
      const date = new Date(parseInt(year), parseInt(monthIndex))
      const monthName = getMonthName(date)
      
      return {
        name: monthName,
        sales: data.count,
        revenue: Math.round(data.revenue)
      }
    })
    
    // Sort by date
    salesData.sort((a, b) => {
      const aIndex = Object.keys(ordersByMonth).findIndex(key => 
        ordersByMonth[key].count === a.sales && ordersByMonth[key].revenue === a.revenue
      )
      const bIndex = Object.keys(ordersByMonth).findIndex(key => 
        ordersByMonth[key].count === b.sales && ordersByMonth[key].revenue === b.revenue
      )
      return aIndex - bIndex
    })
    
    return NextResponse.json(salesData)
  } catch (error) {
    console.error('Error fetching sales data:', error)
    return NextResponse.json([])
  }
}

async function getCategoryData() {
  try {
    // Fetch products and group by category
    const productsRef = collection(db, 'products')
    const productsSnapshot = await getDocs(productsRef)
    
    const categories: Record<string, number> = {}
    
    productsSnapshot.forEach(doc => {
      const product = doc.data()
      const category = product.category || 'Uncategorized'
      
      if (!categories[category]) {
        categories[category] = 0
      }
      
      categories[category] += 1
    })
    
    // Convert to array format for the chart
    const categoryData = Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }))
    
    return NextResponse.json(categoryData)
  } catch (error) {
    console.error('Error fetching category data:', error)
    return NextResponse.json([])
  }
}

async function getRevenueData() {
  try {
    // Fetch orders from the last 7 months
    const ordersRef = collection(db, 'orders')
    const ordersSnapshot = await getDocs(ordersRef)
    
    // Group revenue by month
    const revenueByMonth: Record<string, number> = {}
    
    ordersSnapshot.forEach(doc => {
      const order = doc.data()
      const orderDate = toDate(order.createdAt)
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`
      const monthName = getMonthName(orderDate)
      
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = 0
      }
      
      revenueByMonth[monthKey] += order.total || 0
    })
    
    // Convert to array format for the chart
    const revenueData = Object.entries(revenueByMonth).map(([key, revenue]) => {
      const [year, monthIndex] = key.split('-')
      const date = new Date(parseInt(year), parseInt(monthIndex))
      const monthName = getMonthName(date)
      
      return {
        name: monthName,
        revenue: Math.round(revenue)
      }
    })
    
    // Sort by date
    revenueData.sort((a, b) => {
      const aIndex = Object.keys(revenueByMonth).findIndex(key => 
        revenueByMonth[key] === a.revenue
      )
      const bIndex = Object.keys(revenueByMonth).findIndex(key => 
        revenueByMonth[key] === b.revenue
      )
      return aIndex - bIndex
    })
    
    return NextResponse.json(revenueData)
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json([])
  }
}

async function getOrderStatusData() {
  try {
    // Fetch orders and group by status
    const ordersRef = collection(db, 'orders')
    const ordersSnapshot = await getDocs(ordersRef)
    
    const statusCounts: Record<string, number> = {}
    
    ordersSnapshot.forEach(doc => {
      const order = doc.data()
      const status = order.status || 'unknown'
      
      if (!statusCounts[status]) {
        statusCounts[status] = 0
      }
      
      statusCounts[status] += 1
    })
    
    // Convert to array format for the chart
    const orderStatusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }))
    
    return NextResponse.json(orderStatusData)
  } catch (error) {
    console.error('Error fetching order status data:', error)
    return NextResponse.json([])
  }
}