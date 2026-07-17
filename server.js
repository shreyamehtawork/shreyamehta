require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(__dirname)); // serves index.html, styles.css, script.js

// ---- Basic email format check ----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Simple in-memory rate limiter (per IP) ----
const rateLimit = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  rateLimit.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

// ---- Nodemailer transporter (Gmail + App Password) ----
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const safe = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

app.post("/api/contact", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again in a minute." });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res
      .status(400)
      .json({ error: "Please provide a valid email address." });
  }
  if (String(message).length > 5000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env");
    return res
      .status(500)
      .json({ error: "Mail server is not configured yet." });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.TO_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `[Shreya Mehta Website] ${subject}`,
      text: `New message from your portfolio contact form\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="margin-bottom:4px;">New message on your webiste's contact form</h2>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Name</td><td>${safe(name)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Email</td><td>${safe(email)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0; color:#666;">Subject</td><td>${safe(subject)}</td></tr>
          </table>
          <p style="white-space: pre-wrap; border-top:1px solid #eee; padding-top:12px;">${safe(message)}</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Nodemailer send error:", err);
    return res.status(502).json({
      error: "Failed to send message. Please try again or email directly.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
