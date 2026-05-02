"use client"

import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { useState } from "react"

interface StripeCheckoutButtonProps {
  email: string
  cartItems: { activeParts: Array<{ id: string; name: string; price: number }>; selectedExtras: Array<{ id: string; name: string; price: number }>; selectedStorage?: { name: string; price: number } | null }
  total: number
  isLoading: boolean
}

export function StripeCheckoutButton({ email, cartItems, total, isLoading }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          total,
          email,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to initiate checkout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || isLoading || !email}
      className="group w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
    >
      {loading || isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Pay with Stripe
        </>
      )}
    </Button>
  )
}
