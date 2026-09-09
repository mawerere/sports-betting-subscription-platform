// src/lib/email-sender.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Dispatches OTP email asynchronously using Resend.
 */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify Your Account - Sports Betting Platform',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a56db;">Email Verification</h2>
          <p>Thank you for signing up! Please use the 6-digit verification code below to activate your account:</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; border-radius: 8px; margin: 20px 0; color: #111827;">
            ${code}
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 12px;">If you did not request this email, please ignore it.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send verification email via Resend:', error);
  }
}