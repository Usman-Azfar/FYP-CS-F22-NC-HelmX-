import nodemailer from "nodemailer"

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || "465")
const SMTP_SECURE = process.env.SMTP_SECURE !== "false"
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

export const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER || "HelmX <no-reply@helmx.com>"

const transporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : null

if (transporter) {
  console.log("SMTP transporter configured for host:", SMTP_HOST)
} else {
  console.warn("SMTP not configured. Emails will not be sent until SMTP env vars are set.")
}

export async function sendSmtpEmail(options: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  if (!transporter) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.")
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })
    console.log(`Email sent to ${options.to}: ${info.messageId || JSON.stringify(info)}`)
    return info
  } catch (err) {
    console.error("sendSmtpEmail error:", err)
    throw err
  }
}