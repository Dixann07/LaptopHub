"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("error") || "Payment was cancelled or failed"

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
          <CardDescription>Unfortunately, your payment could not be processed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">What you can do:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Check your payment details and try again</li>
              <li>• Ensure sufficient balance in your account</li>
              <li>• Try a different payment method</li>
              <li>• Contact customer support if issue persists</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild className="flex-1">
              <Link href="/customer/cart">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Need help? Contact support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
