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

  async function fetchAvailability() {
    setLoading(true);
    try {
      const res = await fetch('/api/availability');
      const data = await res.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAvailability();
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

  // Handlers for calendar/form
  function handleDayClick(dateStr) {
    setSelectedDate(dateStr);
    setFormSlot(null);
    setFormDate(dateStr);
    setShowForm(true);
  }
  function handleEditSlot(slot) {
    setFormSlot(slot);
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ color: '#333', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px' }}>📅 Pickup/Drop-Off Time Slot Manager</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1px solid #e9ecef' }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.5rem', fontWeight: 600 }}>Add New Time Slot</h2>
              <AvailabilityForm onSuccess={fetchAvailability} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Calendar View */}
              <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1px solid #e9ecef', padding: '1.5rem', marginBottom: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <button onClick={() => setCalendarMonth(m => ({ year: m.month === 0 ? m.year - 1 : m.year, month: m.month === 0 ? 11 : m.month - 1 }))} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#667eea' }}>&lt;</button>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#333' }}>{monthStr}</span>
                  <button onClick={() => setCalendarMonth(m => ({ year: m.month === 11 ? m.year + 1 : m.year, month: m.month === 11 ? 0 : m.month + 1 }))} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#667eea' }}>&gt;</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem', color: '#888', fontWeight: 600, fontSize: '0.95rem' }}>
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
                              fontSize: '1rem',
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
                {/* Modal/Inline Form for slot creation/editing */}
                {showForm && (
                  <div style={{ position: 'absolute', top: 40, left: 0, right: 0, zIndex: 10, background: 'rgba(255,255,255,0.98)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '2rem', border: '2px solid #667eea' }}>
                    <button onClick={handleFormClose} style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: '1.5rem', color: '#667eea', cursor: 'pointer' }}>&times;</button>
                    <AvailabilityForm slot={formSlot ? formSlot : (formDate ? { date: formDate } : null)} onSuccess={handleFormSuccess} />
                  </div>
                )}
              </div>
              {/* Table View */}
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1px solid #e9ecef' }}>
                <h2 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.5rem', fontWeight: 600 }}>Current Availability{selectedDate ? ` for ${selectedDate}` : ''}</h2>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p style={{ fontSize: '1.1rem' }}>Loading availability...</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Date</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Time</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Location</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Available</th>
                          <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSlots.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#888', background: '#f8f9fa', borderRadius: '12px' }}>
                              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>No availability slots{selectedDate ? ' for this day' : ''}.</div>
                              <div style={{ color: '#aaa', marginTop: '0.5rem' }}>Add a time slot to get started!</div>
                            </td>
                          </tr>
                        ) : (
                          filteredSlots.map((slot) => (
                            <tr key={slot._id} style={{ borderBottom: '1px solid #dee2e6', transition: 'background 0.2s' }}>
                              <td style={{ padding: '16px', verticalAlign: 'top', fontWeight: 500 }}>{slot.date}</td>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>{slot.startTime} - {slot.endTime}</td>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>{slot.location}</td>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                {slot.available ? (
                                  <span style={{ display: 'inline-block', background: '#e8f5e9', color: '#28a745', border: '2px solid #28a745', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '1rem', boxShadow: '0 0 0 2px #28a74522' }}>Available</span>
                                ) : (
                                  <span style={{ display: 'inline-block', background: '#fff3cd', color: '#dc3545', border: '2px solid #dc3545', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '1rem', boxShadow: '0 0 0 2px #dc354522' }}>Unavailable</span>
                                )}
                              </td>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                <button onClick={() => handleEditSlot(slot)} style={{ background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 2px 8px #667eea22', marginRight: 8 }}>Edit</button>
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
        </div>
      </main>
    </div>
  );
}