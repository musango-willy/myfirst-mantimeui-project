import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize the secure email engine client layer
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Fire the data packet directly into your personal email inbox
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default developer sandbox verification sender domain
      to: 'musangowilly@gmail.com', // <-- REPLACE THIS with your actual email address!
      subject: `✉️ New Lead: Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Sender Name:</strong> ${name}</p>
        <p><strong>Email Address:</strong> ${email}</p>
        <p><strong>Message Content:</strong></p>
        <div style="padding: 12px; background: #f4f4f5; border-left: 4px solid #7c3aed; border-radius: 4px;">
          ${message}
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
