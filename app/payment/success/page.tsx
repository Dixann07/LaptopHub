"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment parameters from URL
        const oid = searchParams.get("oid") // eSewa order ID
        const amt = searchParams.get("amt") // eSewa amount
        const refId = searchParams.get("refId") // eSewa reference ID
        const pidx = searchParams.get("pidx") // Khalti payment index

        if (oid && amt && refId) {
          // eSewa payment verification
          console.log("Verifying eSewa payment:", { oid, amt, refId })

          // Get stored payment info
          const storedPayment = localStorage.getItem(`payment_${oid}`)
          if (storedPayment) {
            const paymentInfo = JSON.parse(storedPayment)
            setPaymentDetails({
              ...paymentInfo,
              paymentMethod: "eSewa",
              referenceId: refId,
              verified: true,
            })
          }
        } else if (pidx) {
          // Khalti payment verification
          console.log("Verifying Khalti payment:", { pidx })

          // In a real app, you'd verify with Khalti API here
          // For demo, we'll assume success
          setPaymentDetails({
            orderId: `KHALTI-${Date.now()}`,
            amount: 0,
            paymentMethod: "Khalti",
            referenceId: pidx,
            verified: true,
          })
        }
      } catch (error) {
        console.error("Payment verification failed:", error)
        router.push("/payment/failure")
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  const formatNPR = (amount: number) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>Your order has been confirmed and will be processed shortly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentDetails && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <Badge variant="outline">{paymentDetails.orderId}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-semibold">{formatNPR(paymentDetails.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method:</span>
                <Badge>{paymentDetails.paymentMethod}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reference ID:</span>
                <span className="text-sm font-mono">{paymentDetails.referenceId}</span>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Package className="w-4 h-4" />
              <span>What happens next?</span>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Order confirmation email sent</li>
              <li>• Processing within 24 hours</li>
              <li>• Delivery within 2-3 business days</li>
              <li>• 2-year warranty included</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild className="flex-1">
              <Link href="/customer/orders">
                View Orders
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
