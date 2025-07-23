import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Check if API key is available
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// Add a helper function to calculate total cost
function calculateTotal(booking) {
  const rackets = booking.rackets || [
    {
      racketType: booking.racketType,
      stringName: booking.stringName,
      stringColor: booking.stringColor,
      stringTension: booking.stringTension,
      quantity: booking.quantity || 1
    }
  ];
  let basePrice = 0;
  switch (booking.turnaroundTime) {
    case 'sameDay': basePrice = 35; break;
    case 'nextDay': basePrice = 30; break;
    case '3-5days': basePrice = 25; break;
    default: basePrice = 0;
  }
  let racketsSubtotal = rackets.reduce((sum, r) => sum + (basePrice * (parseInt(r.quantity) || 1)), 0);
  let extras = 0;
  if (booking.ownString) extras += 3;
  if (booking.grommetReplacement) extras += 0.25;
  let deliveryFee = 0;
  const dropoffDelivery = booking.dropoffLocation === 'Door-to-Door (Delivery)';
  const pickupDelivery = booking.pickupLocation === 'Door-to-Door (Delivery)';
  if (dropoffDelivery) deliveryFee += 12;
  if (pickupDelivery) deliveryFee += 12;
  if (dropoffDelivery && pickupDelivery) deliveryFee -= 4;
  return (racketsSubtotal + extras + deliveryFee).toFixed(2);
}

