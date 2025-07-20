"use client";

import React, { useState } from 'react';

export default function BookingTable({ bookings = [], onUpdate }) {
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [viewing, setViewing] = useState(null); // booking object or null
  const [filterRange, setFilterRange] = useState('all'); // 'all', 'week', 'month'

  // Helper function to format string name to Brand-Model display
  const formatStringDisplay = (racket) => {
    if (!racket.stringName) return '-';
    
    // If the string has brand and model info, format as Brand-Model
    if (racket.stringBrand && racket.stringModel) {
      return `${racket.stringBrand}-${racket.stringModel}`;
    }
    
    // Otherwise return the original string name
    return racket.stringName;
  };

  // Helper function to format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    
    // Handle the format: "2025-01-19, 19:30 - 20:00"
    const [datePart, timePart] = dateTimeString.split(', ');
    if (!datePart || !timePart) return dateTimeString;
    
    const date = new Date(datePart);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}, ${timePart}`;
  };

  // Helper function to format slot ID to readable time
  const formatSlotTime = (slotId, formattedTime) => {
    if (formattedTime) return formattedTime;
    if (!slotId) return '-';
    
    // If it's already a formatted string (like "19/07/2025, 19:30 - 20:00"), return it
    if (typeof slotId === 'string' && slotId.includes('/') && slotId.includes(',')) {
      return slotId;
    }
    
    // If it's a slot ID, return a placeholder
    return `Slot ID: ${slotId}`;
  };

  // Function to generate print-friendly content
  function generatePrintContent(booking) {
    // Helper function to format date and time for print
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return '-';
      
      // Handle the format: "2025-01-19, 19:30 - 20:00"
      const [datePart, timePart] = dateTimeString.split(', ');
      if (!datePart || !timePart) return dateTimeString;
      
      const date = new Date(datePart);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}, ${timePart}`;
    };

    // Helper function to format slot ID to readable time for print
    const formatSlotTime = (slotId, formattedTime) => {
      if (formattedTime) return formattedTime;
      if (!slotId) return '-';
      
      // If it's already a formatted string (like "19/07/2025, 19:30 - 20:00"), return it
      if (typeof slotId === 'string' && slotId.includes('/') && slotId.includes(',')) {
        return slotId;
      }
      
      // If it's a slot ID, return a placeholder
      return `Slot ID: ${slotId}`;
    };

    const rackets = booking.rackets || [
      {
        racketType: booking.racketType,
        stringName: booking.stringName,
        stringColor: booking.stringColor,
        stringTension: booking.stringTension,
        quantity: booking.quantity || 1
      }
    ];

    const getBasePrice = (r) => {
      const t = r.turnaroundTime || booking.turnaroundTime;
      switch (t) {
        case 'sameDay': return 35;
        case 'nextDay': return 30;
        case '3-5days': return 25;
        default: return 0;
      }
    };

    let racketsSubtotal = 0;
    const racketDetails = rackets.map((r, idx) => {
      const basePrice = getBasePrice(r);
      const qty = parseInt(r.quantity) || 1;
      racketsSubtotal += basePrice * qty;
      
      // Format string display for print
      const stringDisplay = r.stringBrand && r.stringModel 
        ? `${r.stringBrand}-${r.stringModel}` 
        : (r.stringName || '-');
        
      return `
        <tr>
          <td>${qty}</td>
          <td>${r.racketType === 'tennis' ? 'Tennis' : 'Badminton'}</td>
          <td>${stringDisplay}</td>
          <td>${r.stringColor || '-'}</td>
          <td>${r.stringTension || '-'}</td>
          <td>$${basePrice}</td>
          <td>$${(basePrice * qty).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    let extras = 0;
    if (booking.ownString) extras += 3;
    if (booking.grommetReplacement) extras += 0.25;
    
    let deliveryFee = 0;
    const dropoffDelivery = booking.dropoffLocation === 'Door-to-Door (Delivery)';
    const pickupDelivery = booking.pickupLocation === 'Door-to-Door (Delivery)';
    if (dropoffDelivery) deliveryFee += 12;
    if (pickupDelivery) deliveryFee += 12;
    if (dropoffDelivery && pickupDelivery) deliveryFee -= 4;
    
    const total = racketsSubtotal + extras + deliveryFee;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Details - ${booking.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #555; }
          .racket-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .racket-table th, .racket-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .racket-table th { background-color: #f5f5f5; font-weight: bold; }
          .total-section { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; }
          .total-amount { font-size: 1.2em; font-weight: bold; color: #2e7d32; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 0.9em; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Markham Restring Studio</h1>
          <h2>Booking Details</h2>
          <p>Booking Number: #${booking.bookingNumber || 'N/A'}</p>
          <p>Booking ID: ${booking._id}</p>
          <p>Created: ${booking.createdAt ? new Date(booking.createdAt).toLocaleString() : '-'}</p>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name:</span> ${booking.fullName}
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span> ${booking.email || '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span> ${booking.phone || '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span> ${booking.status || 'Pending'}
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Racket & String Details</h3>
          <table class="racket-table">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Type</th>
                <th>String</th>
                <th>Color</th>
                <th>Tension</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${racketDetails}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3>Service Options</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Turnaround Time:</span> 
              ${booking.turnaroundTime === 'sameDay' ? 'Same Day' : 
                booking.turnaroundTime === 'nextDay' ? 'Next Day' : 
                booking.turnaroundTime === '3-5days' ? '3-5 Days' : '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Own String:</span> ${booking.ownString ? 'Yes' : 'No'}
            </div>
            <div class="info-item">
              <span class="info-label">Grommet Replacement:</span> ${booking.grommetReplacement ? 'Yes' : 'No'}
            </div>
            <div class="info-item">
              <span class="info-label">Payment Status:</span> ${booking.paymentStatus || 'Pending'}
            </div>
            <div class="info-item">
              <span class="info-label">Terms & Conditions:</span> ${booking.agreeToTerms ? '✅ Agreed' : '❌ Not Agreed'}
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Scheduling</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Drop-Off Location:</span> ${booking.dropoffLocation || '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Drop-Off Time:</span> ${formatSlotTime(booking.dropoffSlotId, booking.dropoffTime)}
            </div>
            <div class="info-item">
              <span class="info-label">Pick-up Location:</span> ${booking.pickupLocation || '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Pick-up Time:</span> ${formatSlotTime(booking.pickupSlotId, booking.pickupTime)}
            </div>
            ${booking.pickupDate ? `
            <div class="info-item">
              <span class="info-label">Pick-up Date:</span> ${new Date(booking.pickupDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            ` : ''}
            ${booking.pickupStartTime && booking.pickupEndTime ? `
            <div class="info-item">
              <span class="info-label">Pick-up Time Range:</span> ${booking.pickupStartTime} - ${booking.pickupEndTime}
            </div>
            ` : ''}
            ${booking.pickupWindow ? `
            <div class="info-item">
              <span class="info-label">Pick-up Window:</span> ${booking.pickupWindow}
            </div>
            ` : ''}
            ${booking.specialPickupRequest ? `
            <div class="info-item">
              <span class="info-label">Special Pickup Request:</span> ${booking.specialPickupRequest}
            </div>
            ` : ''}
            ${booking.deliveryAddress ? `
            <div class="info-item">
              <span class="info-label">Delivery Address:</span> ${booking.deliveryAddress}
            </div>
            ` : ''}
            ${booking.pickupScheduledAt ? `
            <div class="info-item">
              <span class="info-label">Pickup Scheduled:</span> ${new Date(booking.pickupScheduledAt).toLocaleString()}
            </div>
            ` : ''}
          </div>
        </div>

        ${booking.notes ? `
        <div class="section">
          <h3>Notes</h3>
          <p>${booking.notes}</p>
        </div>
        ` : ''}

        <div class="section">
          <h3>Terms & Conditions Agreement</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Agreement Status:</span> 
              <span style="color: ${booking.agreeToTerms ? '#28a745' : '#dc3545'}; font-weight: bold;">
                ${booking.agreeToTerms ? '✅ AGREED' : '❌ NOT AGREED'}
              </span>
            </div>
            ${booking.agreeToTerms ? `
            <div class="info-item">
              <span class="info-label">Agreement Date:</span> ${booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '-'}
            </div>
            ` : ''}
          </div>
          ${booking.agreeToTerms ? `
          <p style="margin-top: 10px; font-style: italic; color: #666;">
            Customer has agreed to all terms and conditions including booking, service, liability, and cancellation policies.
          </p>
          ` : `
          <p style="margin-top: 10px; font-style: italic; color: #dc3545;">
            ⚠️ Customer has NOT agreed to the terms and conditions. This booking may not be valid.
          </p>
          `}
        </div>

        <div class="total-section">
          <h3>Price Breakdown</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Rackets Subtotal:</span> $${racketsSubtotal.toFixed(2)}
            </div>
            ${booking.ownString ? `
            <div class="info-item">
              <span class="info-label">Own String Discount:</span> -$5.00
            </div>
            ` : ''}
            ${booking.grommetReplacement ? `
            <div class="info-item">
              <span class="info-label">Grommet Replacement:</span> 4 FREE per racket, +$0.25 each additional
            </div>
            ` : ''}
            ${dropoffDelivery ? `
            <div class="info-item">
              <span class="info-label">Drop-off Delivery:</span> +$12.00
            </div>
            ` : ''}
            ${pickupDelivery ? `
            <div class="info-item">
              <span class="info-label">Pick-up Delivery:</span> +$12.00
            </div>
            ` : ''}
            ${dropoffDelivery && pickupDelivery ? `
            <div class="info-item">
              <span class="info-label">Both Delivery Discount:</span> -$4.00
            </div>
            ` : ''}
          </div>
          <div class="total-amount">
            Total: $${total.toFixed(2)}
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Markham Restring Studio!</p>
          <p>For questions, contact us at markhamrestring@gmail.com</p>
        </div>
      </body>
      </html>
    `;
  }

  // Helper to get start of week/month
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
  }
  function getStartOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  // Filter bookings by week/month
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const startOfMonth = getStartOfMonth(now);
  const filteredBookings = bookings.filter(b => {
    if (filterRange === 'all') return true;
    const created = b.createdAt ? new Date(b.createdAt) : null;
    if (!created) return false;
    if (filterRange === 'week') {
      return created >= startOfWeek && created <= now;
    }
    if (filterRange === 'month') {
      return created >= startOfMonth && created <= now;
    }
    return true;
  });

  async function handleStatusUpdate(bookingId, newStatus) {
    setUpdating(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function handlePaymentUpdate(bookingId, paymentStatus) {
    setUpdating(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setUpdating(null);
    }
  }

  async function handleDelete(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setDeleting(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setDeleting(null);
    }
  }

  async function handleSendCompletionEmail(booking) {
    setSendingEmail(booking._id);
    try {
      const baseUrl = window.location.origin;
      const pickupUrl = `${baseUrl}/pickup-booking`;
      
      const emailData = {
        to: booking.email,
        subject: `🎾 Your Racket Stringing is Complete - Booking #${booking.bookingNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .section { margin-bottom: 25px; }
              .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
              .highlight { background-color: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
              .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 0.9rem; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎾 Stringing Complete!</h1>
              <p>Markham Restring Studio</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <h3>✅ Your racket stringing is complete!</h3>
                <p>Dear ${booking.fullName},</p>
                <p>Great news! Your racket stringing service has been completed and is ready for pickup.</p>
              </div>

              <div class="section">
                <h3>📋 Booking Details</h3>
                <p><strong>Booking Number:</strong> #${booking.bookingNumber}</p>
                <p><strong>Customer:</strong> ${booking.fullName}</p>
                <p><strong>Phone:</strong> ${booking.phone || 'Not provided'}</p>
                <p><strong>Email:</strong> ${booking.email || 'Not provided'}</p>
                ${booking.pickupLocation ? `<p><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>` : ''}
                ${booking.pickupTime ? `<p><strong>Pickup Time:</strong> ${booking.pickupTime}</p>` : ''}
                ${booking.pickupDate ? `<p><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>` : ''}
                ${booking.pickupWindow ? `<p><strong>Pickup Window:</strong> ${booking.pickupWindow}</p>` : ''}
                ${booking.specialPickupRequest ? `<p><strong>Special Pickup Request:</strong> ${booking.specialPickupRequest}</p>` : ''}
              </div>

              <div class="section">
                <h3>📅 Schedule Your Pickup</h3>
                <p>Please click the button below to schedule your pickup time:</p>
                <a href="${pickupUrl}" class="button">📅 Schedule Pickup Time</a>
                <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                  Or copy and paste this link: <a href="${pickupUrl}">${pickupUrl}</a>
                </p>
              </div>

              <div class="section">
                <h3>📞 Need Help?</h3>
                <p>If you have any questions or need assistance, please contact us:</p>
                <p><strong>Phone:</strong> (647) 655-3658</p>
                <p><strong>Email:</strong> markhamrestring@gmail.com</p>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Markham Restring Studio!</p>
              <p>Professional racket stringing with quality strings and expert care.</p>
            </div>
          </body>
          </html>
        `,
        text: `
Stringing Complete - Markham Restring Studio

Dear ${booking.fullName},

Great news! Your racket stringing service has been completed and is ready for pickup.

BOOKING DETAILS:
Booking Number: #${booking.bookingNumber}
Customer: ${booking.fullName}
Phone: ${booking.phone || 'Not provided'}
Email: ${booking.email || 'Not provided'}
${booking.pickupLocation ? `Pickup Location: ${booking.pickupLocation}` : ''}
${booking.pickupTime ? `Pickup Time: ${booking.pickupTime}` : ''}
${booking.pickupDate ? `Pickup Date: ${new Date(booking.pickupDate).toLocaleDateString('en-GB', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}` : ''}
${booking.pickupWindow ? `Pickup Window: ${booking.pickupWindow}` : ''}
${booking.specialPickupRequest ? `Special Pickup Request: ${booking.specialPickupRequest}` : ''}

SCHEDULE YOUR PICKUP:
Please visit the following link to schedule your pickup time:
${pickupUrl}

NEED HELP?
If you have any questions or need assistance, please contact us:
Phone: (647) 655-3658
Email: markhamrestring@gmail.com

Thank you for choosing Markham Restring Studio!
        `
      };

      const res = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (res.ok) {
        alert('Completion email sent successfully!');
      } else {
        alert('Failed to send completion email');
      }
    } catch (error) {
      console.error('Error sending completion email:', error);
      alert('Error sending completion email');
    } finally {
      setSendingEmail(null);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Pending': return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case 'In Progress': return { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' };
      case 'Completed': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      default: return { bg: '#f8f9fa', color: '#6c757d', border: '#e9ecef' };
    }
  }

  function getPaymentStatusColor(status) {
    switch (status) {
      case 'Pending': return { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' };
      case 'Paid': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      default: return { bg: '#f8f9fa', color: '#6c757d', border: '#e9ecef' };
    }
  }

  // --- Price Calculation Helper ---
  function calculateBookingTotal(b) {
    // Support both old and new booking formats
    const rackets = b.rackets || [
      {
        racketType: b.racketType,
        stringName: b.stringName,
        stringColor: b.stringColor,
        stringTension: b.stringTension,
        quantity: b.quantity || 1
      }
    ];
    let basePrice = 0;
    switch (b.turnaroundTime) {
      case 'sameDay': basePrice = 35; break;
      case 'nextDay': basePrice = 30; break;
      case '3-5days': basePrice = 25; break;
      default: basePrice = 0;
    }
    let racketsSubtotal = rackets.reduce((sum, r) => sum + (basePrice * (parseInt(r.quantity) || 1)), 0);
    let extras = 0;
    if (b.ownString) extras += 3;
    if (b.grommetReplacement) extras += 0.25;
    let deliveryFee = 0;
    const dropoffDelivery = b.dropoffLocation === 'Door-to-Door (Delivery)';
    const pickupDelivery = b.pickupLocation === 'Door-to-Door (Delivery)';
    if (dropoffDelivery) deliveryFee += 12;
    if (pickupDelivery) deliveryFee += 12;
    if (dropoffDelivery && pickupDelivery) deliveryFee -= 4;
    return racketsSubtotal + extras + deliveryFee;
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Dashboard Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#1a1a1a',
            margin: '0 0 0.5rem 0'
          }}>
            📋 Bookings Management
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '1rem',
            margin: 0
          }}>
            Manage and track all customer bookings efficiently
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem'
        }}>
          <div style={{ 
            padding: '0.75rem 1.25rem', 
            backgroundColor: '#e8f5e8', 
            color: '#2e7d32', 
            borderRadius: '12px', 
            fontSize: '0.95rem', 
            fontWeight: '600',
            border: '1px solid #c8e6c9'
          }}>
            📊 {filteredBookings.length} Bookings
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ 
              fontWeight: 600, 
              color: '#495057',
              fontSize: '0.9rem'
            }}>
              Time Filter:
            </label>
            <select 
              value={filterRange} 
              onChange={e => setFilterRange(e.target.value)} 
              style={{ 
                padding: '0.6rem 1rem', 
                borderRadius: '8px', 
                border: '2px solid #e9ecef', 
                fontSize: '0.9rem',
                backgroundColor: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef'
              }}>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Booking #</th>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Customer</th>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Racket Details</th>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Status</th>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Payment</th>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Total Price</th>
                <th style={{ 
                  padding: '1.25rem 1rem', 
                  textAlign: 'left', 
                  fontWeight: '700',
                  color: '#1a1a1a',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ 
                    padding: '4rem 2rem', 
                    textAlign: 'center', 
                    color: '#6c757d',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      margin: '0 auto 1.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem'
                    }}>
                      📋
                    </div>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      marginBottom: '0.75rem', 
                      color: '#1a1a1a' 
                    }}>
                      No bookings found
                    </h3>
                    <p style={{ 
                      color: '#666', 
                      fontSize: '1rem',
                      maxWidth: '400px',
                      margin: '0 auto'
                    }}>
                      {filterRange === 'all' 
                        ? 'No bookings have been created yet. They will appear here once customers start using your service.'
                        : `No bookings found for ${filterRange === 'week' ? 'this week' : 'this month'}. Try adjusting your time filter.`
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const statusColors = getStatusColor(b.status || 'Pending');
                  const paymentColors = getPaymentStatusColor(b.paymentStatus || 'Pending');
                  const isCancelled = b.status === 'Cancelled';
                  
                  return (
                    <tr key={b._id} style={{ 
                      borderBottom: '1px solid #e9ecef',
                      transition: 'all 0.2s ease',
                      backgroundColor: isCancelled ? '#f8d7da' : 'white',
                      color: isCancelled ? '#888' : '#1a1a1a',
                      ':hover': {
                        backgroundColor: isCancelled ? '#f8d7da' : '#f8f9fa'
                      }
                    }}>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ 
                          fontWeight: '700', 
                          color: '#667eea',
                          fontSize: '1.1rem',
                          textAlign: 'center',
                          padding: '0.5rem',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}>
                          #{b.bookingNumber || 'N/A'}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div>
                          <div style={{ 
                            fontWeight: '700', 
                            color: '#1a1a1a',
                            marginBottom: '0.5rem',
                            fontSize: '1rem'
                          }}>
                            {b.fullName}
                          </div>
                          <div style={{ 
                            color: '#666', 
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            width: 'fit-content'
                          }}>
                            📞 {b.phone || b.contactInfo || 'No contact info'}
                          </div>
                          {b.email && (
                            <div style={{ 
                              color: '#667eea', 
                              fontSize: '0.85rem',
                              marginTop: '0.25rem'
                            }}>
                              ✉️ {b.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          {(b.rackets && Array.isArray(b.rackets)) ? (
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              {b.rackets.map((r, idx) => (
                                <li key={idx} style={{ marginBottom: 6, listStyle: 'disc', color: '#333', fontSize: '0.95rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                      padding: '0.25rem 0.5rem',
                                      backgroundColor: r.racketType === 'tennis' ? '#e3f2fd' : '#f3e5f5',
                                      color: r.racketType === 'tennis' ? '#1976d2' : '#7b1fa2',
                                      borderRadius: '12px',
                                      fontSize: '0.8rem',
                                      fontWeight: '500',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}>
                                      {r.racketType === 'tennis' ? '🎾 Tennis' : '🏸 Badminton'}
                                    </span>
                                    <span style={{ color: '#333', fontSize: '0.92rem' }}>
                                      <strong>String:</strong> {b.ownString ? 'Own String' : formatStringDisplay(r)} | <strong>Color:</strong> {b.ownString ? 'N/A' : (r.stringColor || '-')} | <strong>Tension:</strong> {r.stringTension || '-'} | <strong>Qty:</strong> {r.quantity || 1}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              <li style={{ marginBottom: 6, listStyle: 'disc', color: '#333', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: b.racketType === 'tennis' ? '#e3f2fd' : '#f3e5f5',
                                    color: b.racketType === 'tennis' ? '#1976d2' : '#7b1fa2',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4
                                  }}>
                                    {b.racketType === 'tennis' ? '🎾 Tennis' : '🏸 Badminton'}
                                  </span>
                                  <span style={{ color: '#333', fontSize: '0.92rem' }}>
                                    <strong>String:</strong> {b.ownString ? 'Own String' : formatStringDisplay(b)} | <strong>Color:</strong> {b.ownString ? 'N/A' : (b.stringColor || '-')} | <strong>Tension:</strong> {b.stringTension || '-'} | <strong>Qty:</strong> {b.quantity || 1}
                                  </span>
                                </div>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <select 
                            value={b.status || 'Pending'} 
                            onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                            disabled={updating === b._id || isCancelled}
                            style={{ 
                              backgroundColor: statusColors.bg,
                              color: statusColors.color,
                              border: `2px solid ${statusColors.border}`,
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: isCancelled ? 'not-allowed' : 'pointer',
                              minWidth: '140px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="In Progress">🔄 In Progress</option>
                            <option value="Completed">✅ Completed</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                          {updating === b._id && (
                            <div style={{ 
                              fontSize: '0.8rem',
                              color: '#666',
                              textAlign: 'center',
                              padding: '0.25rem',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '4px'
                            }}>
                              ⏳ Updating...
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <select 
                            value={b.paymentStatus || 'Pending'} 
                            onChange={(e) => handlePaymentUpdate(b._id, e.target.value)}
                            disabled={updating === b._id || isCancelled}
                            style={{ 
                              backgroundColor: paymentColors.bg,
                              color: paymentColors.color,
                              border: `2px solid ${paymentColors.border}`,
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: isCancelled ? 'not-allowed' : 'pointer',
                              minWidth: '120px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Paid">💰 Paid</option>
                          </select>
                          {b.paymentReceivedAt && (
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: '#28a745', 
                              textAlign: 'center',
                              padding: '0.25rem',
                              backgroundColor: '#d4edda',
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}>
                              💰 {new Date(b.paymentReceivedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ 
                          fontWeight: '700', 
                          color: '#2e7d32',
                          fontSize: '1.1rem',
                          textAlign: 'center',
                          padding: '0.75rem',
                          backgroundColor: '#e8f5e8',
                          borderRadius: '8px',
                          border: '2px solid #c8e6c9'
                        }}>
                          ${calculateBookingTotal(b).toFixed(2)}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setViewing(b)}
                            disabled={isCancelled}
                            style={{
                              fontSize: '0.85rem',
                              padding: '0.75rem 1rem',
                              backgroundColor: '#667eea',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                              minWidth: '80px'
                            }}
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(b._id, 'Completed')}
                            disabled={updating === b._id || isCancelled}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.75rem 1rem',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: updating === b._id || isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
                              minWidth: '100px'
                            }}
                          >
                            ✅ Complete
                          </button>
                          <button 
                            onClick={() => handleSendCompletionEmail(b)}
                            disabled={sendingEmail === b._id || isCancelled || !b.email}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.75rem 1rem',
                              backgroundColor: sendingEmail === b._id ? '#6c757d' : '#ff6b35',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: sendingEmail === b._id || isCancelled || !b.email ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              opacity: isCancelled || !b.email ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                              boxShadow: sendingEmail === b._id ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.3)',
                              minWidth: '90px'
                            }}
                            title={!b.email ? 'No email address available' : 'Send completion email to customer'}
                          >
                            {sendingEmail === b._id ? '📧 Sending...' : '📧 Email'}
                          </button>
                          <button 
                            onClick={() => handlePaymentUpdate(b._id, 'Paid')}
                            disabled={updating === b._id || b.paymentStatus === 'Paid' || isCancelled}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.75rem 1rem',
                              backgroundColor: b.paymentStatus === 'Paid' ? '#6c757d' : '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: updating === b._id || b.paymentStatus === 'Paid' || isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                              boxShadow: b.paymentStatus === 'Paid' ? 'none' : '0 2px 8px rgba(23, 162, 184, 0.3)',
                              minWidth: '100px'
                            }}
                          >
                            💰 Mark Paid
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(b._id, 'Cancelled')}
                            disabled={updating === b._id || isCancelled}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.75rem 1rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: updating === b._id || isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                              minWidth: '90px'
                            }}
                          >
                            {isCancelled ? '❌ Cancelled' : '❌ Cancel'}
                          </button>
                          <button 
                            onClick={() => handleDelete(b._id)}
                            disabled={deleting === b._id}
                            style={{ 
                              fontSize: '0.85rem', 
                              padding: '0.75rem 1rem',
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: deleting === b._id ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              opacity: deleting === b._id ? 0.5 : 1,
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)',
                              minWidth: '90px'
                            }}
                          >
                            {deleting === b._id ? '🗑️ Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.25)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: '2.5rem',
            minWidth: '350px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button onClick={() => setViewing(null)} style={{ position: 'absolute', top: 18, right: 24, background: 'none', border: 'none', fontSize: '2rem', color: '#6c63ff', cursor: 'pointer' }}>&times;</button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Booking Details</h2>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  const printContent = generatePrintContent(viewing);
                  printWindow.document.write(printContent);
                  printWindow.document.close();
                  printWindow.print();
                }}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginRight: '2rem'
                }}
              >
                🖨️ Print
              </button>
            </div>
            {/* Personal Info */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Booking Number:</strong> #{viewing.bookingNumber || 'N/A'}<br/>
              <strong>Customer:</strong> {viewing.fullName}<br/>
              <strong>Email:</strong> {viewing.email || '-'}<br/>
              <strong>Phone:</strong> {viewing.phone || '-'}
            </div>
            {/* Racket & String Details */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Racket & String Details:</strong>
              {(viewing.rackets && Array.isArray(viewing.rackets)) ? (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {viewing.rackets.map((r, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e3e3e3',
                      borderRadius: '10px',
                      padding: '0.75rem 1.25rem',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: r.racketType === 'tennis' ? '#e3f2fd' : '#f3e5f5',
                        color: r.racketType === 'tennis' ? '#1976d2' : '#7b1fa2',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {r.racketType === 'tennis' ? '🎾 Tennis' : '🏸 Badminton'}
                      </span>
                      <span style={{ color: '#333', fontSize: '1rem' }}>
                        <strong>String:</strong> {viewing.ownString ? 'Own String' : formatStringDisplay(r)}
                      </span>
                      <span style={{ color: '#333', fontSize: '1rem' }}>
                        <strong>Color:</strong> {viewing.ownString ? 'N/A' : (r.stringColor || '-')}
                      </span>
                      <span style={{ color: '#333', fontSize: '1rem' }}>
                        <strong>Tension:</strong> {r.stringTension || '-'}
                      </span>
                      <span style={{ color: '#333', fontSize: '1rem' }}>
                        <strong>Qty:</strong> {r.quantity || 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: '0.75rem', border: '1px solid #e3e3e3', borderRadius: '10px', padding: '0.75rem 1.25rem', background: '#f8f9fa', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: viewing.racketType === 'tennis' ? '#e3f2fd' : '#f3e5f5',
                    color: viewing.racketType === 'tennis' ? '#1976d2' : '#7b1fa2',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    {viewing.racketType === 'tennis' ? '🎾 Tennis' : '🏸 Badminton'}
                  </span>
                  <span style={{ color: '#333', fontSize: '1rem' }}>
                    <strong>String:</strong> {viewing.ownString ? 'Own String' : formatStringDisplay(viewing)}
                  </span>
                  <span style={{ color: '#333', fontSize: '1rem' }}>
                    <strong>Color:</strong> {viewing.ownString ? 'N/A' : (viewing.stringColor || '-')}
                  </span>
                  <span style={{ color: '#333', fontSize: '1rem' }}>
                    <strong>Tension:</strong> {viewing.stringTension || '-'}
                  </span>
                  <span style={{ color: '#333', fontSize: '1rem' }}>
                    <strong>Qty:</strong> {viewing.quantity || 1}
                  </span>
                </div>
              )}
            </div>
            {/* Service Options */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Service Options:</strong><br/>
              <span>Turnaround: {viewing.turnaroundTime === 'sameDay' ? 'Same Day' : viewing.turnaroundTime === 'nextDay' ? 'Next Day' : viewing.turnaroundTime === '3-5days' ? '3-5 Days' : '-'}</span><br/>
              <span>Own String: {viewing.ownString ? 'Yes' : 'No'}</span><br/>
              <span>Grommet Replacement: {viewing.grommetReplacement ? 'Yes' : 'No'}</span>
            </div>
            {/* Scheduling */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Scheduling:</strong><br/>
              <span>Drop-Off Location: {viewing.dropoffLocation || '-'}</span><br/>
              <span>Drop-Off Time: {formatSlotTime(viewing.dropoffSlotId, viewing.dropoffTime)}</span><br/>
              <span>Pick-up Location: {viewing.pickupLocation || '-'}</span><br/>
              <span>Pick-up Time: {formatSlotTime(viewing.pickupSlotId, viewing.pickupTime)}</span><br/>
              {viewing.pickupDate && (
                <span>Pick-up Date: {new Date(viewing.pickupDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              )}
              {viewing.pickupDate && <br/>}
              {viewing.pickupStartTime && viewing.pickupEndTime && (
                <span>Pick-up Time Range: {viewing.pickupStartTime} - {viewing.pickupEndTime}</span>
              )}
              {viewing.pickupStartTime && viewing.pickupEndTime && <br/>}
              {viewing.pickupWindow && (
                <span>Pick-up Window: {viewing.pickupWindow}</span>
              )}
              {viewing.pickupWindow && <br/>}
              {viewing.specialPickupRequest ? (
                <span>Special Pickup Request: {viewing.specialPickupRequest}</span>
              ) : null}
              {viewing.specialPickupRequest && <br/>}
              {viewing.deliveryAddress ? (
                <span>Delivery Address: {viewing.deliveryAddress}</span>
              ) : null}
              {viewing.deliveryAddress && <br/>}
              {viewing.pickupScheduledAt && (
                <span>Pickup Scheduled: {new Date(viewing.pickupScheduledAt).toLocaleString()}</span>
              )}
            </div>
            {/* Status & Payment */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Status:</strong> {viewing.status || '-'}<br/>
              <strong>Payment:</strong> {viewing.paymentStatus || '-'}
            </div>
            {/* Terms and Conditions Agreement */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Terms & Conditions:</strong> 
              <span style={{ 
                color: viewing.agreeToTerms ? '#28a745' : '#dc3545', 
                fontWeight: '600',
                marginLeft: '0.5rem'
              }}>
                {viewing.agreeToTerms ? '✅ Agreed' : '❌ Not Agreed'}
              </span>
              {viewing.agreeToTerms && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.9rem', 
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  Customer has agreed to all terms and conditions including booking, service, liability, and cancellation policies.
                </div>
              )}
            </div>
            {/* Notes */}
            {viewing.notes && (
              <div style={{ marginBottom: '1.25rem' }}>
                <strong>Notes:</strong> {viewing.notes}
              </div>
            )}
            <div style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.95rem' }}>
              <em>Created: {viewing.createdAt ? new Date(viewing.createdAt).toLocaleString() : '-'}</em>
            </div>
            {/* Estimated Total Breakdown */}
            <div style={{
              marginTop: '2rem',
              background: '#e8f5e8',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '2px solid #4caf50',
              textAlign: 'center',
              color: '#2e7d32'
            }}>
              {(() => {
                // --- Per-racket price calculation ---
                const rackets = viewing.rackets || [
                  {
                    racketType: viewing.racketType,
                    stringName: viewing.stringName,
                    stringColor: viewing.stringColor,
                    stringTension: viewing.stringTension,
                    quantity: viewing.quantity || 1,
                    turnaroundTime: viewing.turnaroundTime
                  }
                ];
                // If turnaroundTime can differ per racket, use r.turnaroundTime, else fallback to booking
                function getBasePrice(r) {
                  const t = r.turnaroundTime || viewing.turnaroundTime;
                  switch (t) {
                    case 'sameDay': return 35;
                    case 'nextDay': return 30;
                    case '3-5days': return 25;
                    default: return 0;
                  }
                }
                let racketsSubtotal = 0;
                let breakdownLines = rackets.map((r, idx) => {
                  const basePrice = getBasePrice(r);
                  const qty = parseInt(r.quantity) || 1;
                  racketsSubtotal += basePrice * qty;
                  return (
                    <li key={idx}>
                      {qty} × ${basePrice} ({r.racketType === 'tennis' ? 'Tennis' : 'Badminton'}
                      {r.stringName ? `, ${r.stringName}` : ''}
                      {r.stringColor ? `, ${r.stringColor}` : ''}
                      {r.stringTension ? `, ${r.stringTension}` : ''}
                      )
                    </li>
                  );
                });
                let extras = 0;
                if (viewing.ownString) extras -= 5; // $5 discount for own string
                if (viewing.grommetReplacement) extras += 0.25;
                let deliveryFee = 0;
                const dropoffDelivery = viewing.dropoffLocation === 'Door-to-Door (Delivery)';
                const pickupDelivery = viewing.pickupLocation === 'Door-to-Door (Delivery)';
                if (dropoffDelivery) deliveryFee += 12;
                if (pickupDelivery) deliveryFee += 12;
                if (dropoffDelivery && pickupDelivery) deliveryFee -= 4;
                const total = racketsSubtotal + extras + deliveryFee;
                return (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 8 }}>
                      Estimated Total: ${total.toFixed(2)}
                    </div>
                    <div style={{ color: '#2e7d32', fontSize: '0.98rem', textAlign: 'left', maxWidth: 350, margin: '0 auto' }}>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {breakdownLines}
                        <li><strong>Subtotal:</strong> ${racketsSubtotal.toFixed(2)}</li>
                        {viewing.ownString && <li>Own string: -$5.00 discount</li>}
                        {viewing.grommetReplacement && <li>Grommet replacement: 4 FREE per racket, +$0.25 each additional</li>}
                        {dropoffDelivery && <li>Drop-off Delivery: +$12.00</li>}
                        {pickupDelivery && <li>Pick-up Delivery: +$12.00</li>}
                        {dropoffDelivery && pickupDelivery && <li>Both Delivery Discount: -$4.00</li>}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 