"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ArrowRight } from "lucide-react"

export default function BuySuccessPage() {
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get("payment")
  const sessionId = searchParams.get("session_id")
  const [dbSyncStatus, setDbSyncStatus] = useState<"idle" | "syncing" | "synced" | "failed">("idle")

  useEffect(() => {
    if (paymentStatus !== "success" || !sessionId) {
      return
    }

    let isMounted = true

    async function confirmPayment() {
      if (!sessionId) {
        return
      }

      setDbSyncStatus("syncing")
      try {
        const response = await fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
        if (!response.ok) {
          throw new Error("Failed to confirm payment")
        }
        if (isMounted) {
          setDbSyncStatus("synced")
        }
      } catch (error) {
        console.error("Payment confirmation failed:", error)
        if (isMounted) {
          setDbSyncStatus("failed")
        }
      }
    }

    void confirmPayment()

    return () => {
      isMounted = false
    }
  }, [paymentStatus, sessionId])

  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_32%),linear-gradient(180deg,#020617_0%,#0b1220_100%)] text-white min-h-screen flex items-center justify-center py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {paymentStatus === "success" ? (
          <Card className="border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl" />
                  <div className="relative flex items-center justify-center w-24 h-24 bg-emerald-400/10 border border-emerald-400/30 rounded-full">
                    <Check className="w-12 h-12 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-black">Payment Successful!</h1>
                <p className="text-lg text-white/70">Your HelmX smart helmet order has been confirmed.</p>
              </div>

              <Card className="border-white/10 bg-white/[0.03] p-6 text-left">
                <div className="space-y-4">
                  {/* <div>
                    <p className="text-sm text-white/55 uppercase tracking-[0.1em]">Session ID</p>
                    <p className="text-sm font-mono text-white/70 break-all">{sessionId}</p>
                  </div> */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/70">
                      A confirmation email has been sent to your email address. You'll receive updates about your order status.
                    </p>
                    {dbSyncStatus === "syncing" && (
                      <p className="mt-2 text-xs text-cyan-200">Finalizing payment sync with our database...</p>
                    )}
                    {dbSyncStatus === "synced" && (
                      <p className="mt-2 text-xs text-emerald-300">Payment recorded successfully.</p>
                    )}
                    {dbSyncStatus === "failed" && (
                      <p className="mt-2 text-xs text-amber-300">
                        Payment is successful, but database sync is delayed. It will be retried automatically.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-semibold text-left mb-3">What happens next?</h3>
                <ul className="space-y-2 text-left text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Our team will review your custom configuration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>We'll reach out within 24 hours with estimated delivery date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Your helmet will be custom-built and tested before shipping</span>
                  </li>
                </ul>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="group bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                  <Link href="/">
                    Back to home
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5">
                  <Link href="/contact">
                    Contact support
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="text-center space-y-6">
              <div className="text-6xl">❌</div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black">Payment Cancelled</h1>
                <p className="text-lg text-white/70">Your payment was not completed. No charges were made.</p>
              </div>

              <p className="text-white/70">
                Your configuration has been saved. Feel free to return and try again anytime.
              </p>

              <Button asChild className="group bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <Link href="/buy">
                  Return to configurator
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
