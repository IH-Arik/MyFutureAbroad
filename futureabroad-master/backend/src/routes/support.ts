import express from "express";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { supabase } from "../config.js";

const router = express.Router();

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_SENDER_NAME = process.env.SMTP_SENDER_NAME || "MyFutureAbroad";
const SMTP_ADMIN_EMAIL = process.env.SMTP_ADMIN_EMAIL || "";

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || SMTP_ADMIN_EMAIL || "customersupport@myfutureabroad.com";
const FROM_EMAIL = process.env.SUPPORT_FROM_EMAIL || SMTP_ADMIN_EMAIL || `no-reply@myfutureabroad.com`;

let resendClient: Resend | null = null;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

let mailerTransport: nodemailer.Transporter | null = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  mailerTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// POST /api/support
router.post("/", async (req, res) => {
  if (!resendClient && !mailerTransport) {
    return res.status(500).json({ error: "Email provider not configured" });
  }

  try {
    const { category, subject, message, email } = req.body;
    const userId = req.headers["x-user-id"] as string | undefined;

    if (!category || !subject || !message || !email) {
      return res.status(400).json({ error: "Missing required fields: category, subject, message, email" });
    }

    const html = `
      <p>A new support request was submitted:</p>
      <p><strong>Category:</strong> ${escapeHtml(category)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>From:</strong> ${escapeHtml(email)}${userId ? ` (userId: ${escapeHtml(userId)})` : ""}</p>
      <hr />
      <div>${escapeHtml(message).replace(/\n/g, "<br />")}</div>
    `;

    if (resendClient) {
      await resendClient.emails.send({
        from: FROM_EMAIL,
        to: SUPPORT_EMAIL,
        subject: `[Support] ${subject}`,
        html,
      });
    } else if (mailerTransport) {
      await mailerTransport.sendMail({
        from: `${SMTP_SENDER_NAME} <${FROM_EMAIL}>`,
        to: SUPPORT_EMAIL,
        subject: `[Support] ${subject}`,
        html,
      });
    }

    // Store message in Supabase support_messages table (best-effort)
    try {
      const { error: dbError } = await supabase.from("support_messages").insert([
        { category, subject, message, email, user_id: userId || null },
      ]);
      if (dbError) console.warn("Failed to insert support message:", dbError.message || dbError);
    } catch (e) {
    }

    res.json({ ok: true });
  } catch (err: any) {
    console.error("Support send error:", err);
    res.status(500).json({ error: err.message || "Failed to send support message" });
  }
});

export default router;
