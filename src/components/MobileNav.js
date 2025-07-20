"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cleanup effect to remove body class when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.5rem',
          color: '#666',
          width: '40px',
          height: '40px',
          borderRadius: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav" style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: 'calc(100vh - 80px)',
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          overflowY: 'auto',
          zIndex: 999
        }}>
          <Link href="/home" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Home</Link>
          <Link href="/booking" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Booking</Link>
          <Link href="/services" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Services</Link>
          <Link href="/strings" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Strings</Link>
          <Link href="/faq" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>FAQ</Link>
          <Link href="/locations" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Locations</Link>
          <Link href="/pickup-booking" style={{ 
            textDecoration: 'none', 
            color: '#666', 
            padding: '1.25rem',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '500',
            fontSize: '1.1rem',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Schedule Pickup</Link>
          <Link href="/adminlogin" style={{ 
            textDecoration: 'none', 
            color: '#bbb', 
            background: 'none', 
            padding: '1.25rem', 
            borderRadius: '6px', 
            fontWeight: '400', 
            fontSize: '1rem', 
            border: '1px solid #eee', 
            boxShadow: 'none', 
            transition: 'all 0.2s ease',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>Admin</Link>
        </div>
      )}
    </>
  );
} 