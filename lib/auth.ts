// Authentication and user management functions

// User types
export type UserRole = "admin" | "customer"

// Add a dateJoined field to the User interface
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  dateJoined?: string
}

// Initialize users in localStorage if not exists
export const initializeUsers = () => {
  if (typeof window === "undefined") return

  const users = localStorage.getItem("users")
  if (!users) {
    // Create default admin user
    const defaultUsers: User[] = [
      {
        id: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123", // In a real app, this would be hashed
        role: "admin",
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }
}

// Get all users
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []

  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

// Update the registerUser function to include dateJoined
export const registerUser = (
  name: string,
  email: string,
  password: string,
  role: UserRole = "customer",
): { success: boolean; message: string } => {
  const users = getUsers()

  // Check if email already exists
  if (users.some((user) => user.email === email)) {
    return { success: false, message: "Email already in use" }
  }

  // Check if trying to register as admin when admin already exists
  if (role === "admin" && users.some((user) => user.role === "admin")) {
    return { success: false, message: "An admin account already exists" }
  }

  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In a real app, this would be hashed
    role,
    dateJoined: new Date().toISOString(),
  }

  // Add user to storage
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  return { success: true, message: "Registration successful" }
}

// Login user
export const loginUser = (
  email: string,
  password: string,
): { success: boolean; message: string; user?: Omit<User, "password"> } => {
  const users = getUsers()

  // Find user by email
  const user = users.find((user) => user.email === email)

  // Check if user exists and password matches
  if (!user) {
    return { success: false, message: "User not found" }
  }

  if (user.password !== password) {
    return { success: false, message: "Invalid password" }
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return { success: true, message: "Login successful", user: userWithoutPassword }
}

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isLoggedIn") === "true"
}

// Get current user role
export const getUserRole = (): UserRole | null => {
  if (typeof window === "undefined") return null
  return (localStorage.getItem("userType") as UserRole) || null
}

// Logout user
export const logoutUser = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("userType")
  localStorage.removeItem("currentUser")
}
