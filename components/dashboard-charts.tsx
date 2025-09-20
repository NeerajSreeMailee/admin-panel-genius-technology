"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, Timestamp, query, where } from 'firebase/firestore'

// Define types for our data
interface SalesData {
  name: string
  sales: number
  revenue: number
  [key: string]: any // Add index signature
}

interface RevenueData {
  name: string
  revenue: number
  [key: string]: any // Add index signature
}

interface OrderStatusData {
  name: string
  value: number
  [key: string]: any // Add index signature
}

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true)
        
        // Fetch orders from Firestore
        const ordersRef = collection(db, 'orders')
        const ordersSnapshot = await getDocs(ordersRef)
        
        // Group orders by month
        const ordersByMonth: Record<string, { count: number, revenue: number }> = {}
        
        ordersSnapshot.forEach(doc => {
          const order = doc.data()
          const orderDate = toDate(order.createdAt)
          const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`
          
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
        
        setSalesData(salesData)
      } catch (error) {
        console.error('Error fetching sales data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSalesData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales and revenue data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales and revenue data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales Count" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function RevenueTrendChart() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        
        // Fetch orders from Firestore
        const ordersRef = collection(db, 'orders')
        const ordersSnapshot = await getDocs(ordersRef)
        
        // Group revenue by month
        const revenueByMonth: Record<string, number> = {}
        
        ordersSnapshot.forEach(doc => {
          const order = doc.data()
          const orderDate = toDate(order.createdAt)
          const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`
          
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
        
        setRevenueData(revenueData)
      } catch (error) {
        console.error('Error fetching revenue data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRevenueData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Monthly revenue growth</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function OrderStatusChart() {
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderStatusData = async () => {
      try {
        setLoading(true)
        
        // Fetch orders from Firestore
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
        
        setOrderStatusData(orderStatusData)
      } catch (error) {
        console.error('Error fetching order status data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrderStatusData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
          <CardDescription>Current status of all orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Current status of all orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}