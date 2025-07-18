"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar';

function AnalyticsContent() {
  const [bookings, setBookings] = useState([]);
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, stringsRes] = await Promise.all([
          fetch('/api/bookings'),
          fetch('/api/strings')
        ]);
        
        const bookingsData = await bookingsRes.json();
        const stringsData = await stringsRes.json();
        
        setBookings(bookingsData);
        setStrings(stringsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  function calculateRevenue() {
    return bookings.reduce((total, booking) => {
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
      
      return total + basePrice + extras;
    }, 0);
  }

  function calculatePaidRevenue() {
    return bookings
      .filter(booking => booking.paymentStatus === 'Paid')
      .reduce((total, booking) => {
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
        
        return total + basePrice + extras;
      }, 0);
  }

  function getBookingsByStatus() {
    const statusCounts = { Pending: 0, 'In Progress': 0, Completed: 0 };
    bookings.forEach(booking => {
      const status = booking.status || 'Pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    return statusCounts;
  }

  function getPaymentStatus() {
    const paymentCounts = { Pending: 0, Paid: 0 };
    bookings.forEach(booking => {
      const status = booking.paymentStatus || 'Pending';
      paymentCounts[status] = (paymentCounts[status] || 0) + 1;
    });
    return paymentCounts;
  }

  function getMostRequestedStrings() {
    const stringCounts = {};
    bookings.forEach(booking => {
      if (booking.stringType) {
        stringCounts[booking.stringType] = (stringCounts[booking.stringType] || 0) + 1;
      }
    });
    return Object.entries(stringCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  }

  function getLowStockStrings() {
    return strings.filter(s => s.quantity <= 2);
  }

  function getBookingsByMonth() {
    const monthCounts = {};
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const month = date.toLocaleString('default', { month: 'long' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return monthCounts;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #007bff', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#666' }}>Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  const totalRevenue = calculateRevenue();
  const paidRevenue = calculatePaidRevenue();
  const pendingRevenue = totalRevenue - paidRevenue;
  const statusCounts = getBookingsByStatus();
  const paymentCounts = getPaymentStatus();
  const mostRequestedStrings = getMostRequestedStrings();
  const lowStockStrings = getLowStockStrings();
  const monthlyBookings = getBookingsByMonth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#333', marginBottom: '2rem' }}>Analytics Dashboard</h1>
          
          {/* Key Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Total Bookings</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{bookings.length}</div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Total Revenue</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>${totalRevenue.toFixed(2)}</div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Paid Revenue</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>${paidRevenue.toFixed(2)}</div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Pending Revenue</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>${pendingRevenue.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Booking Status */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Booking Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Pending</span>
                  <span style={{ fontWeight: 'bold', color: '#ffa500' }}>{statusCounts.Pending}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>In Progress</span>
                  <span style={{ fontWeight: 'bold', color: '#0066cc' }}>{statusCounts['In Progress']}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Completed</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{statusCounts.Completed}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Payment Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Pending Payment</span>
                  <span style={{ fontWeight: 'bold', color: '#ffa500' }}>{paymentCounts.Pending}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Paid</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{paymentCounts.Paid}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Payment Rate</span>
                  <span style={{ fontWeight: 'bold', color: '#17a2b8' }}>
                    {bookings.length > 0 ? ((paymentCounts.Paid / bookings.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
            {/* Most Requested Strings */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Most Requested Strings</h3>
              {mostRequestedStrings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mostRequestedStrings.map(([stringName, count]) => (
                    <div key={stringName} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                      <span>{stringName}</span>
                      <span style={{ fontWeight: 'bold', color: '#007bff' }}>{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666', textAlign: 'center' }}>No booking data available</p>
              )}
            </div>

            {/* Revenue Breakdown */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Revenue Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Total Revenue</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>${totalRevenue.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Collected</span>
                  <span style={{ fontWeight: 'bold', color: '#17a2b8' }}>${paidRevenue.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <span>Outstanding</span>
                  <span style={{ fontWeight: 'bold', color: '#ffc107' }}>${pendingRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockStrings.length > 0 && (
            <div style={{ 
              marginTop: '2rem', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px', 
              padding: '1.5rem' 
            }}>
              <h3 style={{ color: '#856404', marginBottom: '1rem' }}>⚠️ Low Stock Alert</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {lowStockStrings.map(string => (
                  <div key={string._id} style={{ 
                    backgroundColor: 'white', 
                    padding: '1rem', 
                    borderRadius: '4px', 
                    border: '1px solid #ffeaa7' 
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{string.name}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Quantity: {string.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Bookings Chart */}
          <div style={{ 
            marginTop: '2rem', 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>Bookings by Month</h3>
            {Object.keys(monthlyBookings).length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '200px', paddingTop: '2rem' }}>
                {Object.entries(monthlyBookings).map(([month, count]) => {
                  const maxCount = Math.max(...Object.values(monthlyBookings));
                  const height = (count / maxCount) * 150;
                  return (
                    <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div style={{ 
                        width: '40px', 
                        height: `${height}px`, 
                        backgroundColor: '#007bff', 
                        borderRadius: '4px 4px 0 0',
                        marginBottom: '0.5rem'
                      }}></div>
                      <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>{month}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#333' }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center' }}>No monthly data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Analytics() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
} 