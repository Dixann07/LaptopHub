"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  Cpu,
  HardDrive,
  Monitor,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/layouts/admin-layout"
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/inventory"

export default function InventoryPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    category: "ultrabook",
    description: "",
    image: "",
    specifications: {
      processor: "",
      ram: "",
      storage: "",
      graphics: "",
      display: "",
      battery: "",
    },
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [editImagePreview, setEditImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Check if user is logged in as admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userType = localStorage.getItem("userType")

    if (!isLoggedIn || userType !== "admin") {
      router.push("/login")
    }
  }, [router])

  // Load products from localStorage on initial render
  useEffect(() => {
    const loadProducts = () => {
      setProducts(getProducts())
    }

    loadProducts()

    // Refresh data every 10 seconds
    const interval = setInterval(loadProducts, 10000)

    return () => clearInterval(interval)
  }, [])

  // Handle image upload for new product
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setNewProduct({ ...newProduct, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image upload for editing product
  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setEditImagePreview(result)
        setEditingProduct({ ...editingProduct, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove image preview
  const removeImagePreview = () => {
    setImagePreview("")
    setNewProduct({ ...newProduct, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove edit image preview
  const removeEditImagePreview = () => {
    setEditImagePreview("")
    setEditingProduct({ ...editingProduct, image: "" })
    if (editFileInputRef.current) {
      editFileInputRef.current.value = ""
    }
  }

  // Add a new product
  const handleAddProduct = () => {
    if (!newProduct.name) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      })
      return
    }

    if (!newProduct.image) {
      toast({
        title: "Error",
        description: "Product image is required",
        variant: "destructive",
      })
      return
    }

    const addedProduct = addProduct(newProduct)
    setProducts(getProducts())
    setNewProduct({
      name: "",
      price: 0,
      quantity: 0,
      category: "ultrabook",
      description: "",
      image: "",
      specifications: {
        processor: "",
        ram: "",
        storage: "",
        graphics: "",
        display: "",
        battery: "",
      },
    })
    setImagePreview("")
    setIsAddDialogOpen(false)

    toast({
      title: "Laptop Added",
      description: `${addedProduct.name} has been added to inventory.`,
    })
  }

  // Update product
  const handleUpdateProduct = () => {
    if (!editingProduct) return

    const updatedProduct = updateProduct(editingProduct.id, editingProduct)

    if (updatedProduct) {
      setProducts(getProducts())
      setEditingProduct(null)
      setEditImagePreview("")
      setIsEditDialogOpen(false)

      toast({
        title: "Laptop Updated",
        description: `${updatedProduct.name} has been updated.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update laptop",
        variant: "destructive",
      })
    }
  }

  // Delete a product
  const handleDeleteProduct = () => {
    if (!productToDelete) return

    const productToDeleteObj = products.find((product) => product.id === productToDelete)

    if (deleteProduct(productToDelete)) {
      setProducts(getProducts())
      setProductToDelete(null)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Laptop Removed",
        description: `${productToDeleteObj?.name} has been removed from inventory.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete laptop",
        variant: "destructive",
      })
    }
  }

  // Get stock status based on quantity
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Out of Stock", color: "destructive" }
    if (quantity < 5) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
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

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "price":
        comparison = a.price - b.price
        break
      case "quantity":
        comparison = a.quantity - b.quantity
        break
      case "category":
        comparison = a.category.localeCompare(b.category)
        break
      default:
        comparison = a.name.localeCompare(b.name)
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Laptop Inventory Management</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search laptops..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Laptop
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Laptop</DialogTitle>
                <DialogDescription>Fill in the details to add a new laptop to your inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Laptop Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter laptop name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter laptop description"
                    rows={3}
                  />
                </div>

                {/* Image Upload Section */}
                <div className="grid gap-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    {imagePreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={removeImagePreview}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="ultrabook">Ultrabook</SelectItem>
                      <SelectItem value="convertible">2-in-1 Convertible</SelectItem>
                      <SelectItem value="dell">Dell</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="modular">Modular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specifications */}
                <div className="grid gap-4">
                  <Label className="text-base font-semibold">Specifications</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="processor">Processor</Label>
                      <Input
                        id="processor"
                        value={newProduct.specifications.processor}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: { ...newProduct.specifications, processor: e.target.value },
                          })
                        }
                        placeholder="e.g., Intel Core i7-13700H"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ram">RAM</Label>
                      <Input
                        id="ram"
                        value={newProduct.specifications.ram}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: { ...newProduct.specifications, ram: e.target.value },
                          })
                        }
                        placeholder="e.g., 16GB DDR5"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="storage">Storage</Label>
                      <Input
                        id="storage"
                        value={newProduct.specifications.storage}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: { ...newProduct.specifications, storage: e.target.value },
                          })
                        }
                        placeholder="e.g., 512GB PCIe SSD"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="graphics">Graphics</Label>
                      <Input
                        id="graphics"
                        value={newProduct.specifications.graphics}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: { ...newProduct.specifications, graphics: e.target.value },
                          })
                        }
                        placeholder="e.g., NVIDIA RTX 4070"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="display">Display</Label>
                      <Input
                        id="display"
                        value={newProduct.specifications.display}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: { ...newProduct.specifications, display: e.target.value },
                          })
                        }
                        placeholder="e.g., 15.6-inch FHD 144Hz"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="battery">Battery Life</Label>
                      <Input
                        id="battery"
                        value={newProduct.specifications.battery}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: { ...newProduct.specifications, battery: e.target.value },
                          })
                        }
                        placeholder="e.g., Up to 8 hours"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (NPR)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1000"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseInt(e.target.value) || 0 })}
                      placeholder="150000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} disabled={!newProduct.name || !newProduct.image}>
                  Add Laptop
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Low Stock Alert */}
      {products.some((product) => product.quantity < 5 && product.quantity > 0) && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-yellow-700 dark:text-yellow-400">
              Some laptops are running low on stock. Please consider restocking soon.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Laptop Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-semibold" onClick={() => toggleSort("name")}>
                    Laptop
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Specifications</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-semibold" onClick={() => toggleSort("category")}>
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-semibold" onClick={() => toggleSort("price")}>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-semibold" onClick={() => toggleSort("quantity")}>
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm || categoryFilter !== "all"
                      ? "No laptops match your search."
                      : "No laptops in inventory. Add some laptops to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.quantity)
                  return (
                    <TableRow
                      key={product.id}
                      className={product.quantity < 5 ? "bg-red-50/50 dark:bg-red-950/20" : ""}
                    >
                      <TableCell>
                        <div className="relative h-12 w-16 rounded-md overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover"
                            fill
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.specifications && (
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <Cpu className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{product.specifications.processor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{product.specifications.ram}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Monitor className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{product.specifications.display}</span>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">Rs. {product.price.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as "default" | "destructive" | "warning" | "success"}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product)
                              setEditImagePreview(product.image)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setProductToDelete(product.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Laptop</DialogTitle>
            <DialogDescription>Update the laptop details below.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Laptop Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Edit Image Upload Section */}
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Product Image</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editFileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Change Image
                    </Button>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                  </div>
                  {editImagePreview && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <Image src={editImagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={removeEditImagePreview}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingProduct.category}
                  onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="ultrabook">Ultrabook</SelectItem>
                    <SelectItem value="convertible">2-in-1 Convertible</SelectItem>
                    <SelectItem value="dell">Dell</SelectItem>
                    <SelectItem value="microsoft">Microsoft</SelectItem>
                    <SelectItem value="modular">Modular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Edit Specifications */}
              {editingProduct.specifications && (
                <div className="grid gap-4">
                  <Label className="text-base font-semibold">Specifications</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-processor">Processor</Label>
                      <Input
                        id="edit-processor"
                        value={editingProduct.specifications.processor || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, processor: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-ram">RAM</Label>
                      <Input
                        id="edit-ram"
                        value={editingProduct.specifications.ram || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, ram: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-storage">Storage</Label>
                      <Input
                        id="edit-storage"
                        value={editingProduct.specifications.storage || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, storage: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-graphics">Graphics</Label>
                      <Input
                        id="edit-graphics"
                        value={editingProduct.specifications.graphics || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, graphics: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-display">Display</Label>
                      <Input
                        id="edit-display"
                        value={editingProduct.specifications.display || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, display: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-battery">Battery Life</Label>
                      <Input
                        id="edit-battery"
                        value={editingProduct.specifications.battery || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, battery: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (NPR)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="1000"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    value={editingProduct.quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this laptop? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
