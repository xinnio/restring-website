import Link from 'next/link';

export default function Services() {
  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
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
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Stringing Services
            <br />
            <span style={{ fontSize: '2.5rem', opacity: 0.9 }}>& Pricing</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Professional racket stringing services with flexible turnaround times. 
            Quality strings included with every service.
          </p>
          <Link href="/booking" style={{
            textDecoration: 'none',
            backgroundColor: 'white',
            color: '#667eea',
            padding: '1rem 2.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'inline-block'
          }}>
            🎾 Book Your Service
          </Link>
        </div>
      </section>

      {/* Service Tiers */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#1a1a1a', 
            marginBottom: '1rem' 
          }}>
            Service Tiers
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Choose the turnaround time that works best for your schedule
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {/* Same Day Service */}
          <div style={{
            backgroundColor: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #667eea',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '0 16px 0 16px'
            }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>
              Same Day Service
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
              $35
            </div>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Perfect for urgent matches and last-minute tournaments. 
              Subject to availability - book early!
            </p>
            <ul style={{ 
              textAlign: 'left', 
              color: '#666', 
              lineHeight: '1.8',
              marginBottom: '2rem',
              paddingLeft: '1.5rem'
            }}>
              <li>Professional stringing included</li>
              <li>Quality strings from our inventory</li>
              <li>Same day pickup available</li>
              <li>Priority service</li>
            </ul>
            <Link href="/booking" style={{
              textDecoration: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              Book Same Day
            </Link>
          </div>

          {/* Next Day Service */}
          <div style={{
            backgroundColor: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>
              Next Day Service
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
              $30
            </div>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Quick turnaround for most players. 
              Great balance of speed and convenience.
            </p>
            <ul style={{ 
              textAlign: 'left', 
              color: '#666', 
              lineHeight: '1.8',
              marginBottom: '2rem',
              paddingLeft: '1.5rem'
            }}>
              <li>Professional stringing included</li>
              <li>Quality strings from our inventory</li>
              <li>Next day pickup</li>
              <li>Reliable service</li>
            </ul>
            <Link href="/booking" style={{
              textDecoration: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              Book Next Day
            </Link>
          </div>

          {/* Standard Service */}
          <div style={{
            backgroundColor: 'white',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>
              3-5 Day Service
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
              $25
            </div>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Standard service for regular players. 
              Most economical option with quality results.
            </p>
            <ul style={{ 
              textAlign: 'left', 
              color: '#666', 
              lineHeight: '1.8',
              marginBottom: '2rem',
              paddingLeft: '1.5rem'
            }}>
              <li>Professional stringing included</li>
              <li>Quality strings from our inventory</li>
              <li>3-5 day turnaround</li>
              <li>Best value</li>
            </ul>
            <Link href="/booking" style={{
              textDecoration: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              display: 'inline-block',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              Book Standard
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
              Additional Services
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Customize your stringing service with these optional upgrades
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #e9ecef',
              textAlign: 'center',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧵</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Own String Service
              </h3>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
                +$3.00
              </div>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Bring your own string and we&apos;ll string it for you. 
                Perfect if you have a specific string preference.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #e9ecef',
              textAlign: 'center',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔧</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Grommet Replacement
              </h3>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
                +$0.25 each
              </div>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Replace worn grommets to protect your strings. 
                We&apos;ll inspect and recommend if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tension Guides */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Tension Guides
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Find the right tension for your playing style and skill level
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem'
        }}>
          {/* Badminton Tension Guide */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '2rem' }}>🏸</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                Badminton Tension Guide
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.95rem'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #e9ecef',
                      fontWeight: '600',
                      color: '#495057'
                    }}>Tension (lbs)</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #e9ecef',
                      fontWeight: '600',
                      color: '#495057'
                    }}>Recommended For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>16–20</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Recreational players</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>19–23</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Beginner players</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>22–26</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Intermediate players</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>25–29</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Advanced players</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>27–35</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Professional players</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tennis Tension Guide */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '2rem' }}>🎾</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                Tennis Tension Guide
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.95rem'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #e9ecef',
                      fontWeight: '600',
                      color: '#495057'
                    }}>Tension (lbs)</th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #e9ecef',
                      fontWeight: '600',
                      color: '#495057'
                    }}>Recommended For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>40–50</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Beginner players</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>50–60</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Intermediate players</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>55–65</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Advanced players</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>60–70</td>
                    <td style={{ padding: '1rem', color: '#666' }}>Professional players</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
              Important Information
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              Please read our service terms and conditions
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
                Racket Inspection
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                We inspect all rackets for damage before stringing, but this inspection does not guarantee the condition. 
                We cannot be responsible for pre-existing damage.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
                No Warranty
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                No warranty on string or service. Strings can break due to normal wear, improper use, 
                or manufacturing defects. Service fees are non-refundable.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
                Service Terms
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                All service fees are non-refundable and non-transferable. 
                We reserve the right to refuse service for damaged or unsafe rackets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Ready to Book Your Service?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Choose your preferred service tier and book your professional stringing today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/booking" style={{
              textDecoration: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}>
              🎾 Book Now
            </Link>
            <Link href="/strings" style={{
              textDecoration: 'none',
              backgroundColor: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1.1rem',
              border: '2px solid white',
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}>
              🧵 View Strings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 