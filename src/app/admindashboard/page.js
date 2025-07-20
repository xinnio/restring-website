"use client";

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar';
import BookingTable from '../../components/BookingTable';
import NoticeManager from '../../components/NoticeManager';

function AdminDashboardContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'pending', 'inProgress', 'completed', 'paid'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'notices'

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  function getStats() {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const inProgress = bookings.filter(b => b.status === 'In Progress').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const paid = bookings.filter(b => b.paymentStatus === 'Paid').length;
    
    return { total, pending, inProgress, completed, paid };
  }

  // Filter bookings based on selectedFilter
  const filteredBookings = bookings.filter(b => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return b.status === 'Pending';
    if (selectedFilter === 'inProgress') return b.status === 'In Progress';
    if (selectedFilter === 'completed') return b.status === 'Completed';
    if (selectedFilter === 'paid') return b.paymentStatus === 'Paid';
    return true;
  });

  const stats = getStats();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#1a1a1a',
              marginBottom: '0.5rem'
            }}>
              📊 Admin Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Manage bookings, track payments, and monitor your stringing business
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Total Bookings */}
            <div
              onClick={() => setSelectedFilter('all')}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: selectedFilter === 'all' ? '2px solid #667eea' : '1px solid rgba(0,0,0,0.08)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border 0.2s',
                outline: selectedFilter === 'all' ? '2px solid #667eea33' : 'none',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '0.25rem' }}>
                {stats.total}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total Bookings</div>
            </div>

            {/* Pending */}
            <div
              onClick={() => setSelectedFilter('pending')}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: selectedFilter === 'pending' ? '2px solid #ffc107' : '1px solid rgba(0,0,0,0.08)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border 0.2s',
                outline: selectedFilter === 'pending' ? '2px solid #ffc10733' : 'none',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffc107', marginBottom: '0.25rem' }}>
                {stats.pending}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Pending</div>
            </div>

            {/* In Progress */}
            <div
              onClick={() => setSelectedFilter('inProgress')}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: selectedFilter === 'inProgress' ? '2px solid #17a2b8' : '1px solid rgba(0,0,0,0.08)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border 0.2s',
                outline: selectedFilter === 'inProgress' ? '2px solid #17a2b833' : 'none',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#17a2b8', marginBottom: '0.25rem' }}>
                {stats.inProgress}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>In Progress</div>
            </div>

            {/* Completed */}
            <div
              onClick={() => setSelectedFilter('completed')}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: selectedFilter === 'completed' ? '2px solid #28a745' : '1px solid rgba(0,0,0,0.08)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border 0.2s',
                outline: selectedFilter === 'completed' ? '2px solid #28a74533' : 'none',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#28a745', marginBottom: '0.25rem' }}>
                {stats.completed}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Completed</div>
            </div>

            {/* Paid */}
            <div
              onClick={() => setSelectedFilter('paid')}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: selectedFilter === 'paid' ? '2px solid #20c997' : '1px solid rgba(0,0,0,0.08)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border 0.2s',
                outline: selectedFilter === 'paid' ? '2px solid #20c99733' : 'none',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#20c997', marginBottom: '0.25rem' }}>
                {stats.paid}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Paid</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              🚀 Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = '/inventorymanager'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                }}
              >
                🧵 Manage Inventory
              </button>
              <button
                onClick={() => window.location.href = '/availabilitymanager'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                }}
              >
                📅 Manage Availability
              </button>
              <button
                onClick={() => window.location.href = '/analytics'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(23, 162, 184, 0.3)'
                }}
              >
                📈 View Analytics
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            marginBottom: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              borderBottom: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  backgroundColor: activeTab === 'dashboard' ? '#667eea' : 'transparent',
                  color: activeTab === 'dashboard' ? 'white' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  backgroundColor: activeTab === 'notices' ? '#667eea' : 'transparent',
                  color: activeTab === 'notices' ? 'white' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                📢 Notice Management
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '2rem' }}>
              {activeTab === 'dashboard' ? (
                <div>
                  {/* Bookings Table */}
                  {loading ? (
                    <div style={{ 
                      padding: '3rem', 
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #667eea', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                      }}></div>
                      <p style={{ fontSize: '1.1rem' }}>Loading bookings...</p>
                    </div>
                  ) : (
                    <BookingTable bookings={filteredBookings} onUpdate={fetchBookings} />
                  )}
                </div>
              ) : (
                <div>
                  <NoticeManager />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
} 