import { Resend } from "resend";

/**
 * Heroku-friendly Resend client.
 *
 * Required env vars:
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL (optional; defaults to onboarding@resend.dev)
 */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  return {
    client: new Resend(apiKey),
    fromEmail: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  };
}
