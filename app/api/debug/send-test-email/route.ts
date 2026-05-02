import { NextResponse } from "next/server"
import { sendSmtpEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const to = body.to || process.env.ADMIN_EMAIL || process.env.SMTP_USER
    const subject = body.subject || "HelmX test email"
    const html =
      body.html || `<p>Test email from HelmX at ${new Date().toISOString()}</p>`

    const result = await sendSmtpEmail({ to, subject, html })

    return NextResponse.json({ ok: true, result })
  } catch (err) {
    console.error("Test email failed:", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
