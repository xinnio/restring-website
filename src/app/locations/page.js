'use client';

import Link from 'next/link';

export default function Locations() {
  const businessHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM', status: 'open' },
    { day: 'Sunday', hours: 'Closed', status: 'closed' }
  ];

  const pickupLocations = [
    {
      name: 'Wiser Park Tennis Courts',
      address: '123 Wiser Park Drive, Markham, ON L3R 1A1',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      distance: '5 min from Markham Centre',
      icon: '🎾'
    },
    {
      name: 'Angus Glen Community Centre',
      address: '3990 Major Mackenzie Dr E, Markham, ON L6C 1P8',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      distance: '8 min from Markham Centre',
      icon: '🏢'
    },
    {
      name: 'Door-to-Door Pickup',
      address: 'Available for orders over $50 or by special arrangement',
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
          <h1 style={{ fontSize: '2.675rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>Find Us & Get in Touch</h1>
          <p style={{ fontSize: '1.125rem', color: '#e0e7ff', marginBottom: '2.2rem', fontWeight: 500 }}>Convenient locations across Markham for all your racket stringing needs</p>
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
          <h2 style={{ fontSize: '1.575rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.875rem' }}>🗺️</span> Our Location
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
            <div style={{ fontWeight: 700, fontSize: '0.955rem', color: '#4f46e5', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: '1.175rem' }}>🏢</span> Studio Address</div>
            <div style={{ fontSize: '0.955rem', color: '#1a1a1a', fontWeight: 600, marginBottom: 2 }}>Markham Restring Studio</div>
            <div style={{ fontSize: '0.875rem', color: '#333', marginBottom: 2 }}>123 Example Street<br />Markham, ON L3R 1A1</div>
            <div style={{ fontSize: '0.825rem', color: '#888', fontStyle: 'italic', marginBottom: 8 }}>(Replace with real address)</div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#6c63ff', fontWeight: 700, fontSize: '0.925rem', cursor: 'pointer', gap: 8 }}>
              <span style={{ fontSize: '1.075rem' }}>📍</span> Get Directions
            </div>
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
                <div style={{ fontSize: '0.925rem', color: '#059669', fontWeight: 600 }}>(123) 456-7890</div>
                <div style={{ fontSize: '0.795rem', color: '#888' }}>Call during business hours</div>
              </div>
            </div>
            
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.875rem', color: '#a78bfa' }}>💬</div>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.955rem', color: '#1a1a1a', marginBottom: 2 }}>WhatsApp</div>
                <div style={{ fontSize: '0.925rem', color: '#a78bfa', fontWeight: 600 }}>+1 (123) 456-7890</div>
                <div style={{ fontSize: '0.795rem', color: '#888' }}>Quick responses, any time</div>
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
                <div style={{ fontSize: '0.925rem', color: '#f59e42', fontWeight: 600 }}>+1 (123) 456-7890</div>
                <div style={{ fontSize: '0.795rem', color: '#888' }}>SMS for quick questions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pickup & Drop-off Locations */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.575rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.875rem' }}>📍</span> Pick-up & Drop-off Locations
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
            <div style={{ fontSize: '0.885rem', color: '#b45309', fontWeight: 600 }}><strong>Note:</strong> Door-to-door pick-up available for orders over $50 or by special arrangement.</div>
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

      {/* Business Hours */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.575rem', fontWeight: 800, color: '#1a1a1a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.875rem' }}>🕒</span> Business Hours
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {businessHours.map((item, index) => (
              <div key={index} style={{
                padding: '0.8rem 1.2rem',
                borderRadius: '8px',
                backgroundColor: item.status === 'closed' ? '#fee2e2' : '#f0f9ff',
                border: `1px solid ${item.status === 'closed' ? '#fecaca' : '#bae6fd'}`,
                textAlign: 'center'
              }}>
                <div style={{ fontWeight: 600, fontSize: '0.925rem', color: item.status === 'closed' ? '#b91c1c' : '#1a1a1a' }}>
                  {item.day}
                </div>
                <div style={{ fontSize: '0.875rem', color: item.status === 'closed' ? '#dc2626' : '#0369a1' }}>
                  {item.hours}
                </div>
              </div>
            ))}
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
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.955rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Name</label>
            <input
              type="text"
              style={{ 
                width: '100%', 
                padding: '1.1rem 1.2rem', 
                border: '1.5px solid #e0e7ff', 
                borderRadius: 14, 
                fontSize: '0.925rem', 
                fontWeight: 500, 
                color: '#1a1a1a', 
                outline: 'none', 
                transition: 'border 0.18s' 
              }}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.955rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Email</label>
            <input
              type="email"
              style={{ 
                width: '100%', 
                padding: '1.1rem 1.2rem', 
                border: '1.5px solid #e0e7ff', 
                borderRadius: 14, 
                fontSize: '0.925rem', 
                fontWeight: 500, 
                color: '#1a1a1a', 
                outline: 'none', 
                transition: 'border 0.18s' 
              }}
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.955rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Phone</label>
            <input
              type="tel"
              style={{ 
                width: '100%', 
                padding: '1.1rem 1.2rem', 
                border: '1.5px solid #e0e7ff', 
                borderRadius: 14, 
                fontSize: '0.925rem', 
                fontWeight: 500, 
                color: '#1a1a1a', 
                outline: 'none', 
                transition: 'border 0.18s' 
              }}
              placeholder="(123) 456-7890"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.955rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Service Type</label>
            <select
              style={{ 
                width: '100%', 
                padding: '1.1rem 1.2rem', 
                border: '1.5px solid #e0e7ff', 
                borderRadius: 14, 
                fontSize: '0.925rem', 
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
            <label style={{ display: 'block', fontSize: '0.955rem', fontWeight: 700, color: '#333', marginBottom: 8 }}>Your Message</label>
            <textarea
              rows="4"
              style={{ 
                width: '100%', 
                padding: '1.1rem 1.2rem', 
                border: '1.5px solid #e0e7ff', 
                borderRadius: 14, 
                fontSize: '0.925rem', 
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
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '1.2rem 2rem', 
              borderRadius: 16, 
              fontWeight: 700, 
              fontSize: '1.055rem', 
              boxShadow: '0 2px 12px rgba(102,126,234,0.10)', 
              border: 'none', 
              cursor: 'pointer', 
              transition: 'background 0.18s, color 0.18s, transform 0.13s' 
            }}
          >
            Send Message
          </button>
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
          <h2 style={{ fontSize: '2.375rem', fontWeight: 800, marginBottom: 24 }}>Ready to Book Your Stringing?</h2>
          <p style={{ fontSize: '1.055rem', color: '#e0e7ff', marginBottom: 32, fontWeight: 500 }}>Get professional stringing service with quick turnaround times</p>
          <Link href="/booking" style={{
            textDecoration: 'none',
            background: 'white', 
            color: '#6c63ff', 
            padding: '1.1rem 2.5rem', 
            borderRadius: 16, 
            fontWeight: 700, 
            fontSize: '1.055rem', 
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