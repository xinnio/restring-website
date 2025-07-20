import Link from 'next/link';

export default function Services() {
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
          <h1 style={{
            fontSize: '3.375rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Our Services
            <br />
            <span style={{ fontSize: '2.375rem', opacity: 0.9 }}>& Pricing</span>
          </h1>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '2.5rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Professional stringing services for tennis and badminton rackets. 
            Same-day service available. Professional quality guaranteed.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/booking" style={{
            textDecoration: 'none',
            backgroundColor: 'white',
            color: '#667eea',
              padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: '600',
              fontSize: '0.975rem',
            transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              Book Now
            </Link>
            <Link href="/strings" style={{
              textDecoration: 'none',
              backgroundColor: 'transparent',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.975rem',
              border: '2px solid white',
              transition: 'all 0.2s ease'
          }}>
              View Strings
          </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.375rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Service Options
          </h2>
          <p style={{ fontSize: '0.975rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Choose the service that best fits your schedule and budget
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
            }}>
            <div style={{ fontSize: '2.875rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.625rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>
              Same Day Service
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Need your racket strung urgently? We offer same-day service for those last-minute matches.
            </p>
            <div style={{ fontSize: '2.375rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
              $35
            </div>
            <ul style={{ color: '#666', fontSize: '0.875rem', margin: '1rem 0', padding: 0, listStyle: 'none', textAlign: 'left' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Book before 2:00 AM</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Same-day pick-up</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Priority processing</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Perfect for tournaments</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ fontSize: '2.875rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.625rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>
              Next Day Service
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Great balance of speed and quality. Perfect for regular players who need quick turnaround.
            </p>
            <div style={{ fontSize: '2.375rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
              $30
            </div>
            <ul style={{ color: '#666', fontSize: '0.875rem', margin: '1rem 0', padding: 0, listStyle: 'none', textAlign: 'left' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Book anytime</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Next-day pick-up</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Standard processing</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Most popular option</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
          }}>
            <div style={{ fontSize: '2.875rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ fontSize: '1.625rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1a1a' }}>
              3-5 Day Service
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Our most economical option. Perfect for casual players or when you have time to spare.
            </p>
            <div style={{ fontSize: '2.375rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
              $25
            </div>
            <ul style={{ color: '#666', fontSize: '0.875rem', margin: '1rem 0', padding: 0, listStyle: 'none', textAlign: 'left' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ Book anytime</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ 3-5 day pick-up</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Standard processing</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Best value</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.375rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
              Additional Services
            </h2>
            <p style={{ fontSize: '0.975rem', color: '#666' }}>
              Enhance your stringing service with these add-ons
            </p>
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
              <div style={{ fontSize: '2.375rem', marginBottom: '1rem' }}>🧵</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Own String
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Bring your own string and we&apos;ll string it for you
              </p>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#28a745', marginBottom: '1rem' }}>
                -$5 discount
              </div>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '2.375rem', marginBottom: '1rem' }}>🔧</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Grommet Replacement
              </h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                Protect your strings with new grommets
              </p>
              <p style={{ color: '#28a745', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
                4 grommets FREE per racket
              </p>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#667eea', marginBottom: '1rem' }}>
                $0.25 each additional
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Racket Types */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.375rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Racket Types We Service
          </h2>
          <p style={{ fontSize: '0.975rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Professional stringing for all major racket types
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
            }}>
            <span style={{ fontSize: '1.875rem' }}>🏸</span>
            <h3 style={{ fontSize: '1.375rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
              Badminton Rackets
              </h3>
            <p style={{ color: '#666', fontSize: '0.825rem', marginTop: '0.5rem' }}>
              All major brands and models
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.2s ease'
            }}>
            <span style={{ fontSize: '1.875rem' }}>🎾</span>
            <h3 style={{ fontSize: '1.375rem', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
              Tennis Rackets
              </h3>
            <p style={{ color: '#666', fontSize: '0.825rem', marginTop: '0.5rem' }}>
              All major brands and models
            </p>
          </div>
        </div>
      </section>

      {/* Quality Guarantee */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.375rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
              Quality Guarantee
            </h2>
            <p style={{ fontSize: '0.975rem', color: '#666' }}>
              We stand behind our work with a quality guarantee
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
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
                Professional Inspection
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Every racket is carefully inspected before and after stringing to ensure quality.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
                Important Notes
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                We cannot guarantee against breakage due to regular wear, mishandling, or pre-existing damage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.375rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Ready to Book Your Service?
          </h2>
          <p style={{ fontSize: '0.975rem', marginBottom: '2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Choose your service and get professional stringing with quick turnaround times
          </p>
            <Link href="/booking" style={{
              textDecoration: 'none',
              backgroundColor: '#667eea',
              color: 'white',
            padding: '1rem 2.5rem',
              borderRadius: '8px',
              fontWeight: '600',
            fontSize: '0.975rem',
              transition: 'all 0.2s ease',
              display: 'inline-block'
            }}>
            Book Your Service Now
            </Link>
        </div>
      </section>
    </div>
  );
} 