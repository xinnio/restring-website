'use client';

import { useState } from 'react';

export default function Locations() {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const pickupLocations = [
    {
      name: 'Wiser Park Tennis Courts',
      address: '123 Wiser Drive, Markham, ON',
      hours: 'Daily 6:00 AM - 10:00 PM',
      icon: '🎾',
      distance: '5 min drive'
    },
    {
      name: 'Angus Glen Community Centre',
      address: '3990 Major Mackenzie Dr E, Markham, ON',
      hours: 'Mon-Fri 6:00 AM - 11:00 PM, Sat-Sun 7:00 AM - 10:00 PM',
      icon: '🏢',
      distance: '8 min drive'
    },
    {
      name: 'Door-to-Door Pickup',
      address: 'Markham & Surrounding Areas',
      hours: 'By appointment only',
      icon: '🚗',
      distance: 'Free for orders $50+'
    }
  ];

  const businessHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM', status: 'open' },
    { day: 'Sunday', hours: 'Closed', status: 'closed' }
  ];

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '3.5rem 0 2.5rem 0', position: 'relative', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, boxShadow: '0 8px 32px rgba(102,126,234,0.10)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>Find Us & Get in Touch</h1>
          <p style={{ fontSize: '1.25rem', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Convenient locations across Markham for all your racket stringing needs</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('contact')}
              style={{
                padding: '0.9rem 2.2rem',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '1.08rem',
                border: 'none',
                background: activeTab === 'contact' ? 'white' : 'rgba(255,255,255,0.18)',
                color: activeTab === 'contact' ? '#6c63ff' : 'white',
                boxShadow: activeTab === 'contact' ? '0 2px 8px rgba(102,126,234,0.13)' : 'none',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
            >📞 Contact Info</button>
            <button
              onClick={() => setActiveTab('locations')}
              style={{
                padding: '0.9rem 2.2rem',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '1.08rem',
                border: 'none',
                background: activeTab === 'locations' ? 'white' : 'rgba(255,255,255,0.18)',
                color: activeTab === 'locations' ? '#6c63ff' : 'white',
                boxShadow: activeTab === 'locations' ? '0 2px 8px rgba(102,126,234,0.13)' : 'none',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
            >📍 Pick-up Locations</button>
            <button
              onClick={() => setActiveTab('hours')}
              style={{
                padding: '0.9rem 2.2rem',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '1.08rem',
                border: 'none',
                background: activeTab === 'hours' ? 'white' : 'rgba(255,255,255,0.18)',
                color: activeTab === 'hours' ? '#6c63ff' : 'white',
                boxShadow: activeTab === 'hours' ? '0 2px 8px rgba(102,126,234,0.13)' : 'none',
                transition: 'all 0.18s',
                cursor: 'pointer',
              }}
            >🕒 Business Hours</button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '3.5rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48 }}>
          {/* Left Column - Map & Studio Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef', padding: '2.2rem 1.5rem', marginBottom: 0 }}>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '2rem' }}>🗺️</span> Our Location
              </h2>
              {/* Interactive Map Placeholder */}
              <div style={{ background: 'linear-gradient(135deg, #e0e7ff 60%, #f8fafc 100%)', borderRadius: 18, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '2px dashed #a5b4fc' }}>
                <div style={{ textAlign: 'center', color: '#666' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗺️</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>Interactive Map</div>
                  <div style={{ fontSize: '1rem', color: '#888' }}>Google Maps integration coming soon</div>
                  <div style={{ marginTop: 10, display: 'inline-block', padding: '0.3rem 1.1rem', background: '#6c63ff', color: 'white', borderRadius: 999, fontWeight: 600, fontSize: '0.95rem', marginLeft: 4 }}>Coming Soon</div>
                </div>
              </div>
              {/* Studio Address Card */}
              <div style={{ background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%)', borderRadius: 16, padding: '1.5rem', border: '1.5px solid #a5b4fc', marginBottom: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#4f46e5', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: '1.3rem' }}>🏢</span> Studio Address</div>
                <div style={{ fontSize: '1.08rem', color: '#1a1a1a', fontWeight: 600, marginBottom: 2 }}>Markham Restring Studio</div>
                <div style={{ fontSize: '1rem', color: '#333', marginBottom: 2 }}>123 Example Street<br />Markham, ON L3R 1A1</div>
                <div style={{ fontSize: '0.95rem', color: '#888', fontStyle: 'italic', marginBottom: 8 }}>(Replace with real address)</div>
                <div style={{ display: 'flex', alignItems: 'center', color: '#6c63ff', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>📍</span> Get Directions
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Contact Information */}
            {activeTab === 'contact' && (
              <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef', padding: '2.2rem 1.5rem' }}>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2rem' }}>📞</span> Contact Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #e0e7ff 60%, #f8fafc 100%)', borderRadius: 14, border: '1.5px solid #a5b4fc', padding: '1.1rem 1.2rem', gap: 18 }}>
                    <div style={{ fontSize: '2rem', color: '#6c63ff' }}>📧</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#1a1a1a', marginBottom: 2 }}>Email</div>
                      <div style={{ fontSize: '1.05rem', color: '#6c63ff', fontWeight: 600 }}>markhamrestring@gmail.com</div>
                      <div style={{ fontSize: '0.92rem', color: '#888' }}>We&apos;ll respond within 24 hours</div>
                    </div>
                  </div>
                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #d1fae5 60%, #f8fafc 100%)', borderRadius: 14, border: '1.5px solid #6ee7b7', padding: '1.1rem 1.2rem', gap: 18 }}>
                    <div style={{ fontSize: '2rem', color: '#059669' }}>📱</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#1a1a1a', marginBottom: 2 }}>Phone</div>
                      <div style={{ fontSize: '1.05rem', color: '#059669', fontWeight: 600 }}>(123) 456-7890</div>
                      <div style={{ fontSize: '0.92rem', color: '#888' }}>Call during business hours</div>
                    </div>
                  </div>
                  {/* WhatsApp */}
                  <div style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #ede9fe 60%, #f8fafc 100%)', borderRadius: 14, border: '1.5px solid #a78bfa', padding: '1.1rem 1.2rem', gap: 18 }}>
                    <div style={{ fontSize: '2rem', color: '#a78bfa' }}>💬</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#1a1a1a', marginBottom: 2 }}>WhatsApp</div>
                      <div style={{ fontSize: '1.05rem', color: '#a78bfa', fontWeight: 600 }}>+1 (123) 456-7890</div>
                      <div style={{ fontSize: '0.92rem', color: '#888' }}>Quick responses, any time</div>
                    </div>
                  </div>
                  {/* Text Message */}
                  <div style={{ display: 'flex', alignItems: 'center', background: 'linear-gradient(90deg, #fef3c7 60%, #f8fafc 100%)', borderRadius: 14, border: '1.5px solid #fde68a', padding: '1.1rem 1.2rem', gap: 18 }}>
                    <div style={{ fontSize: '2rem', color: '#f59e42' }}>📱</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#1a1a1a', marginBottom: 2 }}>Text Message</div>
                      <div style={{ fontSize: '1.05rem', color: '#f59e42', fontWeight: 600 }}>+1 (123) 456-7890</div>
                      <div style={{ fontSize: '0.92rem', color: '#888' }}>SMS for quick questions</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Locations */}
            {activeTab === 'locations' && (
              <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef', padding: '2.2rem 1.5rem' }}>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2rem' }}>📍</span> Pick-up & Drop-off Locations
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {pickupLocations.map((location, index) => (
                    <div key={index} style={{ border: '2px solid #e0e7ff', borderRadius: 16, padding: '1.2rem 1.3rem', background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%)', boxShadow: '0 2px 12px rgba(102,126,234,0.06)', transition: 'box-shadow 0.18s, border 0.18s', display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                      <div style={{ fontSize: '2.2rem', marginRight: 12 }}>{location.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#1a1a1a', marginBottom: 2 }}>{location.name}</div>
                        <div style={{ fontSize: '1.01rem', color: '#333', marginBottom: 2 }}>{location.address}</div>
                        <div style={{ fontSize: '0.98rem', color: '#888', marginBottom: 2 }}>Hours: {location.hours}</div>
                        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.22rem 0.8rem', borderRadius: 999, fontWeight: 600, fontSize: '0.93rem', letterSpacing: '0.01em', display: 'inline-block', marginTop: 2 }}>{location.distance}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ padding: '1.1rem 1.2rem', background: 'linear-gradient(90deg, #fef9c3 60%, #f8fafc 100%)', borderRadius: 14, border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.3rem', color: '#f59e42' }}>⚠️</span>
                    <div style={{ fontSize: '1.01rem', color: '#b45309', fontWeight: 600 }}><strong>Note:</strong> Door-to-door pick-up available for orders over $50 or by special arrangement.</div>
                  </div>
                  <div style={{ padding: '1.1rem 1.2rem', background: 'linear-gradient(90deg, #e0e7ff 60%, #f8fafc 100%)', borderRadius: 14, border: '1.5px solid #a5b4fc', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.3rem', color: '#6c63ff' }}>⚡</span>
                    <div style={{ fontSize: '1.01rem', color: '#4f46e5', fontWeight: 600 }}>Same-day pick-up available at select locations. Book early to secure your spot!</div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Hours */}
            {activeTab === 'hours' && (
              <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1.5px solid #e9ecef', padding: '2.2rem 1.5rem' }}>
                <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2rem' }}>🕒</span> Business Hours
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {businessHours.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%)', borderRadius: 12, border: '1.5px solid #e0e7ff', padding: '0.8rem 1.2rem', fontWeight: 600, fontSize: '1.05rem', color: item.status === 'closed' ? '#b91c1c' : '#1a1a1a' }}>
                      <span>{item.day}</span>
                      <span style={{ color: item.status === 'closed' ? '#b91c1c' : '#4f46e5', fontWeight: 700 }}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <div style={{ marginTop: 80, background: 'white', borderRadius: 28, boxShadow: '0 8px 32px rgba(102,126,234,0.13)', padding: '3rem 1.5rem', border: '1.5px solid #e9ecef', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24 }}>Get in Touch</h2>
            <p style={{ fontSize: '1.18rem', color: '#666', marginBottom: 24, lineHeight: 1.6 }}>Have questions about our services or need a custom quote? Send us a message!</p>
            <div style={{ display: 'inline-block', background: 'linear-gradient(90deg, #fef9c3 60%, #f8fafc 100%)', border: '1.5px solid #fde68a', borderRadius: 16, padding: '1.1rem 1.2rem' }}>
              <p style={{ fontSize: '1.01rem', color: '#b45309', fontWeight: 600 }}>
                ⚡ <strong>Same-Day Service:</strong> Book before 2:00 AM for same-day pick-up
              </p>
            </div>
          </div>
          <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 700, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '1.1rem 1.2rem', border: '1.5px solid #e0e7ff', borderRadius: 14, fontSize: '1.05rem', fontWeight: 500, color: '#1a1a1a', outline: 'none', transition: 'border 0.18s' }}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  style={{ width: '100%', padding: '1.1rem 1.2rem', border: '1.5px solid #e0e7ff', borderRadius: 14, fontSize: '1.05rem', fontWeight: 500, color: '#1a1a1a', outline: 'none', transition: 'border 0.18s' }}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '1.1rem 1.2rem', border: '1.5px solid #e0e7ff', borderRadius: 14, fontSize: '1.05rem', fontWeight: 500, color: '#1a1a1a', outline: 'none', transition: 'border 0.18s' }}
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Service Type</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '1.1rem 1.2rem', border: '1.5px solid #e0e7ff', borderRadius: 14, fontSize: '1.05rem', fontWeight: 500, color: '#1a1a1a', outline: 'none', transition: 'border 0.18s' }}
                >
                  <option value="">Select Service</option>
                  <option value="tennis">Tennis Racket Stringing</option>
                  <option value="badminton">Badminton Racket Stringing</option>
                  <option value="squash">Squash Racket Stringing</option>
                  <option value="custom">Custom Stringing</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <label style={{ display: 'block', fontSize: '1.08rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={6}
                required
                style={{ width: '100%', padding: '1.1rem 1.2rem', border: '1.5px solid #e0e7ff', borderRadius: 14, fontSize: '1.05rem', fontWeight: 500, color: '#1a1a1a', outline: 'none', transition: 'border 0.18s', resize: 'none' }}
                placeholder="Tell us about your stringing needs, questions, or special requests..."
              ></textarea>
            </div>
            <div style={{ gridColumn: '1 / span 2', textAlign: 'center' }}>
              <button
                type="submit"
                style={{ background: 'linear-gradient(90deg, #667eea 60%, #764ba2 100%)', color: 'white', padding: '1.1rem 2.5rem', borderRadius: 16, fontWeight: 700, fontSize: '1.18rem', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', border: 'none', cursor: 'pointer', transition: 'background 0.18s, color 0.18s, transform 0.13s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #764ba2 60%, #667eea 100%)'; e.currentTarget.style.transform = 'scale(1.045)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #667eea 60%, #764ba2 100%)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Call to Action */}
      <div style={{ marginTop: 80, textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', borderRadius: 28, padding: '3rem 1.5rem', color: 'white', boxShadow: '0 8px 32px rgba(102,126,234,0.13)', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>Ready to Book Your Stringing?</h2>
          <p style={{ fontSize: '1.18rem', color: '#e0e7ff', marginBottom: 32, fontWeight: 500 }}>Get professional stringing service with quick turnaround times</p>
          <a href="/booking"
            style={{ background: 'white', color: '#6c63ff', padding: '1.1rem 2.5rem', borderRadius: 16, fontWeight: 700, fontSize: '1.18rem', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', textDecoration: 'none', transition: 'background 0.18s, color 0.18s, transform 0.13s', display: 'inline-block' }}
            onMouseOver={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.045)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6c63ff'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Book Now
          </a>
        </div>
      </div>
    </main>
  );
} 