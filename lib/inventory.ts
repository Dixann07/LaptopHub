// Inventory management functions for laptop shop

export interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  description: string
  image: string
  specifications?: {
    processor?: string
    ram?: string
    storage?: string
    graphics?: string
    display?: string
    battery?: string
  }
}

export interface CartItem {
  id: string
  quantity: number
}

export interface Order {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  customer: {
    id: string
    name: string
    email: string
  }
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  shippingAddress: {
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
}

// Initialize inventory in localStorage if not exists
export const initializeInventory = () => {
  if (typeof window === "undefined") return

  const inventory = localStorage.getItem("inventory")
  if (!inventory) {
    // Initialize with empty inventory - admin will add products later
    localStorage.setItem("inventory", JSON.stringify([]))
  }
}

// Get all products
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return []

  const inventory = localStorage.getItem("inventory")
  return inventory ? JSON.parse(inventory) : []
}

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  const products = getProducts()
  return products.find((product) => product.id === id)
}

// Add a new product
export const addProduct = (product: Omit<Product, "id">): Product => {
  const products = getProducts()

  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  }

  products.push(newProduct)
  localStorage.setItem("inventory", JSON.stringify(products))

  return newProduct
}

// Update a product
export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) return null

  const updatedProduct = { ...products[index], ...updates }
  products[index] = updatedProduct
  localStorage.setItem("inventory", JSON.stringify(products))

  return updatedProduct
}

// Delete a product
export const deleteProduct = (id: string): boolean => {
  const products = getProducts()
  const filteredProducts = products.filter((product) => product.id !== id)

  if (filteredProducts.length === products.length) return false

  localStorage.setItem("inventory", JSON.stringify(filteredProducts))
  return true
}

// Get cart items
export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return []

  const cart = localStorage.getItem("cart")
  return cart ? JSON.parse(cart) : []
}

// Add item to cart
export const addToCart = (productId: string, quantity = 1): { success: boolean; message: string } => {
  const product = getProductById(productId)

  if (!product) {
    return { success: false, message: "Product not found" }
  }

  if (product.quantity <= 0) {
    return { success: false, message: "Product is out of stock" }
  }

  const cart = getCart()
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    // Check if we're trying to add more than available
    if (existingItem.quantity + quantity > product.quantity) {
      return { success: false, message: "Not enough stock available" }
    }

    // Update quantity
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + quantity } : item,
    )
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  } else {
    // Add new item
    cart.push({ id: productId, quantity })
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  return { success: true, message: "Item added to cart" }
}

// Remove item from cart
export const removeFromCart = (productId: string): boolean => {
  const cart = getCart()
  const updatedCart = cart.filter((item) => item.id !== productId)

  if (updatedCart.length === cart.length) return false

  localStorage.setItem("cart", JSON.stringify(updatedCart))
  return true
}

// Update cart item quantity
export const updateCartItemQuantity = (productId: string, quantity: number): { success: boolean; message: string } => {
  if (quantity <= 0) {
    removeFromCart(productId)
    return { success: true, message: "Item removed from cart" }
  }

  const product = getProductById(productId)

  if (!product) {
    return { success: false, message: "Product not found" }
  }

  if (quantity > product.quantity) {
    return { success: false, message: "Not enough stock available" }
  }

  const cart = getCart()
  const updatedCart = cart.map((item) => (item.id === productId ? { ...item, quantity } : item))

  localStorage.setItem("cart", JSON.stringify(updatedCart))
  return { success: true, message: "Cart updated" }
}

// Clear cart
export const clearCart = (): void => {
  localStorage.setItem("cart", JSON.stringify([]))
}

// Get all orders
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return []

  const orders = localStorage.getItem("orders")
  return orders ? JSON.parse(orders) : []
}

// Create a new order
export const createOrder = (
  customerId: string,
  customerName: string,
  customerEmail: string,
  shippingAddress: Order["shippingAddress"],
  paymentMethod: string,
): { success: boolean; message: string; order?: Order } => {
  console.log("Creating order for customer:", customerName, customerEmail)

  const cart = getCart()

  if (cart.length === 0) {
    return { success: false, message: "Cart is empty" }
  }

  const products = getProducts()
  const orderItems: Order["items"] = []
  let total = 0

  // Check stock and prepare order items
  for (const cartItem of cart) {
    const product = products.find((p) => p.id === cartItem.id)

    if (!product) {
      return { success: false, message: `Product with ID ${cartItem.id} not found` }
    }

    if (product.quantity < cartItem.quantity) {
      return {
        success: false,
        message: `Not enough stock for ${product.name}. Available: ${product.quantity}`,
      }
    }

    orderItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: cartItem.quantity,
    })

    total += product.price * cartItem.quantity
  }

  // Create order with proper timestamp
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    status: "processing",
    total,
    customer: {
      id: customerId,
      name: customerName,
      email: customerEmail,
    },
    items: orderItems,
    shippingAddress,
    paymentMethod,
  }

  console.log("New order created:", newOrder)

  // Update inventory
  for (const item of cart) {
    const product = products.find((p) => p.id === item.id)
    if (product) {
      product.quantity -= item.quantity
    }
  }

  // Save updated inventory
  localStorage.setItem("inventory", JSON.stringify(products))

  // Save order - this is crucial for admin visibility
  const orders = getOrders()
  orders.push(newOrder)
  localStorage.setItem("orders", JSON.stringify(orders))

  console.log("Order saved to localStorage. Total orders:", orders.length)

  // Clear cart
  clearCart()

  return { success: true, message: "Order created successfully", order: newOrder }
}

// Update order status
export const updateOrderStatus = (orderId: string, status: Order["status"]): { success: boolean; message: string } => {
  const orders = getOrders()
  const index = orders.findIndex((order) => order.id === orderId)

  if (index === -1) {
    return { success: false, message: "Order not found" }
  }

  orders[index].status = status
  localStorage.setItem("orders", JSON.stringify(orders))

  return { success: true, message: "Order status updated" }
}


