"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatbotProps {
  userType?: "customer" | "admin"
}

export function Chatbot({ userType = "customer" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm your LaptopHub assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simple bot responses
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase(), userType)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const getBotResponse = (input: string, userType: string): string => {
    if (input.includes("price") || input.includes("cost")) {
      return "Our laptops are competitively priced in NPR. You can find detailed pricing on each product page. We also offer EMI options!"
    }

    if (input.includes("shipping") || input.includes("delivery")) {
      return "We offer free shipping within Kathmandu Valley. For other areas, shipping costs NPR 500-1500. Delivery takes 2-5 business days."
    }

    if (input.includes("warranty")) {
      return "All our laptops come with 1-year manufacturer warranty. We also provide extended warranty options and local service support."
    }

    if (input.includes("payment")) {
      return "We accept cash on delivery, bank transfer, eSewa, and Khalti payments. EMI options are available for purchases above NPR 50,000."
    }

    if (input.includes("gaming") || input.includes("game")) {
      return "For gaming, I recommend our ASUS ROG series or Acer Predator laptops. They feature powerful GPUs and high refresh rate displays."
    }

    if (input.includes("business") || input.includes("work")) {
      return "For business use, consider our ThinkPad X1 Carbon or Dell XPS series. They offer excellent performance and professional build quality."
    }

    if (input.includes("student") || input.includes("study")) {
      return "For students, I recommend our MacBook Air or ASUS ZenBook series. They're lightweight, have great battery life, and perfect for academic work."
    }

    if (userType === "admin") {
      if (input.includes("inventory") || input.includes("stock")) {
        return "You can manage inventory from the admin dashboard. Check the Inventory section to add, edit, or remove products."
      }
      if (input.includes("orders")) {
        return "View and manage all customer orders in the Orders section. You can update order status and track deliveries."
      }
      if (input.includes("analytics")) {
        return "Check the Analytics dashboard for sales reports, popular products, and business insights."
      }
    }

    return "I'm here to help! You can ask me about laptop specifications, pricing, shipping, warranty, or any other questions about our products and services."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LaptopHub Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

// Default export for backward compatibility
export default Chatbot
