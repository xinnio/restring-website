import { docClient, generateId } from '../../../lib/dynamodb';
import { PutCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from 'next/server';

// Function to generate the next booking number
async function generateBookingNumber() {
  const tableName = process.env.BOOKINGS_TABLE;
  
  try {
    // Scan for the highest booking number
    const scanCommand = new ScanCommand({
      TableName: tableName,
      ProjectionExpression: 'bookingNumber',
      FilterExpression: 'attribute_exists(bookingNumber)',
    });
    
    const result = await docClient.send(scanCommand);
    
    if (!result.Items || result.Items.length === 0) {
      return 1000; // Start from 1000 if no bookings exist
    }
    
    // Find the highest booking number
    const highestNumber = Math.max(...result.Items.map(item => item.bookingNumber || 0));
    return highestNumber + 1;
  } catch (error) {
    console.error('Error generating booking number:', error);
    return Date.now(); // Fallback to timestamp
  }
}

export async function GET() {
  try {
    const tableName = process.env.BOOKINGS_TABLE;
    
    const scanCommand = new ScanCommand({
      TableName: tableName,
    });
    
    const result = await docClient.send(scanCommand);
    const bookings = result.Items || [];
    
    // Sort by createdAt (newest first)
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Database error:', error);
    // Always return an array, even on error
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const tableName = process.env.BOOKINGS_TABLE;
    const body = await request.json();
    
    // Generate booking number and ID
    const bookingNumber = await generateBookingNumber();
    const id = await generateId();
    
    const booking = {
      id,
      ...body,
      bookingNumber,
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: booking,
    });
    
    await docClient.send(putCommand);
    
    // Send email notifications
    try {
      await sendBookingEmails(booking);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the booking if email fails
    }
    
    return NextResponse.json({ 
      message: 'Booking created!', 
      id: id,
      bookingNumber: bookingNumber 
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Email notification function - sends emails for different booking stages
async function sendBookingEmails(booking) {
  try {
    // Validate booking data
    if (!booking) {
      console.error('sendBookingEmails: No booking data provided');
      return;
    }

    if (!booking.rackets || !Array.isArray(booking.rackets)) {
      console.error('sendBookingEmails: Invalid or missing rackets data:', booking.rackets);
      return;
    }

    // 1. Send booking submission email to customer (ONLY this email is sent automatically)
    try {
      const customerEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'bookingSubmission',
          booking: booking
        })
      });

      const customerEmailResult = await customerEmailResponse.json();
      
      if (!customerEmailResponse.ok) {
        console.error('Failed to send customer booking submission email:', customerEmailResult);
      } else {
        if (customerEmailResult.development) {
          console.log('📧 Customer booking submission email (development mode):', customerEmailResult);
        } else {
          console.log('📧 Customer booking submission email sent successfully');
        }
      }
    } catch (error) {
      console.error('Customer booking submission email error:', error);
    }

    // 2. Send admin notification email
    try {
      const formatTurnaroundTime = (time) => {
        switch (time) {
          case 'sameDay': return 'Same Day';
          case 'nextDay': return 'Next Day';
          case '3-5days': return '3-5 Business Days';
          default: return time;
        }
      };

      const formatLocation = (location) => {
        if (location === 'Door-to-Door (Delivery)') return 'Door-to-Door Delivery ($12)';
        return location;
      };

      // Format rackets details for admin email
      const racketsDetails = booking.rackets && Array.isArray(booking.rackets) 
        ? booking.rackets.map((racket, index) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${racket.racketType}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${booking.ownString ? 'Own String' : racket.stringName}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${booking.ownString ? 'N/A' : (racket.stringColor || 'Any')}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${racket.stringTension}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${racket.quantity}</td>
          </tr>
        `).join('')
        : '<tr><td colspan="6" style="padding: 8px; border: 1px solid #ddd; text-align: center;">No rackets data available</td></tr>';

      const priceDetails = calculateBookingCost(booking);

      const adminHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 25px; }
            .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .highlight { background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
            .total { font-size: 18px; font-weight: bold; color: #28a745; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎾 New Booking Received</h1>
            <p>Markham Restring Studio</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>📋 Customer Information</h3>
              <p><strong>Name:</strong> ${booking.fullName}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
            </div>

            <div class="section">
              <h3>🔍 Racket & String Details</h3>
              <table>
                <thead>
                  <tr>
                    <th style="padding: 8px; border: 1px solid #ddd;">#</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Racket Type</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">String</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Color</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Tension</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${racketsDetails}
                </tbody>
              </table>
              
              ${booking.ownString ? '<div class="highlight"><strong>⚠️ Customer providing own string</strong> (-$5.00 discount applied)</div>' : ''}
              ${booking.grommetReplacement ? '<div class="highlight"><strong>🔧 Grommet replacement requested</strong> (+$0.25 per grommet)</div>' : ''}
            </div>

            <div class="section">
              <h3>⚡ Service Options</h3>
              <p><strong>Turnaround Time:</strong> ${formatTurnaroundTime(booking.turnaroundTime)}</p>
              <p><strong>Drop-off Location:</strong> ${formatLocation(booking.dropoffLocation)}</p>
              ${booking.dropoffSlotId ? `<p><strong>Drop-off Time:</strong> ${booking.dropoffSlotId}</p>` : ''}
              <p><strong>Pickup Location:</strong> ${formatLocation(booking.pickupLocation)}</p>
              ${booking.pickupSlotId ? `<p><strong>Pickup Time:</strong> ${booking.pickupSlotId}</p>` : ''}
            </div>

            <div class="section">
              <h3>💰 Pricing Breakdown</h3>
              <p><strong>Base Price per Racket:</strong> $${priceDetails.basePrice}</p>
              <p><strong>Rackets Subtotal:</strong> $${priceDetails.racketsSubtotal}</p>
              <p><strong>Extras:</strong> $${priceDetails.extras}</p>
              <p><strong>Delivery Fee:</strong> $${priceDetails.deliveryFee}</p>
              <p class="total"><strong>Total:</strong> $${priceDetails.total}</p>
            </div>

            ${booking.notes ? `
            <div class="section">
              <h3>📝 Additional Notes</h3>
              <p>${booking.notes}</p>
            </div>
            ` : ''}

            <div class="section">
              <h3>📅 Booking Information</h3>
              <p><strong>Booking Number:</strong> #${booking.bookingNumber}</p>
              <p><strong>Booking ID:</strong> ${booking.id || 'Pending'}</p>
              <p><strong>Status:</strong> ${booking.status}</p>
              <p><strong>Created:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const adminTextContent = `
New Booking Received - Markham Restring Studio

CUSTOMER INFORMATION:
Name: ${booking.fullName}
Email: ${booking.email}
Phone: ${booking.phone}

RACKET & STRING DETAILS:
${booking.rackets.map((racket, index) => `${index + 1}. ${racket.racketType} - ${booking.ownString ? 'Own String' : racket.stringName} (${booking.ownString ? 'N/A' : (racket.stringColor || 'Any')}) - ${racket.stringTension} - Qty: ${racket.quantity}`).join('\n')}

${booking.ownString ? 'CUSTOMER PROVIDING OWN STRING (-$5.00 discount)' : ''}
${booking.grommetReplacement ? 'GROMMET REPLACEMENT REQUESTED (+$0.25 per grommet)' : ''}

SERVICE OPTIONS:
Turnaround Time: ${formatTurnaroundTime(booking.turnaroundTime)}
Drop-off Location: ${formatLocation(booking.dropoffLocation)}
${booking.dropoffSlotId ? `Drop-off Time: ${booking.dropoffSlotId}` : ''}
Pickup Location: ${formatLocation(booking.pickupLocation)}
${booking.pickupSlotId ? `Pickup Time: ${booking.pickupSlotId}` : ''}

PRICING:
Base Price per Racket: $${priceDetails.basePrice}
Rackets Subtotal: $${priceDetails.racketsSubtotal}
Extras: $${priceDetails.extras}
Delivery Fee: $${priceDetails.deliveryFee}
TOTAL: $${priceDetails.total}

${booking.notes ? `ADDITIONAL NOTES: ${booking.notes}` : ''}

Booking Number: #${booking.bookingNumber}
Booking ID: ${booking.id || 'Pending'}
Status: ${booking.status}
Created: ${new Date(booking.createdAt).toLocaleString()}
      `;

      const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'markhamrestring@gmail.com',
          subject: `🎾 New Booking - ${booking.fullName} - ${formatTurnaroundTime(booking.turnaroundTime)}`,
          html: adminHtmlContent,
          text: adminTextContent
        })
      });

      const adminEmailResult = await adminEmailResponse.json();
      
      if (!adminEmailResponse.ok) {
        console.error('Failed to send admin email notification:', adminEmailResult);
      } else {
        if (adminEmailResult.development) {
          console.log('📧 Admin email notification (development mode):', adminEmailResult);
        } else {
          console.log('📧 Admin email notification sent successfully');
        }
      }
    } catch (error) {
      console.error('Admin email notification error:', error);
    }

  } catch (error) {
    console.error('Email notification error:', error);
  }
}

function calculateBookingCost(booking) {
  // Per-racket base price (based on turnaroundTime)
  let basePrice = 0;
  switch (booking.turnaroundTime) {
    case 'sameDay': basePrice = 35; break;
    case 'nextDay': basePrice = 30; break;
    case '3-5days': basePrice = 25; break;
    default: basePrice = 25;
  }
  
  // Calculate subtotal for all rackets
  let racketsSubtotal = booking.rackets.reduce((sum, r) => sum + (basePrice * (parseInt(r.quantity) || 1)), 0);
  
  // Extras (apply to whole order)
  let extras = 0;
  if (booking.ownString) extras -= 5; // $5 discount for own string
  if (booking.grommetReplacement) extras += 0.25;
  
  let deliveryFee = 0;
  const dropoffDelivery = booking.dropoffLocation === 'Door-to-Door (Delivery)';
  const pickupDelivery = booking.pickupLocation === 'Door-to-Door (Delivery)';
  if (dropoffDelivery) deliveryFee += 12;
  if (pickupDelivery) deliveryFee += 12;
  if (dropoffDelivery && pickupDelivery) deliveryFee -= 4; // $4 discount if both
  
  const total = racketsSubtotal + extras + deliveryFee;
  
  return {
    basePrice,
    racketsSubtotal,
    extras,
    deliveryFee,
    total: total.toFixed(2),
  };
} 