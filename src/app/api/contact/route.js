import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceType, message, to } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service Type: ${serviceType || 'Not specified'}

Message:
${message}

---
This message was sent from the Markham Restring contact form.
    `;

    // Send email using the email API
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'markhamrestring@gmail.com',
          subject: 'New Contact Form Submission - Markham Restring',
          text: emailContent
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send contact form email');
        throw new Error('Email service error');
      }

      console.log('📧 Contact form email sent successfully');

      // Send confirmation email to customer
      const confirmationEmailContent = `
Dear ${name},

Thank you for contacting Markham Restring Studio!

We have received your message and will get back to you as soon as possible.

Your message details:
Service Type: ${serviceType || 'Not specified'}
Message: ${message}

If you have any urgent questions, please call us at (647) 655-3658.

Best regards,
The Markham Restring Team
      `;

      const confirmationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Thank you for contacting Markham Restring Studio',
          text: confirmationEmailContent
        })
      });

      if (confirmationResponse.ok) {
        console.log('📧 Confirmation email sent to customer');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the contact form if email fails
    }
    
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 