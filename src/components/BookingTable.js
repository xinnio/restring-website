"use client";

import React, { useState } from 'react';

export default function BookingTable({ bookings = [], onUpdate }) {
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewing, setViewing] = useState(null); // booking object or null
  const [filterRange, setFilterRange] = useState('all'); // 'all', 'week', 'month'

  // Function to generate print-friendly content
  function generatePrintContent(booking) {
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
      return `
        <tr>
          <td>${qty}</td>
          <td>${r.racketType === 'tennis' ? 'Tennis' : 'Badminton'}</td>
          <td>${r.stringName || '-'}</td>
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
          </div>
        </div>

        <div class="section">
          <h3>Scheduling</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Drop-Off Location:</span> ${booking.dropoffLocation || '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Drop-Off Slot:</span> ${booking.dropoffSlotId || '-'}
            </div>
            <div class="info-item">
              <span class="info-label">Pick-up Location:</span> ${booking.pickupLocation || '-'}
            </div>
            ${booking.deliveryAddress ? `
            <div class="info-item">
              <span class="info-label">Delivery Address:</span> ${booking.deliveryAddress}
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

        <div class="total-section">
          <h3>Price Breakdown</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Rackets Subtotal:</span> $${racketsSubtotal.toFixed(2)}
            </div>
            ${booking.ownString ? `
            <div class="info-item">
              <span class="info-label">Own String Fee:</span> +$3.00
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          color: '#1a1a1a',
          margin: 0
        }}>
          📋 Bookings Management
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem'
        }}>
          <div style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#e8f5e8', 
            color: '#2e7d32', 
            borderRadius: '20px', 
            fontSize: '0.9rem', 
            fontWeight: '500'
          }}>
            {filteredBookings.length} Showing
          </div>
          <div>
            <label style={{ fontWeight: 500, marginRight: 8 }}>Filter:</label>
            <select 
              value={filterRange} 
              onChange={e => setFilterRange(e.target.value)} 
              style={{ 
                padding: '0.4rem 0.8rem', 
                borderRadius: 6, 
                border: '1px solid #ccc', 
                fontSize: '1rem'
              }}
            >
              <option value="all">All</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
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
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Customer</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Racket Details</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Status</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Payment</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Total Price</th>
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ 
                    padding: '4rem 2rem', 
                    textAlign: 'center', 
                    color: '#6c757d',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#495057' }}>
                      No bookings yet
                    </h3>
                    <p style={{ color: '#6c757d' }}>
                      Bookings will appear here once customers start using your service.
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
                      transition: 'background-color 0.2s ease',
                      backgroundColor: isCancelled ? '#f8d7da' : undefined,
                      color: isCancelled ? '#888' : undefined
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: '#1a1a1a',
                            marginBottom: '0.25rem'
                          }}>
                            {b.fullName}
                          </div>
                          <div style={{ 
                            color: '#6c757d', 
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            📞 {b.contactInfo}
                          </div>
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
                                      <strong>String:</strong> {r.stringName || '-'} | <strong>Color:</strong> {r.stringColor || '-'} | <strong>Tension:</strong> {r.stringTension || '-'} | <strong>Qty:</strong> {r.quantity || 1}
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
                                    <strong>String:</strong> {b.stringName || '-'} | <strong>Color:</strong> {b.stringColor || '-'} | <strong>Tension:</strong> {b.stringTension || '-'} | <strong>Qty:</strong> {b.quantity || 1}
                                  </span>
                                </div>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={b.status || 'Pending'} 
                          onChange={(e) => handleStatusUpdate(b._id, e.target.value)}
                          disabled={updating === b._id || isCancelled}
                          style={{ 
                            backgroundColor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`,
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: isCancelled ? 'not-allowed' : 'pointer',
                            minWidth: '120px'
                          }}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="In Progress">🔄 In Progress</option>
                          <option value="Completed">✅ Completed</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                        {updating === b._id && (
                          <div style={{ 
                            marginTop: '0.5rem',
                            fontSize: '0.8rem',
                            color: '#6c757d'
                          }}>
                            Updating...
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={b.paymentStatus || 'Pending'} 
                          onChange={(e) => handlePaymentUpdate(b._id, e.target.value)}
                          disabled={updating === b._id || isCancelled}
                          style={{ 
                            backgroundColor: paymentColors.bg,
                            color: paymentColors.color,
                            border: `1px solid ${paymentColors.border}`,
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: isCancelled ? 'not-allowed' : 'pointer',
                            minWidth: '100px'
                          }}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Paid">💰 Paid</option>
                        </select>
                        {b.paymentReceivedAt && (
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#6c757d', 
                            marginTop: '0.25rem' 
                          }}>
                            {new Date(b.paymentReceivedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#2e7d32' }}>
                        ${calculateBookingTotal(b).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setViewing(b)}
                            disabled={isCancelled}
                            style={{
                              fontSize: '0.8rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#6c63ff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '500',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(b._id, 'Completed')}
                            disabled={updating === b._id || isCancelled}
                            style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: updating === b._id || isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '500',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            ✅ Complete
                          </button>
                          <button 
                            onClick={() => handlePaymentUpdate(b._id, 'Paid')}
                            disabled={updating === b._id || b.paymentStatus === 'Paid' || isCancelled}
                            style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.5rem 0.75rem',
                              backgroundColor: b.paymentStatus === 'Paid' ? '#6c757d' : '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: updating === b._id || b.paymentStatus === 'Paid' || isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '500',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            💰 Mark Paid
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(b._id, 'Cancelled')}
                            disabled={updating === b._id || isCancelled}
                            style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: updating === b._id || isCancelled ? 'not-allowed' : 'pointer',
                              fontWeight: '500',
                              opacity: isCancelled ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isCancelled ? '❌ Cancelled' : '❌ Cancel'}
                          </button>
                          <button 
                            onClick={() => handleDelete(b._id)}
                            disabled={deleting === b._id}
                            style={{ 
                              fontSize: '0.8rem', 
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: deleting === b._id ? 'not-allowed' : 'pointer',
                              fontWeight: '500',
                              opacity: deleting === b._id ? 0.5 : 1,
                              transition: 'all 0.2s ease'
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
                  gap: '0.5rem'
                }}
              >
                🖨️ Print
              </button>
            </div>
            {/* Personal Info */}
            <div style={{ marginBottom: '1.25rem' }}>
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
                        <strong>String:</strong> {r.stringName || '-'}
                      </span>
                      <span style={{ color: '#333', fontSize: '1rem' }}>
                        <strong>Color:</strong> {r.stringColor || '-'}
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
                    <strong>String:</strong> {viewing.stringName || '-'}
                  </span>
                  <span style={{ color: '#333', fontSize: '1rem' }}>
                    <strong>Color:</strong> {viewing.stringColor || '-'}
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
              <span>Drop-Off Slot: {viewing.dropoffSlotId || '-'}</span><br/>
              <span>Pick-up Location: {viewing.pickupLocation || '-'}</span><br/>
              {viewing.deliveryAddress && (<span>Delivery Address: {viewing.deliveryAddress}<br/></span>)}
            </div>
            {/* Status & Payment */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong>Status:</strong> {viewing.status || '-'}<br/>
              <strong>Payment:</strong> {viewing.paymentStatus || '-'}
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
                if (viewing.ownString) extras += 3;
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
                        {viewing.ownString && <li>Own string: +$3.00</li>}
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