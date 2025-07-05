"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminLayout from "@/components/layouts/admin-layout"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
  ChartLine,
  ChartArea,
  ChartPie,
} from "@/components/ui/chart"
import { getOrders, getProducts } from "@/lib/inventory"

export default function AnalyticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30days")
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [topProductsData, setTopProductsData] = useState<any[]>([])
  const [customerData, setCustomerData] = useState<any[]>([])

  // Check if user is logged in as admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userType = localStorage.getItem("userType")

    if (!isLoggedIn || userType !== "admin") {
      router.push("/login")
    }
  }, [router])

  // Load data
  useEffect(() => {
    const loadData = () => {
      const fetchedOrders = getOrders()
      const fetchedProducts = getProducts()

      setOrders(fetchedOrders)
      setProducts(fetchedProducts)

      // Process data for charts
      processData(fetchedOrders, fetchedProducts)
    }

    loadData()

    // Refresh data every 10 seconds
    const interval = setInterval(loadData, 10000)

    return () => clearInterval(interval)
  }, [])

  // Process data for charts
  const processData = (orders: any[], products: any[]) => {
    // Generate sales data by month
    const salesByMonth = generateSalesByMonth(orders)
    setSalesData(salesByMonth)

    // Generate category data
    const categorySales = generateCategoryData(orders, products)
    setCategoryData(categorySales)

    // Generate top products data
    const topProducts = generateTopProductsData(orders)
    setTopProductsData(topProducts)

    // Generate customer data
    const customerStats = generateCustomerData(orders)
    setCustomerData(customerStats)
  }

  // Generate sales data by month
  const generateSalesByMonth = (orders: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    // Initialize data with zero sales
    const data = months.map((month) => ({ date: month, sales: 0 }))

    // Fill in actual sales data
    orders.forEach((order) => {
      if (order.status !== "cancelled") {
        const orderDate = new Date(order.date)
        const monthIndex = orderDate.getMonth()
        data[monthIndex].sales += order.total
      }
    })

    // If no orders, create sample data
    if (orders.length === 0) {
      return [
        { date: "Jan", sales: 4000 },
        { date: "Feb", sales: 3000 },
        { date: "Mar", sales: 5000 },
        { date: "Apr", sales: 7000 },
        { date: "May", sales: 6000 },
        { date: "Jun", sales: 8000 },
        { date: "Jul", sales: 10000 },
        { date: "Aug", sales: 9000 },
        { date: "Sep", sales: 11000 },
        { date: "Oct", sales: 12000 },
        { date: "Nov", sales: 14000 },
        { date: "Dec", sales: 16000 },
      ]
    }

    return data
  }

  // Generate category data
  const generateCategoryData = (orders: any[], products: any[]) => {
    // Create a map of product IDs to categories
    const productCategories: Record<string, string> = {}
    products.forEach((product) => {
      productCategories[product.id] = product.category
    })

    // Count sales by category
    const categorySales: Record<string, number> = {}

    orders.forEach((order) => {
      if (order.status !== "cancelled") {
        order.items.forEach((item: any) => {
          const category = productCategories[item.id] || "Unknown"
          if (!categorySales[category]) {
            categorySales[category] = 0
          }
          categorySales[category] += item.price * item.quantity
        })
      }
    })

    // Convert to array format for chart
    const result = Object.entries(categorySales).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value),
    }))

    // If no data, return sample data
    if (result.length === 0) {
      return [
        { name: "Electronics", value: 45 },
        { name: "Furniture", value: 20 },
        { name: "Home", value: 15 },
        { name: "Office", value: 10 },
        { name: "Food", value: 10 },
      ]
    }

    return result
  }

  // Generate top products data
  const generateTopProductsData = (orders: any[]) => {
    // Count sales by product
    const productSales: Record<string, { name: string; sales: number }> = {}

    orders.forEach((order) => {
      if (order.status !== "cancelled") {
        order.items.forEach((item: any) => {
          if (!productSales[item.id]) {
            productSales[item.id] = { name: item.name, sales: 0 }
          }
          productSales[item.id].sales += item.quantity
        })
      }
    })

    // Convert to array and sort by sales
    const result = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

    // If no data, return sample data
    if (result.length === 0) {
      return [
        { name: "Premium Wireless Headphones", sales: 120 },
        { name: "Smart Fitness Watch", sales: 95 },
        { name: "Ergonomic Office Chair", sales: 85 },
        { name: "Wireless Charging Pad", sales: 70 },
        { name: "Smart LED Bulb", sales: 65 },
      ]
    }

    return result
  }

  // Generate customer data
  const generateCustomerData = (orders: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Initialize data
    const data = months.map((month) => ({ month, new: 0, returning: 0 }))

    // If no orders, return sample data
    if (orders.length === 0) {
      return [
        { month: "Jan", new: 20, returning: 30 },
        { month: "Feb", new: 25, returning: 35 },
        { month: "Mar", new: 30, returning: 40 },
        { month: "Apr", new: 35, returning: 45 },
        { month: "May", new: 40, returning: 50 },
        { month: "Jun", new: 45, returning: 55 },
        { month: "Jul", new: 50, returning: 60 },
        { month: "Aug", new: 55, returning: 65 },
        { month: "Sep", new: 60, returning: 70 },
        { month: "Oct", new: 65, returning: 75 },
        { month: "Nov", new: 70, returning: 80 },
        { month: "Dec", new: 75, returning: 85 },
      ]
    }

    // Track customers who have ordered
    const customerOrders: Record<string, Date[]> = {}

    orders.forEach((order) => {
      const customerId = order.customer.id
      const orderDate = new Date(order.date)

      if (!customerOrders[customerId]) {
        customerOrders[customerId] = []
      }

      customerOrders[customerId].push(orderDate)
    })

    // Count new vs returning customers by month
    Object.values(customerOrders).forEach((dates) => {
      dates.sort((a, b) => a.getTime() - b.getTime())

      dates.forEach((date, index) => {
        const monthIndex = date.getMonth()

        if (index === 0) {
          // First order - new customer
          data[monthIndex].new += 1
        } else {
          // Subsequent orders - returning customer
          data[monthIndex].returning += 1
        }
      })
    })

    return data
  }

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => (order.status !== "cancelled" ? sum + order.total : sum), 0)

  const totalOrders = orders.filter((order) => order.status !== "cancelled").length

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const conversionRate = 3.2 // Placeholder - would need actual visitor data

  // Colors for charts
  const colors = {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    muted: "#6b7280",
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {orders.length > 0 ? <span className="text-green-500">+12.5%</span> : <span>No orders yet</span>}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {orders.length > 0 ? <span className="text-green-500">+8.2%</span> : <span>No orders yet</span>}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {orders.length > 0 ? <span className="text-green-500">+5.1%</span> : <span>No orders yet</span>}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {orders.length > 0 ? <span className="text-red-500">-0.3%</span> : <span>No data yet</span>}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="sales">
            <LineChart className="h-4 w-4 mr-2" />
            Sales Analytics
          </TabsTrigger>
          <TabsTrigger value="products">
            <BarChart className="h-4 w-4 mr-2" />
            Product Analytics
          </TabsTrigger>
          <TabsTrigger value="customers">
            <PieChart className="h-4 w-4 mr-2" />
            Customer Analytics
          </TabsTrigger>
        </TabsList>

        {/* Sales Analytics Tab */}
        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue for the past year</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer>
                  <Chart data={salesData}>
                    <ChartLegend />
                    <ChartTooltip />
                    <ChartGrid />
                    <ChartXAxis dataKey="date" />
                    <ChartYAxis tickFormatter={(value) => `$${value}`} />
                    <ChartArea dataKey="sales" fill={`${colors.primary}20`} stroke={colors.primary} />
                    <ChartLine dataKey="sales" stroke={colors.primary} strokeWidth={2} />
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer>
                  <Chart data={categoryData}>
                    <ChartTooltip />
                    <ChartPie
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <ChartPie
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? colors.primary
                              : index === 1
                                ? colors.secondary
                                : index === 2
                                  ? colors.accent
                                  : `hsl(${220 + index * 40}, 70%, 60%)`
                          }
                        />
                      ))}
                    </ChartPie>
                    <ChartLegend />
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Product Analytics Tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with the highest sales volume</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer>
                  <Chart data={topProductsData} layout="vertical">
                    <ChartTooltip />
                    <ChartGrid horizontal={true} vertical={false} />
                    <ChartXAxis type="number" />
                    <ChartYAxis type="category" dataKey="name" width={150} />
                    <ChartBar dataKey="sales" fill={colors.primary} radius={[0, 4, 4, 0]} />
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer>
                  <Chart
                    data={
                      products.length > 0
                        ? [
                            ...Array.from(new Set(products.map((p) => p.category))).map((category) => {
                              const categoryProducts = products.filter((p) => p.category === category)
                              const inStock = categoryProducts.filter((p) => p.quantity > 5).length
                              const lowStock = categoryProducts.filter((p) => p.quantity > 0 && p.quantity <= 5).length
                              const outOfStock = categoryProducts.filter((p) => p.quantity <= 0).length
                              const total = categoryProducts.length

                              return {
                                category: category.charAt(0).toUpperCase() + category.slice(1),
                                inStock: Math.round((inStock / total) * 100),
                                lowStock: Math.round((lowStock / total) * 100),
                                outOfStock: Math.round((outOfStock / total) * 100),
                              }
                            }),
                          ]
                        : [
                            { category: "Electronics", inStock: 85, lowStock: 10, outOfStock: 5 },
                            { category: "Furniture", inStock: 70, lowStock: 20, outOfStock: 10 },
                            { category: "Home", inStock: 90, lowStock: 5, outOfStock: 5 },
                            { category: "Office", inStock: 75, lowStock: 15, outOfStock: 10 },
                            { category: "Food", inStock: 60, lowStock: 30, outOfStock: 10 },
                          ]
                    }
                  >
                    <ChartTooltip />
                    <ChartGrid />
                    <ChartXAxis dataKey="category" />
                    <ChartYAxis tickFormatter={(value) => `${value}%`} />
                    <ChartBar dataKey="inStock" stackId="a" fill={colors.secondary} name="In Stock" />
                    <ChartBar dataKey="lowStock" stackId="a" fill={colors.accent} name="Low Stock" />
                    <ChartBar dataKey="outOfStock" stackId="a" fill="#ef4444" name="Out of Stock" />
                    <ChartLegend />
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics Tab */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New vs returning customers over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer>
                  <Chart data={customerData}>
                    <ChartTooltip />
                    <ChartGrid />
                    <ChartXAxis dataKey="month" />
                    <ChartYAxis />
                    <ChartBar dataKey="new" fill={colors.primary} name="New Customers" />
                    <ChartBar dataKey="returning" fill={colors.secondary} name="Returning Customers" />
                    <ChartLegend />
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Distribution of customers by age group</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer>
                  <Chart
                    data={[
                      { age: "18-24", percentage: 15 },
                      { age: "25-34", percentage: 35 },
                      { age: "35-44", percentage: 25 },
                      { age: "45-54", percentage: 15 },
                      { age: "55+", percentage: 10 },
                    ]}
                  >
                    <ChartTooltip />
                    <ChartPie
                      dataKey="percentage"
                      nameKey="age"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <ChartPie
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? colors.primary
                              : index === 1
                                ? colors.secondary
                                : index === 2
                                  ? colors.accent
                                  : `hsl(${220 + index * 40}, 70%, 60%)`
                          }
                        />
                      ))}
                    </ChartPie>
                    <ChartLegend />
                  </Chart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
