'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Locations() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = this week, 1 = next week, etc.

  // Fetch availability data
  useEffect(() => {
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
    fetchAvailability();
  }, []);

  // Helper function to get week dates
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
  const today = new Date();
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

  // Contact form handlers
  function handleContactFormChange(e) {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleContactFormSubmit(e) {
    e.preventDefault();
    setFormStatus('loading');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactForm,
          to: '0xinniliu0@gmail.com'
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          message: ''
        });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
    }
  }
  const businessHours = [
    { day: 'Monday', hours: '10:00 AM - 7:00 PM', status: 'open' },
    { day: 'Tuesday', hours: '10:00 AM - 7:00 PM', status: 'open' },
    { day: 'Wednesday', hours: '10:00 AM - 7:00 PM', status: 'open' },
    { day: 'Thursday', hours: '10:00 AM - 7:00 PM', status: 'open' },
    { day: 'Friday', hours: '10:00 AM - 7:00 PM', status: 'open' },
    { day: 'Saturday', hours: 'Closed', status: 'closed' },
    { day: 'Sunday', hours: 'Closed', status: 'closed' }
  ];

  const pickupLocations = [
    {
      name: 'Wiser Park Tennis Courts',
      address: 'Markham, ON L6E 1H8',
      hours: 'By appointment',
      distance: '5 min from Markham Centre',
      icon: '🎾'
    },
    {
      name: 'Angus Glen Community Centre (Library)',
      address: '3970 Major Mackenzie Dr E, Markham, ON L6C 1P8',
      hours: 'By appointment',
      distance: '8 min from Markham Centre',
      icon: '🏢'
    },
    {
      name: 'Door-to-Door (Delivery)',
      address: 'Available for orders over $100 (free) or by special arrangement',
      hours: 'By appointment',
      distance: 'Contact us to arrange',
      icon: '🚗'
    }
  ];

  return (
    <div style={{ backgroundColor: '#fafafa' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>Find Us & Get in Touch</h1>
          <p style={{ fontSize: 'var(--font-size-body-large)', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Convenient locations across Markham for all your racket stringing needs</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/booking" style={{
              textDecoration: 'none',
              backgroundColor: 'white',
              color: '#667eea',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.955rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              Book Now
            </Link>
            <Link href="/services" style={{
              textDecoration: 'none',
              backgroundColor: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.955rem',
              border: '2px solid white',
              transition: 'all 0.2s ease'
            }}>
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Main Location */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 'var(--font-size-h2)' }}>🗺️</span> Our Location
              </h2>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ fontSize: '2.375rem', marginBottom: 12 }}>🗺️</div>
            <div style={{ fontWeight: 700, fontSize: '1.025rem', marginBottom: 4 }}>Interactive Map</div>
            <div style={{ fontSize: '0.875rem', color: '#888' }}>Google Maps integration coming soon</div>
            <div style={{ background: '#f3f4f6', color: '#6b7280', padding: '0.5rem 1rem', borderRadius: 999, fontWeight: 600, fontSize: '0.825rem', marginLeft: 4 }}>Coming Soon</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'left',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.955rem', color: '#4f46e5', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: '1.175rem' }}>📍</span> Studio Location</div>
            <div style={{ fontSize: '0.955rem', color: '#1a1a1a', fontWeight: 600, marginBottom: 2 }}>See Drop-off and Pick-up locations</div>
            <div style={{ fontSize: '0.875rem', color: '#333', marginBottom: 2 }}>Multiple convenient locations available<br />throughout Markham</div>
            <div style={{ fontSize: '0.825rem', color: '#888', fontStyle: 'italic', marginBottom: 8 }}>Scroll down to view all locations</div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#6c63ff', fontWeight: 700, fontSize: '0.925rem', cursor: 'pointer', gap: 8 }}>
              <span style={{ fontSize: '1.075rem' }}>👇</span> View Locations Below
            </div>
                </div>
              </div>
      </section>

      {/* Pickup & Drop-off Locations */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.875rem' }}>📍</span> Drop-off & Pick-up Locations
          </h2>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {pickupLocations.map((location, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              textAlign: 'left',
              transition: 'transform 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2.075rem', marginRight: 12 }}>{location.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.005rem', color: '#1a1a1a', marginBottom: 2 }}>{location.name}</div>
                  <div style={{ fontSize: '0.885rem', color: '#333', marginBottom: 2 }}>{location.address}</div>
                  <div style={{ fontSize: '0.855rem', color: '#888', marginBottom: 2 }}>Hours: {location.hours}</div>
                  <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.8rem', borderRadius: 999, fontWeight: 600, fontSize: '0.805rem', letterSpacing: '0.01em', display: 'inline-block', marginTop: 2 }}>{location.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #f59e42',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '1.175rem', color: '#f59e42' }}>⚠️</span>
            <div style={{ fontSize: '0.885rem', color: '#b45309', fontWeight: 600 }}><strong>Note:</strong> Door-to-door pick-up available for orders over $100 (free) or by special arrangement.</div>
          </div>

          <div style={{
            backgroundColor: '#e0e7ff',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #6c63ff',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '1.175rem', color: '#6c63ff' }}>⚡</span>
            <div style={{ fontSize: '0.885rem', color: '#4f46e5', fontWeight: 600 }}>Same-day pick-up available at select locations. Book early to secure your spot!</div>
          </div>
        </div>
      </section>

            {/* Contact Information */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.575rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.875rem' }}>📞</span> Contact Information
                </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.875rem', color: '#6c63ff' }}>📧</div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.955rem', color: '#1a1a1a', marginBottom: 2 }}>Email</div>
                <div style={{ fontSize: '0.925rem', color: '#6c63ff', fontWeight: 600 }}>markhamrestring@gmail.com</div>
                <div style={{ fontSize: '0.795rem', color: '#888' }}>We&apos;ll respond within 24 hours</div>
                    </div>
                  </div>
            
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.875rem', color: '#059669' }}>📱</div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.955rem', color: '#1a1a1a', marginBottom: 2 }}>Phone</div>
                <div style={{ fontSize: '0.925rem', color: '#059669', fontWeight: 600 }}>(647) 655-3658</div>
                <div style={{ fontSize: '0.795rem', color: '#888' }}>Call for urgent matters only</div>
                    </div>
                  </div>
            
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.875rem', color: '#f59e42' }}>📱</div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.955rem', color: '#1a1a1a', marginBottom: 2 }}>Text Message</div>
                <div style={{ fontSize: '0.925rem', color: '#f59e42', fontWeight: 600 }}>(647) 655-3658</div>
                <div style={{ fontSize: '0.795rem', color: '#888' }}>SMS for quick questions</div>
              </div>
                    </div>
                  </div>

          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            marginTop: '2rem',
            border: '1px solid #f59e42',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.885rem', color: '#b45309', fontWeight: 600 }}>
              <strong>Note:</strong> Please contact us via email or text message for general inquiries. Call us only for urgent matters.
            </p>
                    </div>
                  </div>
      </section>

      {/* Availability Calendar */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.575rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.875rem' }}>📅</span> Availability Calendar
            </h2>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              <p style={{ fontSize: '1.1rem' }}>Loading availability...</p>
            </div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Week Selection Controls */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1rem', 
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setSelectedWeek(prev => prev - 1)}
                  style={{
                    background: 'none',
                    border: '2px solid #667eea',
                    color: '#667eea',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Previous Week
                </button>
                
                <div style={{ 
                  backgroundColor: '#667eea', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px', 
                  fontWeight: 700,
                  fontSize: '1rem',
                  minWidth: '150px',
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
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem'
                  }}
                >
                  Next Week →
                </button>
              </div>

              {/* Calendar */}
              <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '16px', border: '1px solid #e9ecef' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#666', padding: '0.5rem' }}>
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
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: isToday ? '#e3eafe' : isPast ? '#f3f4f6' : 'white',
                        border: isToday ? '2px solid #667eea' : '1px solid #e9ecef',
                        textAlign: 'center',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ 
                          fontWeight: 600, 
                          fontSize: '0.875rem', 
                          color: isToday ? '#667eea' : isPast ? '#9ca3af' : '#333' 
                        }}>
                          {date.getDate()}
                </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                          {daySlots.length > 0 ? (
                            <div>
                              {daySlots.slice(0, 2).map((slot, idx) => (
                                <div key={idx} style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
                                  <div>{formatTime(slot.startTime)}-{formatTime(slot.endTime)}</div>
                                  <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.1rem' }}>
                                    {slot.location}
                  </div>
                </div>
                              ))}
                              {daySlots.length > 2 && (
                                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
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
            padding: '1.5rem', 
            borderRadius: '12px', 
            marginTop: '2rem',
            border: '1px solid #6c63ff',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.885rem', color: '#4f46e5', fontWeight: 600 }}>
              <strong>Note:</strong> This calendar shows available time slots. For booking, please use the booking form above.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.375rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24 }}>Get in Touch</h2>
          <p style={{ fontSize: '1.055rem', color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Have questions about our services or need a custom quote? Send us a message!</p>
          
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid #f59e42'
          }}>
            <p style={{ fontSize: '0.885rem', color: '#b45309', fontWeight: 600 }}>
              <strong>Note:</strong> For immediate assistance, please call or text us directly. Email responses may take up to 24 hours.
              </p>
            </div>
          </div>
        
        <form onSubmit={handleContactFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-label)', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Name</label>
                <input
                  type="text"
                  name="name"
              value={contactForm.name}
              onChange={handleContactFormChange}
                  required
              style={{ 
                width: '100%', 
                padding: '1.1rem 1.2rem', 
                border: '1.5px solid #e0e7ff', 
                borderRadius: 14, 
                fontSize: 'var(--font-size-input)', 
                fontWeight: 500, 
                color: '#1a1a1a', 
                outline: 'none', 
                transition: 'border 0.18s' 
              }}
                  placeholder="Enter your full name"
                />
              </div>
          
              <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-label)', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Email</label>
                <input
                  type="email"
                  name="email"
                value={contactForm.email}
                onChange={handleContactFormChange}
                  required
                style={{ 
                  width: '100%', 
                  padding: '1.1rem 1.2rem', 
                  border: '1.5px solid #e0e7ff', 
                  borderRadius: 14, 
                  fontSize: 'var(--font-size-input)', 
                  fontWeight: 500, 
                  color: '#1a1a1a', 
                  outline: 'none', 
                  transition: 'border 0.18s' 
                }}
                  placeholder="your.email@example.com"
                />
              </div>
          
              <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-label)', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Phone</label>
                <input
                  type="tel"
                  name="phone"
                value={contactForm.phone}
                onChange={handleContactFormChange}
                style={{ 
                  width: '100%', 
                  padding: '1.1rem 1.2rem', 
                  border: '1.5px solid #e0e7ff', 
                  borderRadius: 14, 
                  fontSize: 'var(--font-size-input)', 
                  fontWeight: 500, 
                  color: '#1a1a1a', 
                  outline: 'none', 
                  transition: 'border 0.18s' 
                }}
                  placeholder="(123) 456-7890"
                />
              </div>
          
              <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-label)', fontWeight: 700, color: '#333', marginBottom: 8 }}>Service Type</label>
                <select
                name="serviceType"
                value={contactForm.serviceType}
                onChange={handleContactFormChange}
                style={{ 
                  width: '100%', 
                  padding: '1.1rem 1.2rem', 
                  border: '1.5px solid #e0e7ff', 
                  borderRadius: 14, 
                  fontSize: 'var(--font-size-input)', 
                  fontWeight: 500, 
                  color: '#1a1a1a', 
                  outline: 'none', 
                  transition: 'border 0.18s' 
                }}
              >
              <option value="">Select a service</option>
                  <option value="tennis">Tennis Racket Stringing</option>
                  <option value="badminton">Badminton Racket Stringing</option>
              <option value="grommet">Grommet Replacement</option>
              <option value="other">Other</option>
                </select>
              </div>
          
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-label)', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Message</label>
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleContactFormChange}
                required
                rows="4"
                style={{ 
                  width: '100%', 
                  padding: '1.1rem 1.2rem', 
                  border: '1.5px solid #e0e7ff', 
                  borderRadius: 14, 
                  fontSize: 'var(--font-size-input)', 
                  fontWeight: 500, 
                  color: '#1a1a1a', 
                  outline: 'none', 
                  transition: 'border 0.18s', 
                  resize: 'none' 
                }}
                placeholder="Tell us about your stringing needs..."
              ></textarea>
            </div>
          
              <button
                type="submit"
            disabled={formStatus === 'loading'}
            style={{ 
              background: formStatus === 'loading' ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '1.2rem 2rem', 
              borderRadius: 16, 
              fontWeight: 700, 
              fontSize: 'var(--font-size-button)', 
              boxShadow: '0 2px 12px rgba(102,126,234,0.10)', 
              border: 'none', 
              cursor: formStatus === 'loading' ? 'not-allowed' : 'pointer', 
              transition: 'background 0.18s, color 0.18s, transform 0.13s' 
            }}
          >
            {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
          
          {formStatus === 'success' && (
            <div style={{ 
              backgroundColor: '#e8f5e9', 
              color: '#2e7d32', 
              padding: '1rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid #4caf50'
            }}>
              Message sent successfully! We&apos;ll get back to you soon.
            </div>
          )}
          
          {formStatus === 'error' && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '1rem', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid #f44336'
            }}>
              Error sending message. Please try again or contact us directly.
            </div>
          )}
          </form>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 800, marginBottom: 24 }}>Ready to Book Your Stringing?</h2>
          <p style={{ fontSize: 'var(--font-size-body-large)', color: '#e0e7ff', marginBottom: 32, fontWeight: 500 }}>Get professional stringing service with quick turnaround times</p>
                      <Link href="/booking" style={{
              textDecoration: 'none',
              background: 'white', 
              color: '#6c63ff', 
              padding: '1.1rem 2.5rem', 
              borderRadius: 16, 
              fontWeight: 700, 
              fontSize: 'var(--font-size-button)', 
              boxShadow: '0 2px 12px rgba(102,126,234,0.10)', 
              textDecoration: 'none', 
              transition: 'background 0.18s, color 0.18s, transform 0.13s', 
              display: 'inline-block' 
            }}>
            Book Your Service Now
          </Link>
        </div>
      </section>
      </div>
  );
} 