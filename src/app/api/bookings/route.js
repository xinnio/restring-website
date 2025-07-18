import { getBookingsCollection } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const collection = await getBookingsCollection();
    const bookings = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Database error:', error);
    // Always return an array, even on error
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const collection = await getBookingsCollection();
    const body = await request.json();
    
    const booking = {
      ...body,
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(booking);
    
    // Send email notification (placeholder for now)
    try {
      await sendBookingNotification(booking);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the booking if email fails
    }
    
    return NextResponse.json({ message: 'Booking created!', id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// Email notification function (placeholder - would integrate with email service)
async function sendBookingNotification(booking) {
  // This would integrate with services like SendGrid, Mailgun, or AWS SES
  console.log('📧 Email notification would be sent for booking:', {
    to: booking.contactInfo,
    subject: 'Booking Confirmation - Markham Restring Studio',
    body: `
      Dear ${booking.fullName},
      
      Thank you for your booking with Markham Restring Studio!
      
      Booking Details:
      - Racket Type: ${booking.racketType}
      - String Type: ${booking.stringType}
      - Turnaround Time: ${booking.turnaroundTime}
      - Total Cost: $${calculateBookingCost(booking)}
      
      We'll contact you soon to arrange pickup/drop-off.
      
      Best regards,
      Markham Restring Studio
    `
  });
}

function calculateBookingCost(booking) {
  let basePrice = 0;
  switch (booking.turnaroundTime) {
    case 'sameDay': basePrice = 35; break;
    case 'nextDay': basePrice = 30; break;
    case '3-5days': basePrice = 25; break;
    default: basePrice = 25;
  }
  
  let extras = 0;
  if (booking.ownString) extras += 3;
  if (booking.grommetReplacement) extras += 0.25;
  
  return (basePrice + extras).toFixed(2);
} 