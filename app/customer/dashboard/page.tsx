"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import CustomerLayout from "@/components/layouts/customer-layout"
import { getProducts, addToCart, createOrder } from "@/lib/inventory"
import { Chatbot } from "@/components/chatbot"
import Link from "next/link"

export default function CustomerDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  // Check if user is logged in as customer
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userType = localStorage.getItem("userType")

    if (!isLoggedIn || userType !== "customer") {
      router.push("/login")
    }
  }, [router])

  // Load products from localStorage on initial render
  useEffect(() => {
    setProducts(getProducts())

    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }

    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  // Add product to cart
  const handleAddToCart = (productId: string) => {
    const result = addToCart(productId)

    if (result.success) {
      const product = products.find((p) => p.id === productId)
      toast({
        title: "Added to Cart",
        description: `${product?.name} has been added to your cart.`,
      })

      // Update cart state
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (wishlist.includes(productId)) {
      // Remove from wishlist
      setWishlist(wishlist.filter((id) => id !== productId))
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      // Add to wishlist
      setWishlist([...wishlist, productId])
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  // Create a test order for demo purposes
  const handleCreateTestOrder = () => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in first",
        variant: "destructive",
      })
      return
    }

    const user = JSON.parse(currentUser)

    // Create a test order with sample data
    const shippingAddress = {
      street: "123 Test Street",
      city: "Test City",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    }

    const result = createOrder(user.id, user.name, user.email, shippingAddress, "Test Payment")

    if (result.success) {
      toast({
        title: "Test Order Created!",
        description: `Order ${result.order?.id} has been created. Admin can now see this order in the Orders section.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  // Get unique categories from products
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))]

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Get stock status based on quantity
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Out of Stock", color: "destructive" }
    if (quantity < 5) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
  }

  return (
    <CustomerLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold">Shop Products</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Test Order Button */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateTestOrder} className="w-full">
              Create Test Order (For Demo)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This will create a test order that the admin can see in the Orders section.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No products found matching your criteria.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.quantity)
            const isInWishlist = wishlist.includes(product.id)

            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative aspect-square">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover" fill />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                      <Badge variant="outline" className="font-semibold">
                        {new Intl.NumberFormat("ne-NP", {
                          style: "currency",
                          currency: "NPR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="line-clamp-2 text-sm text-muted-foreground mb-2">{product.description}</p>
                    <Badge variant={stockStatus.color as "default" | "destructive" | "warning" | "success"}>
                      {stockStatus.label}
                    </Badge>
                  </CardContent>
                  <CardFooter className="p-4 border-t">
                    <div className="flex w-full items-center justify-between">
                      <Button
                        variant={isInWishlist ? "default" : "outline"}
                        size="icon"
                        onClick={() => toggleWishlist(product.id)}
                        className={isInWishlist ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                        <span className="sr-only">{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
                      </Button>
                      <Button onClick={() => handleAddToCart(product.id)} disabled={product.quantity <= 0}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )
          })
        )}
      </div>

      {/* Chatbot */}
      <Chatbot userType="customer" />
    </CustomerLayout>
  )
}
