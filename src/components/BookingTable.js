"use client";

import React, { useState } from 'react';
import { useEffect } from 'react';

export default function BookingTable({ bookings = [], onUpdate }) {
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(null);
  const [viewing, setViewing] = useState(null); // booking object or null
  const [filterRange, setFilterRange] = useState('all'); // 'all', 'week', 'month'
  const [emailDropdown, setEmailDropdown] = useState(null); // booking ID or null for email dropdown
  const [pickupTimeModal, setPickupTimeModal] = useState({ open: false, booking: null });
  const [actualPickupTime, setActualPickupTime] = useState('');

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

  // Helper to format tension display
  function formatTension(r) {
    if (r.stringTensionLabel) {
      // If label contains a number (e.g., 'Beginner (50-54)'), show only the label
      if (/\d/.test(r.stringTensionLabel)) {
        return r.stringTensionLabel;
      }
      // If label does not contain a number but stringTension is present, show 'label (X lbs)'
      if (r.stringTension) {
        return `${r.stringTensionLabel} (${r.stringTension} lbs)`;
      }
      return r.stringTensionLabel;
    }
    if (r.stringTension) {
      return `${r.stringTension} lbs`;
    }
    return '-';
  }

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
          <p>Booking ID: ${booking.id}</p>
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

    console.log('Attempting to delete booking with ID:', bookingId);
    console.log('Booking data structure:', bookings.find(b => b.id === bookingId));
    setDeleting(bookingId);
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      
      const responseData = await res.json();
      console.log('Delete booking response:', responseData);
      
      if (res.ok) {
        alert('Booking deleted successfully!');
        if (onUpdate) {
        onUpdate();
        }
      } else if (res.status === 404) {
        // Booking was already deleted or doesn't exist
        alert('This booking has already been deleted or does not exist. Refreshing data...');
        if (onUpdate) {
          onUpdate();
        }
      } else {
        const errorMessage = responseData.details || responseData.error || 'Error deleting booking. Please try again.';
        alert(errorMessage);
        // Refresh data even on error to ensure UI is up to date
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking. Please try again.');
    } finally {
      setDeleting(null);
    }
  }



  // New email handlers for different email types
  async function handleSendEmail(booking, emailType) {
    setSendingEmail(booking.id);
    setEmailDropdown(null); // Close dropdown
    
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emailType,
          booking: booking
        })
      });

      const result = await res.json();

      if (res.ok) {
        if (result.development) {
          alert(`${emailType} email would be sent in production.\nTo: ${result.to}\nSubject: ${result.subject}`);
        } else if (result.redirected) {
          alert(`📧 ${emailType} email sent to admin (${booking.email} redirected due to Resend testing mode).\n\nTo send emails to customers:\n1. Go to resend.com/domains\n2. Verify your domain\n3. Update the 'from' address to use your domain`);
        } else {
          // Show a clear success message for customer and admin emails
          let msg = `📧 ${emailType} email sent successfully!`;
          if (result.adminNotified) {
            msg += `\nA copy was also sent to admin (markhamrestring@gmail.com).`;
          }
          alert(msg);
        }
      } else {
        console.error('Email API error:', result);
        if (result.error && result.error.includes('RESEND_API_KEY')) {
          alert('Email service not configured. Please set up the RESEND_API_KEY environment variable.');
        } else {
          alert(`Failed to send ${emailType} email: ${result.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error(`Error sending ${emailType} email:`, error);
      alert(`Error sending ${emailType} email. Please check the console for details.`);
    } finally {
      setSendingEmail(null);
    }
  }

  async function handleSendConfirmationEmail(booking) {
    await handleSendEmail(booking, 'confirmation');
  }

  async function handleSendCompletionEmail(booking) {
    await handleSendEmail(booking, 'completion');
  }

  async function handleSendPickupEmail(booking) {
    await handleSendEmail(booking, 'pickup');
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emailDropdown && !event.target.closest('[data-email-dropdown]')) {
        console.log('Click outside detected, closing email dropdown');
        setEmailDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [emailDropdown]);

  function handleSaveActualPickupTime() {
    if (!pickupTimeModal.booking || !actualPickupTime) {
      setPickupTimeModal({ open: false, booking: null });
      setActualPickupTime('');
      return;
    }
    setUpdating(pickupTimeModal.booking.id);
    fetch(`/api/bookings/${pickupTimeModal.booking.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actualPickupTime }),
    }).then(() => {
      setPickupTimeModal({ open: false, booking: null });
      setActualPickupTime('');
      // Update the local viewing object if it matches
      if (viewing && viewing.id === pickupTimeModal.booking.id) {
        setViewing({ ...viewing, actualPickupTime });
      }
      if (onUpdate) onUpdate();
      setUpdating(null);
    }).catch(() => {
      setPickupTimeModal({ open: false, booking: null });
      setActualPickupTime('');
      setUpdating(null);
    });
  }

  async function handleCompleteWithPickupTime(booking) {
    setUpdating(booking.id);
    try {
      const now = new Date().toISOString();
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed', autoPickupTime: now }),
      });
      if (res.ok && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error completing booking:', error);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'auto' }}>
      {/* Dashboard Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ 
            display: 'inline-block',
            background: '#e8f5e8',
            color: '#2e7d32', 
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            border: '1px solid #c8e6c9'
          }}>
            📊 {filteredBookings.length} Bookings
          </span>
          <label style={{ fontWeight: 600, color: '#495057', fontSize: '0.95rem', marginRight: 8 }}>
              Time Filter:
            </label>
            <select 
              value={filterRange} 
              onChange={e => setFilterRange(e.target.value)} 
              style={{ 
              padding: '0.4rem 0.8rem', 
              borderRadius: '6px', 
              border: '1px solid #e0e0e0', 
              fontSize: '0.95rem',
                backgroundColor: 'white',
                fontWeight: '500',
                cursor: 'pointer',
              marginRight: 8
              }}
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      {/* Bookings Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'auto',
        border: '1px solid #e0e0e0',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        marginTop: '0.5rem',
      }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
          fontSize: '0.98rem',
          minWidth: '900px',
          background: 'white',
          }}>
            <thead>
            <tr style={{ background: '#f4f6f8', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', borderRight: '1px solid #e0e0e0' }}>Booking #</th>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', borderRight: '1px solid #e0e0e0' }}>Customer</th>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', borderRight: '1px solid #e0e0e0' }}>Racket & String Details</th>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', borderRight: '1px solid #e0e0e0' }}>Status</th>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', borderRight: '1px solid #e0e0e0' }}>Payment</th>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem', borderRight: '1px solid #e0e0e0' }}>Total</th>
              <th style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                <td colSpan="7" style={{ padding: '2.5rem', textAlign: 'center', color: '#888' }}>
                  No bookings found.
                  </td>
                </tr>
              ) : (
              filteredBookings.map((b, idx) => {
                  const statusColors = getStatusColor(b.status || 'Pending');
                  const paymentColors = getPaymentStatusColor(b.paymentStatus || 'Pending');
                  return (
                  <tr key={b.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f7f7fa', borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '0.7rem', fontWeight: 600, color: '#667eea', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>#{b.bookingNumber || 'N/A'}</td>
                    <td style={{ padding: '0.7rem', borderRight: '1px solid #e0e0e0' }}>
                      <div style={{ fontWeight: 600 }}>{b.fullName}</div>
                      <div style={{ color: '#888', fontSize: '0.93em' }}>{b.phone || b.contactInfo || '-'}</div>
                      {b.email && <div style={{ color: '#667eea', fontSize: '0.92em' }}>{b.email}</div>}
                      </td>
                    <td style={{ padding: '0.7rem', borderRight: '1px solid #e0e0e0' }}>
                          {(b.rackets && Array.isArray(b.rackets)) ? (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {b.rackets.map((r, i) => (
                            <li key={i} style={{ fontSize: '0.95em', color: '#333', marginBottom: 2 }}>
                              {r.racketType === 'tennis' ? '🎾 Tennis' : '🏸 Badminton'} | 
                              <strong>String:</strong> {b.ownString ? 'Own String' : (r.stringBrand && r.stringModel ? `${r.stringBrand} ${r.stringModel}` : r.stringName || '-')} | 
                              <strong>Color:</strong> {r.stringColor || '-'} | 
                              <strong>Tension:</strong> {formatTension(r)} | 
                              <strong>Qty:</strong> {r.quantity || 1}
                              {r.tensionMethod && <> | <strong>Method:</strong> {r.tensionMethod}</>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: '#888' }}>-</span>
                      )}
                      </td>
                    <td style={{ padding: '0.7rem', borderRight: '1px solid #e0e0e0' }}>
                      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <select 
                          value={b.status || 'Pending'} 
                          onChange={e => handleStatusUpdate(b.id, e.target.value)}
                          disabled={updating === b.id}
                          style={{ 
                            background: statusColors.bg,
                            color: statusColors.color,
                            border: `1.5px solid ${statusColors.border}`,
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: '0.95em',
                            padding: '0.3em 2em 0.3em 0.7em',
                            minWidth: 110,
                            textAlign: 'center',
                            cursor: updating === b.id ? 'not-allowed' : 'pointer',
                            outline: 'none',
                            appearance: 'none',
                            transition: 'border-color 0.2s',
                            margin: '0 2px',
                          }}
                          onFocus={e => e.target.style.borderColor = '#667eea'}
                          onBlur={e => e.target.style.borderColor = statusColors.border}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <span style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          fontSize: '1.1em',
                          color: '#333',
                          fontWeight: 700
                        }}>▼</span>
                        </div>
                      </td>
                    <td style={{ padding: '0.7rem', borderRight: '1px solid #e0e0e0' }}>
                      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <select 
                          value={b.paymentStatus || 'Pending'} 
                          onChange={e => handlePaymentUpdate(b.id, e.target.value)}
                          disabled={updating === b.id}
                          style={{ 
                            background: paymentColors.bg,
                            color: paymentColors.color,
                            border: `1.5px solid ${paymentColors.border}`,
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: '0.95em',
                            padding: '0.3em 2em 0.3em 0.7em',
                            minWidth: 90,
                            textAlign: 'center',
                            cursor: updating === b.id ? 'not-allowed' : 'pointer',
                            outline: 'none',
                            appearance: 'none',
                            transition: 'border-color 0.2s',
                            margin: '0 2px',
                          }}
                          onFocus={e => e.target.style.borderColor = '#28a745'}
                          onBlur={e => e.target.style.borderColor = paymentColors.border}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                        <span style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          fontSize: '1.1em',
                          color: '#333',
                          fontWeight: 700
                        }}>▼</span>
                        </div>
                      </td>
                    <td style={{ padding: '0.7rem', fontWeight: 700, color: '#2e7d32', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        ${calculateBookingTotal(b).toFixed(2)}
                      </td>
                    <td style={{ padding: '0.7rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={() => setViewing(b)} style={{ fontSize: '0.92em', padding: '0.3em 0.8em', background: '#e3e3e3', color: '#333', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>View</button>
                        <button onClick={() => handleCompleteWithPickupTime(b)} style={{ fontSize: '0.92em', padding: '0.3em 0.8em', background: '#d4edda', color: '#155724', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Complete</button>
                        <div style={{ position: 'relative', display: 'inline-block' }} data-email-dropdown={b.id}>
                          <button onClick={() => setEmailDropdown(emailDropdown === b.id ? null : b.id)} style={{ fontSize: '0.92em', padding: '0.3em 0.8em', background: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Email ▼</button>
                            {emailDropdown === b.id && (
                              <div style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              background: 'white',
                              border: '1px solid #e0e0e0',
                              borderRadius: 6,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              zIndex: 9999,
                              minWidth: 120
                            }}>
                              <button onClick={() => handleSendConfirmationEmail(b)} style={{ width: '100%', padding: '0.5em 1em', background: 'white', color: '#495057', border: 'none', borderBottom: '1px solid #f4f6f8', cursor: 'pointer', fontSize: '0.92em', textAlign: 'left' }}>Confirmation</button>
                              <button onClick={() => handleSendCompletionEmail(b)} style={{ width: '100%', padding: '0.5em 1em', background: 'white', color: '#495057', border: 'none', borderBottom: '1px solid #f4f6f8', cursor: 'pointer', fontSize: '0.92em', textAlign: 'left' }}>Completion</button>
                              <button onClick={() => handleSendPickupEmail(b)} style={{ width: '100%', padding: '0.5em 1em', background: 'white', color: '#495057', border: 'none', cursor: 'pointer', fontSize: '0.92em', textAlign: 'left' }}>Pickup</button>
                              </div>
                            )}
                          </div>
                        <button onClick={() => handleDelete(b.id)} style={{ fontSize: '0.92em', padding: '0.3em 0.8em', background: '#f8d7da', color: '#721c24', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                        <button onClick={() => setPickupTimeModal({ open: true, booking: b })} style={{ fontSize: '0.92em', padding: '0.3em 0.8em', background: '#fffbe6', color: '#b8860b', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Set Actual Pickup</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      {/* Ensure the booking detail view modal is always rendered when viewing is set */}
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
                    <div key={`${viewing.id}-view-racket-${idx}`} style={{
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
                        <strong>Tension:</strong> {formatTension(r)}
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
                    <strong>Tension:</strong> {formatTension(viewing)}
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
              <div>
                <strong>Price Breakdown:</strong><br/>
                <span>Rackets Subtotal: ${calculateBookingTotal(viewing).toFixed(2)}</span><br/>
                {viewing.ownString && <span>Own String Discount: -$5.00<br/></span>}
                {viewing.grommetReplacement && <span>Grommet Replacement: 4 FREE per racket, +$0.25 each additional<br/></span>}
                {viewing.dropoffLocation === 'Door-to-Door (Delivery)' && <span>Drop-off Delivery: +$12.00<br/></span>}
                {viewing.pickupLocation === 'Door-to-Door (Delivery)' && <span>Pick-up Delivery: +$12.00<br/></span>}
                {viewing.dropoffLocation === 'Door-to-Door (Delivery)' && viewing.pickupLocation === 'Door-to-Door (Delivery)' && <span>Both Delivery Discount: -$4.00<br/></span>}
                <strong>Total: ${(calculateBookingTotal(viewing) - (viewing.ownString ? 5 : 0) + (viewing.grommetReplacement ? 0.25 * (viewing.rackets.length - 1) : 0) + (viewing.dropoffLocation === 'Door-to-Door (Delivery)' ? 12 : 0) + (viewing.pickupLocation === 'Door-to-Door (Delivery)' ? 12 : 0) - (viewing.dropoffLocation === 'Door-to-Door (Delivery)' && viewing.pickupLocation === 'Door-to-Door (Delivery)' ? 4 : 0)).toFixed(2)}</strong>
                    </div>
                    </div>
            {/* In the booking detail view modal, always show both pickup times */}
            <div style={{ marginBottom: '1.25rem', color: '#155724', background: '#e8f5e8', padding: '0.75rem 1.25rem', borderRadius: 8 }}>
              <div><strong>Auto-logged Pickup Time:</strong> {viewing.autoPickupTime ? new Date(viewing.autoPickupTime).toLocaleString() : '-'}</div>
              <div><strong>Manually Entered Pickup Time:</strong> {viewing.actualPickupTime ? new Date(viewing.actualPickupTime).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>
      )}
      {/* Keep the rest of the component (view modal, etc.) unchanged */}
      {pickupTimeModal.open && (
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
            <h2 style={{ marginBottom: 16 }}>Set Actual Pickup Time</h2>
            <input
              type="datetime-local"
              value={actualPickupTime}
              onChange={e => setActualPickupTime(e.target.value)}
              style={{ width: '100%', padding: '0.75em', fontSize: '1em', borderRadius: 8, border: '1.5px solid #e0e0e0', marginBottom: 24 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setPickupTimeModal({ open: false, booking: null })} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '0.5em 1.2em', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleSaveActualPickupTime()} style={{ background: '#4caf50', color: 'white', border: 'none', borderRadius: 6, padding: '0.5em 1.2em', fontWeight: 600 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 