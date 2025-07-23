"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AvailabilityForm from '../../components/AvailabilityForm';

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function AvailabilityManager() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(null);
  // New state for modal/inline form
  const [showForm, setShowForm] = useState(false);
  const [formSlot, setFormSlot] = useState(null); // null for new, slot object for edit
  const [formDate, setFormDate] = useState(''); // for new slot creation
  const [cleaningUp, setCleaningUp] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [deleting, setDeleting] = useState(null); // Track which slot is being deleted
  // New state for weekly view
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = this week, 1 = next week, etc.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  async function fetchAvailability() {
    setLoading(true);
    try {
      const res = await fetch('/api/availability');
      const data = await res.json();
      // Map _id to id if present
      const mapped = data.map(slot => ({ ...slot, id: slot.id || slot._id }));
      setAvailability(mapped);
      // --- LOG ALL SLOTS AFTER MAPPING ---
      console.log('Fetched and mapped availability slots:', mapped);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAvailability();
  }, []);

  // Auto-cleanup past slots when component mounts
  useEffect(() => {
    async function autoCleanup() {
      setCleaningUp(true);
      try {
        const res = await fetch('/api/availability', {
          method: 'DELETE',
        });
        
        if (res.ok) {
          const result = await res.json();
          if (result.deletedCount > 0) {
            console.log(`Auto-deleted ${result.deletedCount} past availability slots`);
            setCleanupMessage(`Auto-cleaned ${result.deletedCount} past availability slots`);
            // Clear the message after 5 seconds
            setTimeout(() => setCleanupMessage(''), 5000);
            // Refresh the availability list after cleanup
            fetchAvailability();
          }
        }
      } catch (error) {
        console.error('Error during auto-cleanup:', error);
      } finally {
        setCleaningUp(false);
      }
    }
    
    // Run auto-cleanup after a short delay to ensure the page is loaded
    const timer = setTimeout(autoCleanup, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Group slots by date (YYYY-MM-DD)
  const slotsByDate = availability.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  // Calendar logic
  const { year, month } = calendarMonth;
  const days = getMonthDays(year, month);
  const today = new Date();
  const monthStr = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Filtered slots for selected date
  const filteredSlots = selectedDate ? (slotsByDate[selectedDate] || []) : availability;

  // Helper functions for weekly view
  function getWeekDates(startDate) {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  // Get week dates based on selection
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  
  const selectedWeekStart = new Date(currentWeekStart);
  selectedWeekStart.setDate(currentWeekStart.getDate() + (selectedWeek * 7));

  const selectedWeekDates = getWeekDates(selectedWeekStart);
  
  // Get week label
  function getWeekLabel(weekOffset) {
    if (weekOffset === 0) return 'This Week';
    if (weekOffset === 1) return 'Next Week';
    if (weekOffset === -1) return 'Last Week';
    return `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`;
  }

  // Helper function to get availability for a specific date
  function getAvailabilityForDate(date) {
    const dateStr = date.toISOString().slice(0, 10);
    return availability.filter(slot => slot.date === dateStr && slot.available !== false);
  }

  // Helper function to format time
  function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  // Handlers for calendar/form
  function handleDayClick(dateStr) {
    setSelectedDate(dateStr);
    setFormSlot(null);
    setFormDate(dateStr);
    setShowForm(true);
  }
  function handleEditSlot(slot) {
    // --- FORCE NORMALIZATION AND LOG ---
    const normalizedSlot = { ...slot, id: slot.id || slot._id };
    console.log('handleEditSlot called with slot:', normalizedSlot);
    setFormSlot(normalizedSlot);
    setFormDate('');
    setShowForm(true);
  }
  function handleFormClose() {
    setShowForm(false);
    setFormSlot(null);
    setFormDate('');
  }
  function handleFormSuccess() {
    fetchAvailability();
    handleFormClose();
  }

  async function handleCleanupPastSlots() {
    if (!confirm('This will delete all availability slots before today. Are you sure?')) {
      return;
    }
    
    setCleaningUp(true);
    try {
      const res = await fetch('/api/availability', {
        method: 'DELETE',
      });
      
      if (res.ok) {
        const result = await res.json();
        alert(`Successfully deleted ${result.deletedCount} past availability slots.`);
        fetchAvailability(); // Refresh the list
      } else {
        alert('Error deleting past slots. Please try again.');
      }
    } catch (error) {
      console.error('Error cleaning up past slots:', error);
      alert('Error deleting past slots. Please try again.');
    } finally {
      setCleaningUp(false);
    }
  }

  async function handleDeleteSlot(slotId) {
    if (!confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }
    
    console.log('Attempting to delete slot with ID:', slotId);
    setDeleting(slotId);
    
    try {
      const res = await fetch(`/api/availability/${slotId}`, {
        method: 'DELETE',
      });
      
      const responseData = await res.json();
      console.log('Delete response:', responseData);
      
      if (res.ok) {
        alert('Availability slot deleted successfully!');
        fetchAvailability(); // Refresh the list
      } else if (res.status === 404) {
        // Slot was already deleted or doesn't exist
        alert('This slot has already been deleted or does not exist. Refreshing the list...');
        fetchAvailability(); // Refresh to remove from UI
      } else {
        const errorMessage = responseData.details || responseData.error || 'Error deleting availability slot. Please try again.';
        alert(errorMessage);
        // Refresh data even on error to ensure UI is up to date
        fetchAvailability();
      }
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      alert('Error deleting availability slot. Please try again.');
      // Refresh data even on error to ensure UI is up to date
      fetchAvailability();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)', overflow: 'auto' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#333', 
            marginBottom: 'clamp(1rem, 3vw, 2rem)', 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 700, 
            letterSpacing: '-1px',
            lineHeight: '1.2'
          }}>📅 Pickup/Drop-Off Time Slot Manager</h1>
          
          {/* Auto-cleanup notification */}
          {cleanupMessage && (
            <div style={{
              background: 'linear-gradient(90deg, #d4edda 60%, #c3e6cb 100%)',
              border: '1px solid #28a745',
              borderRadius: '8px',
              padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.15)'
            }}>
              <span style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>✅</span>
              <div style={{ color: '#155724', fontWeight: '600', fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)' }}>
                {cleanupMessage}
              </div>
            </div>
          )}
          {/* ROW 1: Add New Time Slot | Calendar View */}
          <div style={{
            display: 'flex',
            gap: 'clamp(1rem, 3vw, 2rem)',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}>
            {/* Add New Time Slot (LEFT) */}
            <div style={{
              backgroundColor: 'white',
              padding: 'clamp(1rem, 3vw, 2rem)',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(102,126,234,0.08)',
              border: '1px solid #e9ecef',
              minWidth: '320px',
              maxWidth: '600px',
              width: '100%',
              flex: 1
            }}>
              <h2 style={{
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                color: '#333',
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: 600
              }}>Add New Time Slot</h2>
              <AvailabilityForm onSuccess={fetchAvailability} />
            </div>
            {/* Calendar View (RIGHT) */}
            <div style={{
              backgroundColor: 'white',
              padding: 'clamp(1rem, 3vw, 2rem)',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(102,126,234,0.08)',
              border: '1px solid #e9ecef',
              minWidth: '320px',
              maxWidth: '600px',
              width: '100%',
              flex: 1
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 4px 24px rgba(102,126,234,0.08)', 
                border: '1px solid #e9ecef', 
                padding: 'clamp(1rem, 3vw, 1.5rem)', 
                marginBottom: '1rem', 
                position: 'relative' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <button onClick={() => setCalendarMonth(m => ({ year: m.month === 0 ? m.year - 1 : m.year, month: m.month === 0 ? 11 : m.month - 1 }))} style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                    cursor: 'pointer', 
                    color: '#667eea',
                    padding: '0.5rem'
                  }}>&lt;</button>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
                    color: '#333',
                    textAlign: 'center',
                    flex: 1
                  }}>{monthStr}</span>
                  <button onClick={() => setCalendarMonth(m => ({ year: m.month === 11 ? m.year + 1 : m.year, month: m.month === 11 ? 0 : m.month + 1 }))} style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                    cursor: 'pointer', 
                    color: '#667eea',
                    padding: '0.5rem'
                  }}>&gt;</button>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '0.25rem', 
                  marginBottom: '0.5rem', 
                  color: '#888', 
                  fontWeight: 600, 
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' 
                }}>
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{ textAlign: 'center' }}>{d}</div>)}
                </div>
                {/* Calendar Days */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
                  {(() => {
                    const firstDay = new Date(year, month, 1).getDay();
                    const blanks = Array(firstDay).fill(null);
                    return [
                      ...blanks.map((_, i) => <div key={'b'+i}></div>),
                      ...days.map(dateObj => {
                        const dateStr = dateObj.toISOString().slice(0,10);
                        const hasSlot = !!slotsByDate[dateStr];
                        const isToday = dateObj.toDateString() === today.toDateString();
                        const isSelected = selectedDate === dateStr;
                        return (
                          <button
                            key={dateStr}
                            onClick={() => handleDayClick(dateStr)}
                            style={{
                              width: '100%',
                              aspectRatio: '1/1',
                              background: isSelected ? '#667eea' : isToday ? '#e3eafe' : 'white',
                              color: isSelected ? 'white' : hasSlot ? '#667eea' : '#333',
                              border: hasSlot ? '2px solid #667eea' : '1px solid #e9ecef',
                              borderRadius: '8px',
                              fontWeight: isSelected ? 700 : 500,
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                              boxShadow: isSelected ? '0 2px 8px #667eea33' : 'none',
                              cursor: 'pointer',
                              opacity: hasSlot || isToday ? 1 : 0.6,
                              position: 'relative',
                              outline: isSelected ? '2px solid #667eea88' : 'none',
                              transition: 'all 0.15s',
                            }}
                          >
                            {dateObj.getDate()}
                            {hasSlot && <span style={{ position: 'absolute', bottom: 6, right: 8, width: 8, height: 8, background: '#667eea', borderRadius: '50%' }}></span>}
                          </button>
                        );
                      })
                    ];
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Current Availability | Select a Date */}
          <div style={{
            display: 'flex',
            gap: 'clamp(1rem, 3vw, 2rem)',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}>
            {/* Current Availability (LEFT) */}
            <div style={{
              backgroundColor: 'white',
              padding: 'clamp(1rem, 3vw, 2rem)',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(102,126,234,0.08)',
              border: '1px solid #e9ecef',
              minWidth: '320px',
              maxWidth: '600px',
              width: '100%',
              flex: 1
            }}>
              <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <h2 style={{ 
                      color: '#333', 
                      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                      fontWeight: 600, 
                      margin: 0 
                    }}>Current Availability</h2>
                    <button 
                      onClick={handleCleanupPastSlots}
                      disabled={cleaningUp}
                      style={{
                        background: cleaningUp ? '#6c757d' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                        fontWeight: '600',
                        cursor: cleaningUp ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                        boxShadow: cleaningUp ? 'none' : '0 2px 8px rgba(220, 53, 69, 0.3)',
                        transition: 'all 0.2s ease',
                        opacity: cleaningUp ? 0.7 : 1,
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => {
                        if (!cleaningUp) {
                          e.target.style.background = '#c82333';
                          e.target.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!cleaningUp) {
                          e.target.style.background = '#dc3545';
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {cleaningUp ? '🔄 Cleaning...' : '🗑️ Clean Up Past Slots'}
                    </button>
                  </div>
                  {loading ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: 'clamp(2rem, 5vw, 3rem)', 
                      color: '#666' 
                    }}>
                      <div style={{ 
                        width: 'clamp(30px, 8vw, 40px)', 
                        height: 'clamp(30px, 8vw, 40px)', 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #667eea', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite', 
                        margin: '0 auto 1rem' 
                      }}></div>
                      <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Loading availability...</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100vw' }}>
                      <table style={{ 
                        width: '100%',
                        maxWidth: '100vw',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                        minWidth: '500px',
                        tableLayout: 'auto',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ 
                              padding: 'clamp(8px, 2vw, 12px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              maxWidth: '120px'
                            }}>Date</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Time</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Location</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Available</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {availability.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ 
                                padding: 'clamp(2rem, 5vw, 3rem)', 
                                textAlign: 'center', 
                                color: '#888', 
                                background: '#f8f9fa', 
                                borderRadius: '12px' 
                              }}>
                                <div style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>⏳</div>
                                <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: 600 }}>No availability slots.</div>
                                <div style={{ color: '#aaa', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>Add a time slot to get started!</div>
                              </td>
                            </tr>
                          ) : (
                            availability.map((slot) => (
                              <tr key={slot.id} style={{ borderBottom: '1px solid #dee2e6', transition: 'background 0.2s' }}>
                                <td style={{ 
                                  padding: 'clamp(8px, 2vw, 12px)', 
                                  verticalAlign: 'top', 
                                  fontWeight: 500,
                                  fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                                  whiteSpace: 'normal',
                                  wordBreak: 'break-word',
                                  maxWidth: '120px'
                                }}>{slot.date}</td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top',
                                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                                }}>{slot.startTime} - {slot.endTime}</td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top',
                                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                                }}>{slot.location}</td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top' 
                                }}>
                                  {slot.available ? (
                                    <span style={{ 
                                      display: 'inline-block', 
                                      background: '#e8f5e9', 
                                      color: '#28a745', 
                                      border: '2px solid #28a745', 
                                      borderRadius: '8px', 
                                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(1rem, 3vw, 1.25rem)', 
                                      fontWeight: 700, 
                                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                                      boxShadow: '0 0 0 2px #28a74522' 
                                    }}>Available</span>
                                  ) : (
                                    <span style={{ 
                                      display: 'inline-block', 
                                      background: '#fff3cd', 
                                      color: '#dc3545', 
                                      border: '2px solid #dc3545', 
                                      borderRadius: '8px', 
                                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(1rem, 3vw, 1.25rem)', 
                                      fontWeight: 700, 
                                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                                      boxShadow: '0 0 0 2px #dc354522' 
                                    }}>Unavailable</span>
                                  )}
                                </td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top' 
                                }}>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button onClick={() => handleEditSlot(slot)} style={{ 
                                      background: '#667eea', 
                                      color: 'white', 
                                      border: 'none', 
                                      borderRadius: '6px', 
                                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)', 
                                      fontWeight: 600, 
                                      cursor: 'pointer', 
                                      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', 
                                      boxShadow: '0 2px 8px #667eea22',
                                      whiteSpace: 'nowrap'
                                    }}>Edit</button>
                                    <button 
                                      onClick={() => handleDeleteSlot(slot.id)} 
                                      disabled={deleting === slot.id}
                                      style={{ 
                                        background: deleting === slot.id ? '#6c757d' : '#dc3545', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)', 
                                        fontWeight: 600, 
                                        cursor: deleting === slot.id ? 'not-allowed' : 'pointer', 
                                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', 
                                        boxShadow: deleting === slot.id ? 'none' : '0 2px 8px rgba(220, 53, 69, 0.3)',
                                        opacity: deleting === slot.id ? 0.7 : 1,
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {deleting === slot.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
            {/* Select a Date (RIGHT) */}
            <div style={{
              backgroundColor: 'white',
              padding: 'clamp(1rem, 3vw, 2rem)',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(102,126,234,0.08)',
              border: '1px solid #e9ecef',
              minWidth: '320px',
              maxWidth: '600px',
              width: '100%',
              flex: 1
            }}>
              <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <h2 style={{ 
                      color: '#333', 
                      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                      fontWeight: 600, 
                      margin: 0 
                    }}>
                      {selectedDate ? `Availability for ${selectedDate}` : 'Select a Date'}
                    </h2>
                    {selectedDate && (
                      <span style={{ 
                        background: '#e3eafe', 
                        color: '#667eea', 
                        padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)', 
                        borderRadius: '8px', 
                        fontWeight: '600', 
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                        whiteSpace: 'nowrap'
                      }}>
                        📅 Selected
                      </span>
                    )}
                  </div>
                  {loading ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: 'clamp(2rem, 5vw, 3rem)', 
                      color: '#666' 
                    }}>
                      <div style={{ 
                        width: 'clamp(30px, 8vw, 40px)', 
                        height: 'clamp(30px, 8vw, 40px)', 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #667eea', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite', 
                        margin: '0 auto 1rem' 
                      }}></div>
                      <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Loading availability...</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100vw' }}>
                      <table style={{ 
                        width: '100%',
                        maxWidth: '100vw',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                        minWidth: '500px',
                        tableLayout: 'auto',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ 
                              padding: 'clamp(8px, 2vw, 12px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              maxWidth: '120px'
                            }}>Date</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Time</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Location</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Available</th>
                            <th style={{ 
                              padding: 'clamp(12px, 3vw, 16px)', 
                              textAlign: 'left', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                              color: '#333', 
                              fontWeight: 600, 
                              borderBottom: '1px solid #dee2e6' 
                            }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!selectedDate ? (
                            <tr>
                              <td colSpan="5" style={{ 
                                padding: 'clamp(2rem, 5vw, 3rem)', 
                                textAlign: 'center', 
                                color: '#888', 
                                background: '#f8f9fa', 
                                borderRadius: '12px' 
                              }}>
                                <div style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>📅</div>
                                <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: 600 }}>No Date Selected</div>
                                <div style={{ color: '#aaa', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>Click on a date in the calendar above to view availability</div>
                              </td>
                            </tr>
                          ) : filteredSlots.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ 
                                padding: 'clamp(2rem, 5vw, 3rem)', 
                                textAlign: 'center', 
                                color: '#888', 
                                background: '#f8f9fa', 
                                borderRadius: '12px' 
                              }}>
                                <div style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>⏳</div>
                                <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: 600 }}>No availability slots for {selectedDate}</div>
                                <div style={{ color: '#aaa', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>Add a time slot for this date!</div>
                              </td>
                            </tr>
                          ) : (
                            filteredSlots.map((slot) => (
                              <tr key={slot.id} style={{ borderBottom: '1px solid #dee2e6', transition: 'background 0.2s' }}>
                                <td style={{ 
                                  padding: 'clamp(8px, 2vw, 12px)', 
                                  verticalAlign: 'top', 
                                  fontWeight: 500,
                                  fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                                  whiteSpace: 'normal',
                                  wordBreak: 'break-word',
                                  maxWidth: '120px'
                                }}>{slot.date}</td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top',
                                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                                }}>{slot.startTime} - {slot.endTime}</td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top',
                                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
                                }}>{slot.location}</td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top' 
                                }}>
                                  {slot.available ? (
                                    <span style={{ 
                                      display: 'inline-block', 
                                      background: '#e8f5e9', 
                                      color: '#28a745', 
                                      border: '2px solid #28a745', 
                                      borderRadius: '8px', 
                                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(1rem, 3vw, 1.25rem)', 
                                      fontWeight: 700, 
                                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                                      boxShadow: '0 0 0 2px #28a74522' 
                                    }}>Available</span>
                                  ) : (
                                    <span style={{ 
                                      display: 'inline-block', 
                                      background: '#fff3cd', 
                                      color: '#dc3545', 
                                      border: '2px solid #dc3545', 
                                      borderRadius: '8px', 
                                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(1rem, 3vw, 1.25rem)', 
                                      fontWeight: 700, 
                                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                                      boxShadow: '0 0 0 2px #dc354522' 
                                    }}>Unavailable</span>
                                  )}
                                </td>
                                <td style={{ 
                                  padding: 'clamp(12px, 3vw, 16px)', 
                                  verticalAlign: 'top' 
                                }}>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button onClick={() => handleEditSlot(slot)} style={{ 
                                      background: '#667eea', 
                                      color: 'white', 
                                      border: 'none', 
                                      borderRadius: '6px', 
                                      padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)', 
                                      fontWeight: 600, 
                                      cursor: 'pointer', 
                                      fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', 
                                      boxShadow: '0 2px 8px #667eea22',
                                      whiteSpace: 'nowrap'
                                    }}>Edit</button>
                                    <button 
                                      onClick={() => handleDeleteSlot(slot.id)} 
                                      disabled={deleting === slot.id}
                                      style={{ 
                                        background: deleting === slot.id ? '#6c757d' : '#dc3545', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px', 
                                        padding: 'clamp(0.4rem, 2vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem)', 
                                        fontWeight: 600, 
                                        cursor: deleting === slot.id ? 'not-allowed' : 'pointer', 
                                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', 
                                        boxShadow: deleting === slot.id ? 'none' : '0 2px 8px rgba(220, 53, 69, 0.3)',
                                        opacity: deleting === slot.id ? 0.7 : 1,
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {deleting === slot.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
            </div>
          </div>

        {/* Weekly View Availability Calendar */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
          borderTop: '1px solid #eee',
          marginTop: 'clamp(2rem, 5vw, 3rem)'
        }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
              <h2 style={{ 
                fontSize: 'clamp(1.3rem, 4vw, 1.575rem)', 
                fontWeight: 800, 
                color: '#1a1a1a', 
                marginBottom: 24, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)' }}>📅</span> Weekly Availability View
              </h2>
              <p style={{ 
                fontSize: 'clamp(1rem, 2.5vw, 1.055rem)', 
                color: '#666', 
                marginBottom: 24, 
                lineHeight: 1.6 
              }}>
                View availability in a weekly format for easier planning and management.
              </p>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem)', color: '#666' }}>
                <div style={{ 
                  width: 'clamp(30px, 8vw, 40px)', 
                  height: 'clamp(30px, 8vw, 40px)', 
                  border: '4px solid #f3f3f3', 
                  borderTop: '4px solid #667eea', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite', 
                  margin: '0 auto 1rem' 
                }}></div>
                <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Loading availability...</p>
              </div>
            ) : (
              <div style={{ maxWidth: 'clamp(600px, 90vw, 800px)', margin: '0 auto' }}>
                {/* Week Selection Controls */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 'clamp(0.5rem, 2vw, 1rem)', 
                  marginBottom: 'clamp(1rem, 3vw, 2rem)',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setSelectedWeek(prev => prev - 1)}
                    style={{
                      background: 'none',
                      border: '2px solid #667eea',
                      color: '#667eea',
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ← Previous Week
                  </button>
                  
                  <div style={{ 
                    backgroundColor: '#667eea', 
                    color: 'white', 
                    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', 
                    borderRadius: '8px', 
                    fontWeight: 700,
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    minWidth: 'clamp(120px, 25vw, 150px)',
                    textAlign: 'center'
                  }}>
                    {getWeekLabel(selectedWeek)}
                  </div>
                  
                  <button
                    onClick={() => setSelectedWeek(prev => prev + 1)}
                    style={{
                      background: 'none',
                      border: '2px solid #667eea',
                      color: '#667eea',
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Next Week →
                  </button>
                </div>

                {/* Calendar */}
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: 'clamp(1rem, 3vw, 2rem)', 
                  borderRadius: '16px', 
                  border: '1px solid #e9ecef' 
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(0.25rem, 1.5vw, 0.5rem)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} style={{ 
                        textAlign: 'center', 
                        fontWeight: 600, 
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', 
                        color: '#666', 
                        padding: 'clamp(0.4rem, 2vw, 0.5rem)' 
                      }}>
                        {day}
                      </div>
                    ))}
                    {selectedWeekDates.map((date, index) => {
                      const dateStr = date.toISOString().slice(0, 10);
                      const daySlots = getAvailabilityForDate(date);
                      const isToday = date.toDateString() === today.toDateString();
                      const isPast = date < today;
                      
                      return (
                        <div key={index} style={{
                          padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                          borderRadius: '8px',
                          backgroundColor: isToday ? '#e3eafe' : isPast ? '#f3f4f6' : 'white',
                          border: isToday ? '2px solid #667eea' : '1px solid #e9ecef',
                          textAlign: 'center',
                          minHeight: 'clamp(60px, 15vw, 80px)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ 
                            fontWeight: 600, 
                            fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)', 
                            color: isToday ? '#667eea' : isPast ? '#9ca3af' : '#333' 
                          }}>
                            {date.getDate()}
                          </div>
                          <div style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)', color: '#666' }}>
                            {daySlots.length > 0 ? (
                              <div>
                                {daySlots.slice(0, 2).map((slot, idx) => (
                                  <div key={idx} style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)', color: '#666', marginTop: '0.25rem' }}>
                                    <div>{formatTime(slot.startTime)}-{formatTime(slot.endTime)}</div>
                                    <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.65rem)', color: '#888', marginTop: '0.1rem' }}>
                                      {slot.location}
                                    </div>
                                  </div>
                                ))}
                                {daySlots.length > 2 && (
                                  <div style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)', color: '#059669', fontWeight: 600 }}>
                                    +{daySlots.length - 2} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div style={{ color: '#dc2626', fontWeight: 600 }}>No slots</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ 
              backgroundColor: '#e0e7ff', 
              padding: 'clamp(1rem, 3vw, 1.5rem)', 
              borderRadius: '12px', 
              marginTop: 'clamp(1rem, 3vw, 2rem)',
              border: '1px solid #6c63ff',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.885rem)', color: '#4f46e5', fontWeight: 600 }}>
                <strong>Note:</strong> This weekly view shows available time slots. Use the calendar above to add or edit availability slots.
              </p>
            </div>
          </div>
        </div>
        {/* Global Edit Modal for AvailabilityForm */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              minWidth: '320px',
              maxWidth: '95vw',
              width: '100%',
              position: 'relative',
            }}>
              <button onClick={handleFormClose} style={{
                position: 'absolute',
                top: 12,
                right: 18,
                background: 'none',
                border: 'none',
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                color: '#667eea',
                cursor: 'pointer',
                zIndex: 1001,
              }}>&times;</button>
              <AvailabilityForm slot={formSlot ? formSlot : (formDate ? { date: formDate } : null)} onSuccess={handleFormSuccess} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}