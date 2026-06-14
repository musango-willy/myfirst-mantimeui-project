import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Set up the internal database client connection
const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // 1. SAVE BACKUP LOG DIRECTLY TO SUPABASE POSTGRES TABLE ROWS
    await supabase.from('contact_messages').insert([{ name, email, message }]);

    // 2. ROUTE THE EMAIL INSTANTLY TO YOUR PERSONAL INBOX VIA RESEND
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'musangowilly@gmail.com',
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
