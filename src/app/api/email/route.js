import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_Zwfthvw2_Do4YGRtx35dSanefM4zHzMmh');

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'To, subject, and content are required' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
      text: text
    });

    console.log('📧 Email sent successfully via Resend:', result);

    return NextResponse.json(
      { message: 'Email sent successfully', id: result.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
} 