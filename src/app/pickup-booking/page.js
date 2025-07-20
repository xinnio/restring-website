"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PickupBooking() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    bookingNumber: '',
    selectedLocation: '',
    selectedDate: '',
    selectedTimeSlot: '',
    selectedWindow: '',
    specialRequest: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  // Fetch availability slots
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch('/api/availability');
        const data = await res.json();
        // Filter to only show available slots
        const availableSlots = data.filter(slot => slot.available);
        setAvailability(availableSlots);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setAvailabilityLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePickupSubmit = async (e) => {
    e.preventDefault();
    // Allow submission without slot if special request is provided
    if (!form.selectedTimeSlot && !form.specialRequest.trim()) {
      setError('Please select a pickup time slot or provide a special request.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, find the booking to verify details
      const bookingsRes = await fetch('/api/bookings');
      const bookings = await bookingsRes.json();
      
      const foundBooking = bookings.find(b => 
        b.bookingNumber === parseInt(form.bookingNumber) &&
        (b.fullName.toLowerCase() === form.fullName.toLowerCase() || 
         b.phone === form.phone || 
         b.email === form.email)
      );

      if (!foundBooking) {
        setError('No booking found with the provided details. Please check your booking number, name, phone number, or email and try again.');
        setLoading(false);
        return;
      }

      let pickupData = {};
      
      if (form.selectedTimeSlot) {
        const selectedSlot = availability.find(slot => slot._id === form.selectedTimeSlot);
        if (selectedSlot) {
          // Format the pickup time as DD/MM/YYYY, HH:mm - HH:mm
          const date = new Date(selectedSlot.date);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          
          // Use selected window if available, otherwise use slot time
          const timeDisplay = form.selectedWindow || `${selectedSlot.startTime} - ${selectedSlot.endTime}`;
          const formattedPickupTime = `${day}/${month}/${year}, ${timeDisplay}`;
          
          // Save comprehensive pickup information
          pickupData.pickupTime = formattedPickupTime;
          pickupData.pickupLocation = selectedSlot.location;
          pickupData.pickupSlotId = selectedSlot._id;
          pickupData.pickupDate = selectedSlot.date; // Raw date for sorting/filtering
          pickupData.pickupStartTime = selectedSlot.startTime; // Raw start time
          pickupData.pickupEndTime = selectedSlot.endTime; // Raw end time
          pickupData.pickupScheduledAt = new Date().toISOString(); // When pickup was scheduled
          if (form.selectedWindow) {
            pickupData.pickupWindow = form.selectedWindow;
          }
        }
      }
      
      if (form.specialRequest.trim()) {
        pickupData.specialPickupRequest = form.specialRequest.trim();
      }

      const res = await fetch(`/api/bookings/${foundBooking._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pickupData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        setError('Failed to update pickup time. Please try again.');
      }
    } catch (error) {
      setError('Error updating pickup time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations from availability
  const locations = [...new Set(availability.map(slot => slot.location))].sort();

  // Get available dates for selected location (only today and future dates)
  const getAvailableDatesForLocation = (location) => {
    if (!location) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    const locationSlots = availability.filter(slot => slot.location === location);
    const dates = [...new Set(locationSlots.map(slot => slot.date))]
      .filter(date => {
        const slotDate = new Date(date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate >= today; // Only include today and future dates
      })
      .sort();
    return dates;
  };

  // Get slots for selected date and location (filter out past times for today)
  const getSlotsForDate = (location, date) => {
    if (!location || !date) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const isToday = selectedDate.getTime() === today.getTime();
    
    let slots = availability.filter(slot => 
      slot.location === location && slot.date === date
    );
    
    // If it's today, filter out past time slots
    if (isToday) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      slots = slots.filter(slot => {
        // Only show slots that start at least 30 minutes from now
        const slotStartTime = slot.startTime;
        return slotStartTime > currentTime;
      });
    }
    
    return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Helper to generate 30-min windows
  const getThirtyMinWindows = (start, end) => {
    const result = [];
    let [sh, sm] = start.split(':').map(Number);
    let [eh, em] = end.split(':').map(Number);
    let startDate = new Date(0, 0, 0, sh, sm);
    let endDate = new Date(0, 0, 0, eh, em);
    while (startDate < endDate) {
      let next = new Date(startDate.getTime() + 30 * 60000);
      if (next > endDate) next = endDate;
      const pad = n => n.toString().padStart(2, '0');
      result.push(`${pad(startDate.getHours())}:${pad(startDate.getMinutes())} - ${pad(next.getHours())}:${pad(next.getMinutes())}`);
      startDate = next;
    }
    return result;
  };

  if (success) {
    const selectedSlot = availability.find(slot => slot._id === form.selectedTimeSlot);
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          color: '#333',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
          
          <h1 style={{
            color: '#28a745',
            marginBottom: '1.5rem',
            fontSize: '2rem',
            fontWeight: '700'
          }}>
            Pickup Time Scheduled!
          </h1>
          
          <div style={{
            background: '#e8f5e8',
            padding: '1.5rem',
            borderRadius: '12px',
            margin: '1.5rem 0',
            borderLeft: '4px solid #28a745',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '1rem', fontSize: '1.25rem' }}>
              📅 Your Pickup Details:
            </h3>
            <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
              <strong>Booking Number:</strong> #{form.bookingNumber}
            </p>
            {selectedSlot ? (
              <>
                <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                  <strong>Pickup Date:</strong> {new Date(selectedSlot.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                  <strong>Pickup Time:</strong> {form.selectedWindow || `${selectedSlot.startTime} - ${selectedSlot.endTime}`}
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                  <strong>Location:</strong> {selectedSlot.location}
                </p>
              </>
            ) : (
              <p style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                <strong>Special Request:</strong> {form.specialRequest}
              </p>
            )}
          </div>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Your pickup time has been successfully scheduled. Please arrive at the specified time and location.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setSuccess(false);
                setForm({ fullName: '', phone: '', bookingNumber: '', selectedLocation: '', selectedDate: '', selectedTimeSlot: '', selectedWindow: '', specialRequest: '' });
              }}
              style={{
                background: '#667eea',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📝 Schedule Another Pickup
            </button>
            
            <button
              onClick={() => router.push('/home')}
              style={{
                background: 'transparent',
                color: '#667eea',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                border: '2px solid #667eea',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🏠 Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            🎾 Schedule Pickup Time
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Your racket stringing is complete! Schedule your pickup time below.
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
          <form onSubmit={handlePickupSubmit}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: '#1a1a1a'
            }}>
              📋 Booking Information
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                  Booking Number *
                </label>
                <input
                  type="number"
                  name="bookingNumber"
                  value={form.bookingNumber}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., 1000"
                />
              </div>
            </div>

            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: '#1a1a1a'
            }}>
              📅 Select Pickup Time Slot
            </h2>

            {availabilityLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#666',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p style={{ fontSize: '1.1rem' }}>Loading available time slots...</p>
              </div>
            ) : availability.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#666',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Available Time Slots</h3>
                <p style={{ color: '#888' }}>No pickup time slots are currently available. Please use the special request option below.</p>
              </div>
            ) : (
              <div style={{ marginBottom: '2rem' }}>
                {/* Step 1: Location Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                    📍 Pickup Location *
                  </label>
                  <select
                    name="selectedLocation"
                    value={form.selectedLocation}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s ease',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Location...</option>
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Date Selection */}
                {form.selectedLocation && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                      📅 Pickup Date *
                    </label>
                    {getAvailableDatesForLocation(form.selectedLocation).length === 0 ? (
                      <div style={{ color: '#b71c1c', fontWeight: 500, padding: '0.875rem', background: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
                        No availability for this location.
                      </div>
                    ) : (
                      <input
                        type="date"
                        name="selectedDate"
                        value={form.selectedDate}
                        onChange={handleChange}
                        required
                        min={getAvailableDatesForLocation(form.selectedLocation)[0]}
                        max={getAvailableDatesForLocation(form.selectedLocation).slice(-1)[0]}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Step 3: Time Slot Selection */}
                {form.selectedLocation && form.selectedDate && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                      ⏰ Pickup Time Slot *
                    </label>
                    {getSlotsForDate(form.selectedLocation, form.selectedDate).length === 0 ? (
                      <div style={{ color: '#b71c1c', fontWeight: 500, padding: '0.875rem', background: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
                        No time slots available for this date.
                      </div>
                    ) : (
                      <select
                        name="selectedTimeSlot"
                        value={form.selectedTimeSlot}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'border-color 0.2s ease',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select a time slot...</option>
                        {getSlotsForDate(form.selectedLocation, form.selectedDate).map(slot => (
                          <option key={slot._id} value={slot._id}>
                            {slot.startTime} - {slot.endTime}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Step 4: 30-Minute Window Selection */}
                {form.selectedTimeSlot && (() => {
                  const slot = availability.find(s => s._id === form.selectedTimeSlot);
                  if (!slot) return null;
                  const windows = getThirtyMinWindows(slot.startTime, slot.endTime);
                  return (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                        🕐 Select 30-Minute Window (Optional)
                      </label>
                      <select
                        name="selectedWindow"
                        value={form.selectedWindow}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'border-color 0.2s ease',
                          backgroundColor: 'white',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">Select 30-min window (optional)...</option>
                        {windows.map(w => (
                          <option key={w} value={w}>
                            {slot.date} | {w}
                          </option>
                        ))}
                      </select>
                      <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem', display: 'block' }}>
                        Choose a specific 30-minute window within the selected time slot, or leave as default.
                      </small>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Special Request Message Box */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '1rem' }}>
                Special Pickup Request (Optional)
              </label>
              <textarea
                name="specialRequest"
                value={form.specialRequest}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Need a different time? Special arrangements? Let us know here and we'll contact you to arrange a suitable pickup time."
              />
              <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem', display: 'block' }}>
                If you can't find a suitable time slot above, let us know your preferred time and we'll contact you to arrange it.
              </small>
            </div>

            {error && (
              <div style={{
                background: '#f8d7da',
                color: '#721c24',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #f5c6cb',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => router.push('/home')}
                style={{
                  background: 'transparent',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🏠 Return to Home
              </button>
              
              <button
                type="submit"
                disabled={loading || (!form.selectedTimeSlot && !form.specialRequest.trim())}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: loading || (!form.selectedTimeSlot && !form.specialRequest.trim()) ? 'not-allowed' : 'pointer',
                  opacity: loading || (!form.selectedTimeSlot && !form.specialRequest.trim()) ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? '⏳ Scheduling...' : '✅ Schedule Pickup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 