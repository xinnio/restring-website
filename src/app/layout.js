import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

export const metadata = {
  title: 'Markham Restring Studio',
  description: 'Professional racket stringing in Markham',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
        backgroundColor: '#fafafa',
        color: '#1a1a1a',
        lineHeight: 1.6
      }}>
        <nav style={{ 
          padding: '1rem 2rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Link href="/home" style={{ 
              textDecoration: 'none', 
              color: '#1a1a1a', 
              fontSize: 'var(--font-size-h2)', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Image src="/logo.png" alt="Markham Restring Studio Logo" width={80} height={80} style={{ maxHeight: '80px', marginRight: '0.75rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} />
              <span style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700
              }}>
                Markham Restring Studio
              </span>
            </Link>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link href="/home" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>Home</Link>
              <Link href="/booking" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>Booking</Link>
              <Link href="/services" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>Services</Link>
              <Link href="/strings" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>Strings</Link>
              <Link href="/faq" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>FAQ</Link>
              <Link href="/locations" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>Locations</Link>
              <Link href="/pickup-booking" style={{ 
                textDecoration: 'none', 
                color: '#666', 
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-nav)'
              }}>Schedule Pickup</Link>
              <Link href="/adminlogin" style={{ 
                textDecoration: 'none', 
                color: '#bbb', 
                background: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px', 
                fontWeight: '400', 
                fontSize: 'var(--font-size-small)', 
                border: '1px solid #eee', 
                boxShadow: 'none', 
                transition: 'all 0.2s ease' 
              }}>Admin</Link>
            </div>
          </div>
        </nav>
        
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          {children}
        </main>
        
        <footer style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white', 
          padding: '3rem 2rem 2rem', 
          marginTop: 'auto'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-h3)' }}>🏸 Markham Restring Studio</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                Professional racket stringing services for tennis and badminton players in Markham and surrounding areas.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-body-large)' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link href="/booking" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Book Service</Link>
                <Link href="/strings" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>String Options</Link>
                <Link href="/faq" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>FAQ</Link>
                <Link href="/locations" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Locations</Link>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem', fontSize: 'var(--font-size-body-large)' }}>Contact</h4>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>📍 Markham, ON</p>
              <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>📧 markhamrestring@gmail.com</p>
              <p style={{ color: '#ccc' }}>📱 (647) 655-3658</p>
            </div>
          </div>
          <div style={{ 
            borderTop: '1px solid #444', 
            paddingTop: '2rem', 
            textAlign: 'center',
            color: '#999'
          }}>
            <p>© 2024 Markham Restring Studio. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