// Email templates
const emailTemplates = {
  bookingSubmission: (booking) => ({
    subject: `Booking Confirmation #${booking.bookingNumber} - Markham Restring Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎾 Markham Restring Studio</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Booking Confirmation</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Booking #${booking.bookingNumber} Received!</h2>
          <div style="background: #fff3cd; padding: 18px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107; color: #856404; font-size: 1.1em;">
            <strong>Thank you for submitting your booking!</strong><br/>
            We have received your request. <b>We will contact you soon to confirm your booking and arrange pickup/drop-off.</b><br/>
            You will receive a separate confirmation email once your booking is confirmed.
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">Booking Details</h3>
            <p><strong>Name:</strong> ${booking.fullName}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">${booking.status}</span></p>
            <p><strong>Turnaround Time:</strong> ${booking.turnaroundTime}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Racket Details</h3>
            ${booking.rackets.map((racket, index) => `
              <div style="border: 1px solid #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #495057;">Racket ${index + 1}</h4>
                <p><strong>Type:</strong> ${racket.racketType}</p>
                <p><strong>String Brand:</strong> ${racket.stringBrand}</p>
                <p><strong>String Model:</strong> ${racket.stringModel}</p>
                <p><strong>Tension:</strong> ${racket.stringTension}</p>
                <p><strong>Method:</strong> ${racket.tensionMethod}</p>
              </div>
            `).join('')}
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Pickup & Dropoff</h3>
            <p><strong>Dropoff Location:</strong> ${booking.dropoffLocation}</p>
            <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">Receipt</h3>
            <p style="font-size: 1.15em; font-weight: bold; color: #2e7d32;">Receipt: $${calculateTotal(booking)}</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">We'll notify you when your racket is ready for pickup!</p>
            <p style="color: #6c757d; font-size: 12px;">Thank you for choosing Markham Restring Studio</p>
          </div>
        </div>
      </div>
    `
  }),

  schedulePickup: (booking) => ({
    subject: `Schedule Pickup - Booking #${booking.bookingNumber} - Markham Restring Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎾 Markham Restring Studio</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ready for Pickup!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Racket is Ready! 🎉</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">Pickup Information</h3>
            <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
            <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Ready for Pickup</span></p>
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">Receipt</h3>
            <p style="font-size: 1.15em; font-weight: bold; color: #2e7d32;">Receipt: $${calculateTotal(booking)}</p>
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">📅 Schedule Your Pickup</h3>
            <p>Please visit our website to schedule your pickup time:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Schedule Pickup
              </a>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">What to Bring</h3>
            <ul style="color: #495057;">
              <li>Valid ID or booking confirmation</li>
              <li>Payment method (if not already paid)</li>
              <li>Any special instructions you provided</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">We look forward to seeing you!</p>
            <p style="color: #6c757d; font-size: 12px;">Markham Restring Studio</p>
          </div>
        </div>
      </div>
    `
  }),

  completion: (booking) => ({
    subject: `Service Complete - Booking #${booking.bookingNumber} - Markham Restring Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎾 Markham Restring Studio</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Service Complete</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Racket Restringing is Complete! ✅</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
            <h3 style="color: #17a2b8; margin-top: 0;">Service Summary</h3>
            <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
            <p><strong>Customer:</strong> ${booking.fullName}</p>
            <p><strong>Status:</strong> <span style="color: #17a2b8; font-weight: bold;">Completed</span></p>
            <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Racket Details</h3>
            ${booking.rackets.map((racket, index) => `
              <div style="border: 1px solid #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #495057;">Racket ${index + 1} ✅</h4>
                <p><strong>Type:</strong> ${racket.racketType}</p>
                <p><strong>String:</strong> ${racket.stringBrand} ${racket.stringModel}</p>
                <p><strong>Tension:</strong> ${racket.stringTension}</p>
                <p><strong>Method:</strong> ${racket.tensionMethod}</p>
              </div>
            `).join('')}
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">💰 Payment Summary</h3>
            <p style="font-size: 1.15em; font-weight: bold; color: #2e7d32;">Total Cost: $${calculateTotal(booking)}</p>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">📞 Important</h3>
            <p>Please call <strong>647-655-3658</strong> once you arrive at the dropoff/pickup location.</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Location & Timing</h3>
            <p><strong>Dropoff Location:</strong> ${booking.dropoffLocation}</p>
            <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
            <p><strong>Turnaround Time:</strong> ${booking.turnaroundTime}</p>
            ${booking.notes ? `<p><strong>Special Notes:</strong> ${booking.notes}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">Thank you for choosing our professional service!</p>
            <p style="color: #6c757d; font-size: 12px;">Markham Restring Studio</p>
          </div>
        </div>
      </div>
    `
  }),

  confirmation: (booking) => ({
    subject: `Booking Confirmed - #${booking.bookingNumber} - Markham Restring Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎾 Markham Restring Studio</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Booking Confirmed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Booking Confirmed! 🎉</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #ffc107; margin-top: 0;">Confirmation Details</h3>
            <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
            <p><strong>Customer:</strong> ${booking.fullName}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></p>
            <p><strong>Confirmation Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">📋 Racket Details</h3>
            ${booking.rackets.map((racket, index) => `
              <div style="border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 10px; background: #fffbf0;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">Racket ${index + 1}</h4>
                <p><strong>Type:</strong> ${racket.racketType}</p>
                <p><strong>String:</strong> ${racket.stringBrand} ${racket.stringModel}</p>
                <p><strong>Tension:</strong> ${racket.stringTension}</p>
                <p><strong>Method:</strong> ${racket.tensionMethod}</p>
              </div>
            `).join('')}
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">💰 Payment Summary</h3>
            <p style="font-size: 1.15em; font-weight: bold; color: #2e7d32;">Total Cost: $${calculateTotal(booking)}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Location & Timing</h3>
            <p><strong>Dropoff Location:</strong> ${booking.dropoffLocation}</p>
            <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
            <p><strong>Turnaround Time:</strong> ${booking.turnaroundTime}</p>
            ${booking.notes ? `<p><strong>Special Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">📞 Important</h3>
            <p>Please call <strong>647-655-3658</strong> once you arrive at the dropoff/pickup location.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d; font-size: 14px;">We'll keep you updated on the progress!</p>
            <p style="color: #6c757d; font-size: 12px;">Markham Restring Studio</p>
          </div>
        </div>
      </div>
    `
  }),

  pickup: (booking) => ({
    subject: `Racket Picked Up - Booking #${booking.bookingNumber} - Markham Restring Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎾 Markham Restring Studio</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Racket Picked Up!</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Racket Has Been Picked Up</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">Pickup Confirmation</h3>
            <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
            <p><strong>Customer:</strong> ${booking.fullName}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Picked Up</span></p>
            <p><strong>Pickup Date:</strong> ${booking.actualPickupTime ? new Date(booking.actualPickupTime).toLocaleString() : (booking.autoPickupTime ? new Date(booking.autoPickupTime).toLocaleString() : new Date().toLocaleString())}</p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Booking Details</h3>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Turnaround Time:</strong> ${booking.turnaroundTime}</p>
            <p><strong>Dropoff Location:</strong> ${booking.dropoffLocation}</p>
            <p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">Racket & String Details</h3>
            ${booking.rackets.map((racket, index) => `
              <div style="border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 10px; background: #fffbf0;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">Racket ${index + 1}</h4>
                <p><strong>Type:</strong> ${racket.racketType}</p>
                <p><strong>String:</strong> ${racket.stringBrand} ${racket.stringModel}</p>
                <p><strong>Tension:</strong> ${racket.stringTension}</p>
                <p><strong>Method:</strong> ${racket.tensionMethod}</p>
                <p><strong>Qty:</strong> ${racket.quantity || 1}</p>
              </div>
            `).join('')}
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #28a745; margin-top: 0;">Payment Summary</h3>
            <p style="font-size: 1.15em; font-weight: bold; color: #2e7d32;">Total Cost: $${calculateTotal(booking)}</p>
          </div>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin-top: 0;">Important Notice</h3>
            <p><strong>Markham Restring Studio is not responsible for any damage or imperfections after pickup.</strong></p>
          </div>
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h3 style="color: #1976d2; margin-top: 0;">Thank You!</h3>
            <p>Thank you for choosing Markham Restring Studio. We appreciate your business and hope to see you again soon!</p>
          </div>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h3 style="color: #28a745; margin-top: 0;">Schedule Your Next Service</h3>
            <p>Would you like to schedule your next racket restringing service?</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking" 
                 style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Schedule Next Service
              </a>
            </div>
          </div>
        </div>
      </div>
    `
  })
};

const EMAIL_FROM = process.env.EMAIL_FROM || 'Markham Restring Studio <markhamrestring@gmail.com>';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, booking, to, subject, html, text, customData } = body;

    // Check if Resend is configured
    if (!resend) {
      console.log('📧 Email API not configured - missing RESEND_API_KEY');
      return NextResponse.json(
        { 
          message: 'Email service not configured',
          error: 'RESEND_API_KEY environment variable is not set',
          development: true,
          type: type,
          to: to || booking?.email
        },
        { status: 503 }
      );
    }

    let emailData = {};

    // Handle different email types
    if (type && booking) {
      const template = emailTemplates[type];
      if (!template) {
        return NextResponse.json(
          { error: `Invalid email type: ${type}` },
          { status: 400 }
        );
      }
      
      emailData = template(booking);
      emailData.to = to || booking.email;
    } else if (to && subject && (html || text)) {
      // Custom email
      emailData = {
        to: to,
        subject: subject,
        html: html,
        text: text
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Either provide type+booking or to+subject+content' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if this is a customer email (not admin)
    const isCustomerEmail = emailData.to !== 'markhamrestring@gmail.com';
    
    // In development mode, send customer emails to admin instead
    let redirected = false;
    if (process.env.NODE_ENV === 'development' && isCustomerEmail) {
      console.log(`📧 Development mode: ${type || 'custom'} email redirected from ${emailData.to} to markhamrestring@gmail.com`);
      emailData.to = 'markhamrestring@gmail.com';
      redirected = true;
    }

    // Send email via Resend
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });

    console.log(`📧 ${type || 'custom'} email sent successfully via Resend:`, result);

    // For bookingSubmission and schedulePickup, also send to admin (in production)
    let adminResult = null;
    if ((type === 'bookingSubmission' || type === 'schedulePickup') && isCustomerEmail && process.env.NODE_ENV === 'production') {
      try {
        const adminEmailData = {
          ...emailData,
          to: 'markhamrestring@gmail.com',
          subject: `[ADMIN NOTIFICATION] ${emailData.subject}`
        };
        adminResult = await resend.emails.send({
          from: EMAIL_FROM,
          to: adminEmailData.to,
          subject: adminEmailData.subject,
          html: adminEmailData.html,
          text: adminEmailData.text
        });
        console.log(`📧 Admin notification sent for ${type} email:`, adminResult);
      } catch (adminError) {
        console.error('Failed to send admin notification:', adminError);
      }
    }

    // For completion emails, also send to admin (legacy logic)
    if (type === 'completion' && isCustomerEmail) {
      try {
        const adminEmailData = {
          ...emailData,
          to: 'markhamrestring@gmail.com',
          subject: `[ADMIN NOTIFICATION] ${emailData.subject}`
        };
        const adminResultCompletion = await resend.emails.send({
          from: EMAIL_FROM,
          to: adminEmailData.to,
          subject: adminEmailData.subject,
          html: adminEmailData.html,
          text: adminEmailData.text
        });
        console.log(`📧 Admin notification sent for completion email:`, adminResultCompletion);
      } catch (adminError) {
        console.error('Failed to send admin notification:', adminError);
      }
    }

    return NextResponse.json(
      { 
        message: 'Email sent successfully', 
        id: result.id,
        type: type,
        to: emailData.to,
        adminNotified: !!adminResult,
        redirected: redirected
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Handle specific Resend errors
    if (error.message && error.message.includes('validation_error')) {
      return NextResponse.json(
        { 
          error: 'Email validation failed', 
          details: 'Please ensure the email address is verified with Resend',
          resendError: error.message 
        },
        { status: 400 }
      );
    }
    
    if (error.message && error.message.includes('authentication')) {
      return NextResponse.json(
        { 
          error: 'Email service authentication failed', 
          details: 'Please check the API key configuration'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
} 