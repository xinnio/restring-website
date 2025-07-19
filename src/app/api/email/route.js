import { NextResponse } from 'next/server';

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

    // Mailgun configuration
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'markhamrestring.com';
    const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || 'Markham Restring <noreply@markhamrestring.com>';

    // Validate Mailgun configuration
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error('Mailgun configuration missing');
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    // Create form data for Mailgun API
    const formData = new URLSearchParams();
    formData.append('from', FROM_EMAIL);
    formData.append('to', to);
    formData.append('subject', subject);
    
    if (html) {
      formData.append('html', html);
    }
    if (text) {
      formData.append('text', text);
    }

    // Send email via Mailgun
    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (!mailgunResponse.ok) {
      const errorText = await mailgunResponse.text();
      console.error('Mailgun API error:', mailgunResponse.status, errorText);
      throw new Error(`Mailgun API error: ${mailgunResponse.status}`);
    }

    const result = await mailgunResponse.json();
    console.log('📧 Email sent successfully via Mailgun:', result);

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