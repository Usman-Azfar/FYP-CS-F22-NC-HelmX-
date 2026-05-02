/**
 * File: api/contact/route.ts
 * Purpose: API route for handling contact form submissions with database storage and SMTP email notifications
 * Author: GitHub Copilot
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSmtpEmail } from "@/lib/email"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "support@helmx.com"

// Simple in-memory rate limiter (replace with Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    try {
      const adminEmailResponse = await sendSmtpEmail({
        to: ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        replyTo: email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #A855F7;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; color: #333;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px;">
              Submission ID: ${submission.id}<br/>
              Submitted at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      })
      console.log("Admin notification sent:", adminEmailResponse)
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError)
    }

    try {
      const userEmailResponse = await sendSmtpEmail({
        to: email,
        subject: "We've received your message",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #A855F7;">Thank you for contacting HelmX</h2>
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you as soon as possible. Here's a summary of what you sent:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Your Message:</strong></p>
              <p style="white-space: pre-wrap; color: #333;">${message}</p>
            </div>
            <p>We typically respond within 24 hours during business days.</p>
            <p>Best regards,<br/>The HelmX Team</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              Reference ID: ${submission.id}
            </p>
          </div>
        `,
      })
      console.log("User confirmation sent:", userEmailResponse)
    } catch (emailError) {
      console.error("Failed to send user confirmation:", emailError)
    }

    return NextResponse.json(
      {
        message: "Message received successfully",
        submissionId: submission.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
