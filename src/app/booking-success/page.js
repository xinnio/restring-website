"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const customerEmail = searchParams.get('email');
  const bookingNumber = searchParams.get('bookingNumber');

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
          fontSize: 'var(--font-size-h1)',
          fontWeight: '700'
        }}>
          Booking Submitted Successfully!
        </h1>
        
        <div style={{
          background: '#e8f5e8',
          padding: '1.5rem',
          borderRadius: '12px',
          margin: '1.5rem 0',
          borderLeft: '4px solid #28a745',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '1rem', fontSize: 'var(--font-size-h3)' }}>
            📧 Confirmation email sent to:
          </h3>
          <p style={{ margin: 0, fontSize: 'var(--font-size-body)' }}>
            <strong>{customerEmail}</strong>
          </p>
          {bookingNumber && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: 'var(--font-size-body)', color: '#2e7d32' }}>
              <strong>Booking Number: #{bookingNumber}</strong>
            </p>
          )}
        </div>
        
        <div style={{
          background: '#f0f9ff',
          padding: '1.5rem',
          borderRadius: '12px',
          margin: '1.5rem 0',
          borderLeft: '4px solid #0ea5e9',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#0c4a6e', marginBottom: '1rem', fontSize: 'var(--font-size-h3)' }}>
            📞 Next Steps:
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: 'var(--font-size-body)' }}>
            <li style={{ marginBottom: '0.5rem' }}>We&apos;ll review your booking within 24 hours</li>
            <li style={{ marginBottom: '0.5rem' }}>You&apos;ll receive a call or email to confirm details</li>
            <li>We&apos;ll arrange pickup/drop-off times and locations</li>
          </ul>
        </div>
        
        <p style={{
          fontSize: 'var(--font-size-body-large)',
          color: '#666',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Thank you for choosing Markham Restring Studio! We&apos;re excited to provide you with professional stringing service.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/home" style={{
            textDecoration: 'none',
            background: '#667eea',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: 'var(--font-size-button)',
            transition: 'all 0.2s ease'
          }}>
            🏠 Return to Home
          </Link>
          
          <Link href="/booking" style={{
            textDecoration: 'none',
            background: 'transparent',
            color: '#667eea',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: 'var(--font-size-button)',
            border: '2px solid #667eea',
            transition: 'all 0.2s ease'
          }}>
            📝 New Booking
          </Link>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: 'var(--font-size-small)',
          color: '#666'
        }}>
          <strong>Need help?</strong> Contact us at (647) 655-3658 or markhamrestring@gmail.com
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <Suspense fallback={
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
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
          <h1 style={{ color: '#667eea', marginBottom: '1rem' }}>Loading...</h1>
          <p>Please wait while we load your booking confirmation.</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
} 