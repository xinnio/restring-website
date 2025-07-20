import Link from 'next/link';

export default function Home() {
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
          background: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.25rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Professional Racket Stringing
            <br />
            <span style={{ fontSize: '2.25rem', opacity: 0.9 }}>in Markham</span>
          </h1>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '2.5rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Expert stringing services for tennis and badminton rackets. 
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

      {/* Services Preview */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
              Our Services
            </h2>
            <p style={{ fontSize: '0.975rem', color: '#666' }}>
              Professional stringing for all your racket needs
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
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🎾</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Tennis Rackets
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Professional stringing for all tennis racket types
              </p>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#667eea' }}>From $25</div>
            </div>
            
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🏸</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Badminton Rackets
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Expert stringing for badminton rackets
              </p>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#667eea' }}>From $25</div>
            </div>
            
            <div style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🔧</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Grommet Replacement
              </h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                Protect your strings with new grommets
              </p>
              <p style={{ color: '#28a745', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1rem' }}>
                4 grommets FREE per racket
              </p>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#667eea' }}>$0.25 each additional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '1rem' }}>
            Why Choose Us?
          </h2>
          <p style={{ fontSize: '0.975rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Professional stringing services with years of experience and commitment to quality
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
            <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.325rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
              Same Day Service
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Need your racket strung urgently? We offer same-day service for those last-minute matches.
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
            <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.325rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
              Professional Quality
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Years of experience with both tennis and badminton rackets. Quality guaranteed.
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
            <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>📍</div>
            <h3 style={{ fontSize: '1.325rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
              Convenient Locations
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Multiple pickup/drop-off locations across Markham. Door-to-door service available.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ 
        backgroundColor: 'white', 
        padding: '4rem 2rem',
        borderTop: '1px solid #eee'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25em', fontWeight: 700, color: '#1a1a1', marginBottom: '1rem' }}>
            Contact Us
          </h2>
          <p style={{ fontSize: '0.975rem', color: '#666', marginBottom: '2rem' }}>
            Get in touch for any questions about our stringing services
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>📧</div>
              <h3 style={{ fontSize: '1.075em', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Email
              </h3>
              <p style={{ color: '#667ea', fontWeight: '500' }}>
                markhamrestring@gmail.com
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ fontSize: '1.075em', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Phone
              </h3>
              <p style={{ color: '#667ea', fontWeight: '500' }}>
                (647) 655-3658
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>🏠</div>
              <h3 style={{ fontSize: '1.075em', fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                Location
              </h3>
              <p style={{ color: '#667ea', fontWeight: '500' }}>
                Markham, ON
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
          <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '0.975rem', marginBottom: '2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Book your stringing service today and experience the difference professional stringing makes.
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
