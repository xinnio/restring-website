"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar';

function AnalyticsContent() {
  const [bookings, setBookings] = useState([]);
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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

  // Helper functions for time navigation
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekEnd(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(d.setDate(diff));
  }

  function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function getMonthEnd(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function getYearStart(date) {
    return new Date(date.getFullYear(), 0, 1);
  }

  function getYearEnd(date) {
    return new Date(date.getFullYear(), 11, 31);
  }

  function formatDate(date, format) {
    switch (format) {
      case 'week':
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'year':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  }

  function getTimeSeriesData() {
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      let startDate, endDate;
      
      switch (timeRange) {
        case 'week':
          startDate = getWeekStart(selectedDate);
          endDate = getWeekEnd(selectedDate);
          break;
        case 'month':
          startDate = getMonthStart(selectedDate);
          endDate = getMonthEnd(selectedDate);
          break;
        case 'year':
          startDate = getYearStart(selectedDate);
          endDate = getYearEnd(selectedDate);
          break;
        default:
          return true;
      }
      
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    const data = {};
    
    filteredBookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      let key;
      
      switch (timeRange) {
        case 'week':
          key = bookingDate.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          key = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case 'year':
          key = bookingDate.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          key = bookingDate.toLocaleDateString();
      }
      
      data[key] = (data[key] || 0) + 1;
    });

    return data;
  }

  function getRevenueTimeSeriesData() {
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      let startDate, endDate;
      
      switch (timeRange) {
        case 'week':
          startDate = getWeekStart(selectedDate);
          endDate = getWeekEnd(selectedDate);
          break;
        case 'month':
          startDate = getMonthStart(selectedDate);
          endDate = getMonthEnd(selectedDate);
          break;
        case 'year':
          startDate = getYearStart(selectedDate);
          endDate = getYearEnd(selectedDate);
          break;
        default:
          return true;
      }
      
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    const data = {};
    
    filteredBookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      let key;
      
      switch (timeRange) {
        case 'week':
          key = bookingDate.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          key = bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case 'year':
          key = bookingDate.toLocaleDateString('en-US', { month: 'short' });
          break;
        default:
          key = bookingDate.toLocaleDateString();
      }
      
      // Calculate revenue for this booking
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
      
      const revenue = basePrice + extras;
      data[key] = (data[key] || 0) + revenue;
    });

    return data;
  }

  function navigateTime(direction) {
    const newDate = new Date(selectedDate);
    
    switch (timeRange) {
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setSelectedDate(newDate);
  }

  function getCurrentPeriodLabel() {
    switch (timeRange) {
      case 'week':
        const weekStart = getWeekStart(selectedDate);
        const weekEnd = getWeekEnd(selectedDate);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'year':
        return selectedDate.getFullYear().toString();
      default:
        return selectedDate.toLocaleDateString();
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
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
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)', overflow: 'auto' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#333', 
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            lineHeight: '1.2'
          }}>Analytics Dashboard</h1>
          
          {/* Key Metrics Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'clamp(1rem, 3vw, 1.5rem)', 
            marginBottom: 'clamp(1rem, 3vw, 2rem)' 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#666', 
                margin: '0 0 0.5rem 0', 
                fontSize: 'clamp(0.7rem, 2.5vw, 0.775rem)' 
              }}>Total Bookings</h3>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', 
                fontWeight: 'bold', 
                color: '#007bff' 
              }}>{bookings.length}</div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#666', 
                margin: '0 0 0.5rem 0', 
                fontSize: 'clamp(0.7rem, 2.5vw, 0.775rem)' 
              }}>Total Revenue</h3>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', 
                fontWeight: 'bold', 
                color: '#28a745' 
              }}>${totalRevenue.toFixed(2)}</div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#666', 
                margin: '0 0 0.5rem 0', 
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' 
              }}>Paid Revenue</h3>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: 'bold', 
                color: '#17a2b8' 
              }}>${paidRevenue.toFixed(2)}</div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#666', 
                margin: '0 0 0.5rem 0', 
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' 
              }}>Pending Revenue</h3>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: 'bold', 
                color: '#ffc107' 
              }}>${pendingRevenue.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'clamp(1rem, 3vw, 2rem)' 
          }}>
            {/* Booking Status */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#333', 
                marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)',
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
              }}>Booking Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Pending</span>
                  <span style={{ fontWeight: 'bold', color: '#ffa500' }}>{statusCounts.Pending}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>In Progress</span>
                  <span style={{ fontWeight: 'bold', color: '#0066cc' }}>{statusCounts['In Progress']}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Completed</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{statusCounts.Completed}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#333', 
                marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)',
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
              }}>Payment Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Pending Payment</span>
                  <span style={{ fontWeight: 'bold', color: '#ffa500' }}>{paymentCounts.Pending}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Paid</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>{paymentCounts.Paid}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Payment Rate</span>
                  <span style={{ fontWeight: 'bold', color: '#17a2b8' }}>
                    {bookings.length > 0 ? ((paymentCounts.Paid / bookings.length) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'clamp(1rem, 3vw, 2rem)', 
            marginTop: 'clamp(1rem, 3vw, 2rem)' 
          }}>
            {/* Most Requested Strings */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#333', 
                marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)',
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
              }}>Most Requested Strings</h3>
              {mostRequestedStrings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mostRequestedStrings.map(([stringName, count]) => (
                    <div key={stringName} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                    }}>
                      <span>{stringName}</span>
                      <span style={{ fontWeight: 'bold', color: '#007bff' }}>{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ 
                  color: '#666', 
                  textAlign: 'center',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>No booking data available</p>
              )}
            </div>

            {/* Revenue Breakdown */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ 
                color: '#333', 
                marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)',
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
              }}>Revenue Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Total Revenue</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745' }}>${totalRevenue.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Collected</span>
                  <span style={{ fontWeight: 'bold', color: '#17a2b8' }}>${paidRevenue.toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: 'clamp(0.4rem, 2vw, 0.5rem)', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                }}>
                  <span>Outstanding</span>
                  <span style={{ fontWeight: 'bold', color: '#ffc107' }}>${pendingRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockStrings.length > 0 && (
            <div style={{ 
              marginTop: 'clamp(1rem, 3vw, 2rem)', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px', 
              padding: 'clamp(1rem, 3vw, 1.5rem)' 
            }}>
              <h3 style={{ 
                color: '#856404', 
                marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)',
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
              }}>⚠️ Low Stock Alert</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                gap: 'clamp(0.75rem, 2.5vw, 1rem)' 
              }}>
                {lowStockStrings.map(string => (
                  <div key={string._id} style={{ 
                    backgroundColor: 'white', 
                    padding: 'clamp(0.75rem, 2.5vw, 1rem)', 
                    borderRadius: '4px', 
                    border: '1px solid #ffeaa7' 
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: '#333',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                    }}>{string.name}</div>
                    <div style={{ 
                      color: '#666', 
                      fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' 
                    }}>Quantity: {string.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Series Charts */}
          <div style={{ 
            marginTop: 'clamp(1rem, 3vw, 2rem)', 
            backgroundColor: 'white', 
            padding: 'clamp(1rem, 3vw, 1.5rem)', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            {/* Navigation Controls */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
              flexWrap: 'wrap',
              gap: 'clamp(0.5rem, 2vw, 1rem)'
            }}>
              <h3 style={{ 
                color: '#333', 
                margin: 0,
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)'
              }}>Time Series Analytics</h3>
              
              {/* Time Range Selector */}
              <div style={{ display: 'flex', gap: 'clamp(0.25rem, 1.5vw, 0.5rem)', flexWrap: 'wrap' }}>
                {['week', 'month', 'year'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    style={{
                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                      background: timeRange === range ? '#007bff' : '#f8f9fa',
                      color: timeRange === range ? 'white' : '#333',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigateTime('prev')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                    cursor: 'pointer',
                    color: '#007bff',
                    padding: 'clamp(0.4rem, 2vw, 0.5rem)',
                    borderRadius: '4px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  ‹
                </button>
                
                <span style={{ 
                  fontWeight: '600', 
                  color: '#333', 
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                  minWidth: 'clamp(100px, 20vw, 120px)',
                  textAlign: 'center'
                }}>
                  {getCurrentPeriodLabel()}
                </span>
                
                <button
                  onClick={() => navigateTime('next')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                    cursor: 'pointer',
                    color: '#007bff',
                    padding: 'clamp(0.4rem, 2vw, 0.5rem)',
                    borderRadius: '4px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Charts Container */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 'clamp(1rem, 3vw, 2rem)' 
            }}>
              {/* Bookings Chart */}
              <div>
                <h4 style={{ 
                  color: '#333', 
                  marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)', 
                  textAlign: 'center',
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                }}>Bookings</h4>
                {(() => {
                  const timeSeriesData = getTimeSeriesData();
                  const entries = Object.entries(timeSeriesData);
                  
                  if (entries.length === 0) {
                  return (
                      <div style={{ 
                        height: 'clamp(150px, 30vw, 200px)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                      }}>
                        No data available for this period
                      </div>
                    );
                  }
                  
                  const maxCount = Math.max(...entries.map(([, count]) => count));
                  
                  return (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'end', 
                      gap: 'clamp(0.25rem, 1.5vw, 0.5rem)', 
                      height: 'clamp(150px, 30vw, 200px)', 
                      paddingTop: 'clamp(1.5rem, 3vw, 2rem)',
                      paddingBottom: 'clamp(1.5rem, 3vw, 2rem)'
                    }}>
                      {entries.map(([label, count]) => {
                        const height = maxCount > 0 ? (count / maxCount) * 120 : 0;
                        return (
                          <div key={label} style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            flex: 1,
                            position: 'relative'
                          }}>
                            <div style={{ 
                              width: '100%', 
                        height: `${height}px`, 
                        backgroundColor: '#007bff', 
                        borderRadius: '4px 4px 0 0',
                              marginBottom: 'clamp(0.25rem, 1.5vw, 0.5rem)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#0056b3';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#007bff';
                              e.target.style.transform = 'scale(1)';
                            }}
                            title={`${label}: ${count} bookings`}
                            ></div>
                            <div style={{ 
                              fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', 
                              color: '#666', 
                              textAlign: 'center',
                              fontWeight: '500'
                            }}>
                              {label}
                            </div>
                            <div style={{ 
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', 
                              fontWeight: 'bold', 
                              color: '#333',
                              marginTop: '0.25rem'
                            }}>
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Revenue Chart */}
              <div>
                <h4 style={{ 
                  color: '#333', 
                  marginBottom: 'clamp(0.75rem, 2.5vw, 1rem)', 
                  textAlign: 'center',
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)'
                }}>Revenue</h4>
                {(() => {
                  const revenueData = getRevenueTimeSeriesData();
                  const entries = Object.entries(revenueData);
                  
                  if (entries.length === 0) {
                    return (
                      <div style={{ 
                        height: 'clamp(150px, 30vw, 200px)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
                      }}>
                        No revenue data available for this period
                      </div>
                    );
                  }
                  
                  const maxRevenue = Math.max(...entries.map(([, revenue]) => revenue));
                  
                  return (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'end', 
                      gap: 'clamp(0.25rem, 1.5vw, 0.5rem)', 
                      height: 'clamp(150px, 30vw, 200px)', 
                      paddingTop: 'clamp(1.5rem, 3vw, 2rem)',
                      paddingBottom: 'clamp(1.5rem, 3vw, 2rem)'
                    }}>
                      {entries.map(([label, revenue]) => {
                        const height = maxRevenue > 0 ? (revenue / maxRevenue) * 120 : 0;
                        return (
                          <div key={label} style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            flex: 1,
                            position: 'relative'
                          }}>
                            <div style={{ 
                              width: '100%', 
                              height: `${height}px`, 
                              backgroundColor: '#28a745', 
                              borderRadius: '4px 4px 0 0',
                              marginBottom: 'clamp(0.25rem, 1.5vw, 0.5rem)',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#1e7e34';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#28a745';
                              e.target.style.transform = 'scale(1)';
                            }}
                            title={`${label}: $${revenue.toFixed(2)}`}
                            ></div>
                            <div style={{ 
                              fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', 
                              color: '#666', 
                              textAlign: 'center',
                              fontWeight: '500'
                            }}>
                              {label}
                            </div>
                            <div style={{ 
                              fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)', 
                              fontWeight: 'bold', 
                              color: '#333',
                              marginTop: '0.25rem'
                            }}>
                              ${revenue.toFixed(2)}
                            </div>
                    </div>
                  );
                })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Summary Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: 'clamp(0.75rem, 2.5vw, 1rem)', 
              marginTop: 'clamp(1rem, 3vw, 2rem)',
              paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
              borderTop: '1px solid #e9ecef'
            }}>
              {(() => {
                const timeSeriesData = getTimeSeriesData();
                const revenueData = getRevenueTimeSeriesData();
                const totalBookings = Object.values(timeSeriesData).reduce((sum, count) => sum + count, 0);
                const totalRevenue = Object.values(revenueData).reduce((sum, revenue) => sum + revenue, 0);
                const avgRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
                
                return (
                  <>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: 'clamp(0.75rem, 2.5vw, 1rem)', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ 
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', 
                        color: '#666', 
                        marginBottom: '0.5rem' 
                      }}>Total Bookings</div>
                      <div style={{ 
                        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                        fontWeight: 'bold', 
                        color: '#007bff' 
                      }}>{totalBookings}</div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: 'clamp(0.75rem, 2.5vw, 1rem)', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ 
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', 
                        color: '#666', 
                        marginBottom: '0.5rem' 
                      }}>Total Revenue</div>
                      <div style={{ 
                        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                        fontWeight: 'bold', 
                        color: '#28a745' 
                      }}>${totalRevenue.toFixed(2)}</div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: 'clamp(0.75rem, 2.5vw, 1rem)', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ 
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', 
                        color: '#666', 
                        marginBottom: '0.5rem' 
                      }}>Avg Revenue/Booking</div>
                      <div style={{ 
                        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                        fontWeight: 'bold', 
                        color: '#17a2b8' 
                      }}>${avgRevenue.toFixed(2)}</div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: 'clamp(0.75rem, 2.5vw, 1rem)', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ 
                        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', 
                        color: '#666', 
                        marginBottom: '0.5rem' 
                      }}>Period</div>
                      <div style={{ 
                        fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                        fontWeight: 'bold', 
                        color: '#6c757d' 
                      }}>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</div>
                    </div>
                  </>
                );
              })()}
            </div>
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