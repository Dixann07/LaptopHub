"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import CustomerLayout from "@/components/layouts/customer-layout"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  description: string
  image: string
}

export default function WishlistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])

  // Check if user is logged in as customer
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userType = localStorage.getItem("userType")

    if (!isLoggedIn || userType !== "customer") {
      router.push("/login")
    }
  }, [router])

  // Load products, wishlist, and cart from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem("inventory")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }

    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist))
    }

    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Get wishlist items with product details
  const wishlistItems = wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean) as Product[]

  // Remove from wishlist
  const removeFromWishlist = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    setWishlist(wishlist.filter((itemId) => itemId !== id))

    toast({
      title: "Removed from wishlist",
      description: `${product.name} has been removed from your wishlist.`,
    })
  }

  // Add to cart
  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (product.quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    const existingCartItem = cart.find((item) => item.id === productId)

    if (existingCartItem) {
      // Check if we're trying to add more than available
      if (existingCartItem.quantity >= product.quantity) {
        toast({
          title: "Maximum Quantity Reached",
          description: "You've reached the maximum available quantity for this product.",
          variant: "destructive",
        })
        return
      }

      // Update quantity
      const updatedCart = cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
      setCart(updatedCart)
    } else {
      // Add new item
      setCart([...cart, { id: productId, quantity: 1 }])
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // Get stock status based on quantity
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Out of Stock", color: "destructive" }
    if (quantity < 5) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
  }

  return (
    <CustomerLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love to your wishlist and find them here anytime.</p>
          <Button onClick={() => router.push("/customer/dashboard")}>Discover Products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const stockStatus = getStockStatus(product.quantity)
            return (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover" fill />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
                    <Badge variant="outline" className="font-semibold">
                      ${product.price.toFixed(2)}
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
                  <Button className="w-full" onClick={() => addToCart(product.id)} disabled={product.quantity <= 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </CustomerLayout>
  )
}
