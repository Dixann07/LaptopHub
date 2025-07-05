"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getProducts, addToCart, initializeInventory } from "@/lib/inventory"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [priceRange, setPriceRange] = useState<number[]>([0, 500000])
  const [maxPrice, setMaxPrice] = useState<number>(500000)
  const { toast } = useToast()

  useEffect(() => {
    initializeInventory()
    const loadProducts = () => {
      const allProducts = getProducts()
      setProducts(allProducts)
      setFilteredProducts(allProducts)

      // Calculate max price for slider
      if (allProducts.length > 0) {
        const max = Math.max(...allProducts.map((p) => p.price))
        setMaxPrice(max)
        setPriceRange([0, max])
      }
    }

    loadProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, categoryFilter, sortBy, priceRange])

  const handleAddToCart = (productId: string, productName: string) => {
    const result = addToCart(productId, 1)

    if (result.success) {
      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Laptops</h1>
          <p className="text-gray-600">Browse our complete collection of laptops for every need and budget.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Price Range: Rs. {priceRange[0].toLocaleString("en-IN")} - Rs. {priceRange[1].toLocaleString("en-IN")}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={maxPrice}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} laptops
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No laptops found</h3>
            <p className="text-gray-600">
              {products.length === 0
                ? "No laptops are currently available. Please check back later."
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.quantity <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm px-3 py-1">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                    {product.quantity > 0 && product.quantity < 5 && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-white text-xs">Low Stock</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">{product.name}</CardTitle>
                    <div className="flex items-center gap-1 text-yellow-500 ml-2">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs text-gray-600">4.5</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="space-y-1 mb-3">
                    {product.specifications?.processor && (
                      <div className="text-xs text-gray-500 line-clamp-1">
                        <span className="font-medium">CPU:</span> {product.specifications.processor}
                      </div>
                    )}
                    {product.specifications?.ram && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">RAM:</span> {product.specifications.ram}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">Rs. {product.price.toLocaleString("en-IN")}</div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Details
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(product.id, product.name)}
                    disabled={product.quantity <= 0}
                    size="sm"
                    className="flex-1"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
