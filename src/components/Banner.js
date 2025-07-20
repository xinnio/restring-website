"use client";

import React, { useState, useEffect } from 'react';

export default function Banner() {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchActiveNotice();
  }, []);

  async function fetchActiveNotice() {
    try {
      const response = await fetch('/api/notices?active=true');
      if (response.ok) {
        const activeNotice = await response.json();
        if (activeNotice && activeNotice.isActive) {
          // Check if notice has expired
          if (activeNotice.expiresAt) {
            const expirationDate = new Date(activeNotice.expiresAt);
            const now = new Date();
            if (now > expirationDate) {
              return; // Notice has expired
            }
          }
          setNotice(activeNotice);
        }
      } else {
        console.log('No active notice or notices table not set up');
      }
    } catch (error) {
      console.log('Error fetching notice:', error.message);
      // Don't show error to user, just don't display banner
    } finally {
      setLoading(false);
    }
  }

  function formatDiscountText() {
    if (!notice || !notice.discountValue || notice.discountValue <= 0) {
      return null;
    }

    switch (notice.discountType) {
      case 'percentage':
        return `${notice.discountValue}% OFF`;
      case 'fixed':
        return `$${notice.discountValue} OFF`;
      case 'threshold':
        return `$${notice.discountValue} OFF orders over $${notice.discountThreshold}`;
      default:
        return `${notice.discountValue}% OFF`;
    }
  }

  if (loading || !notice || !isVisible) {
    return null;
  }

  const discountText = formatDiscountText();

  return (
    <div style={{
      background: 'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)',
      border: '2px solid #ffc107',
      borderRadius: '0 0 16px 16px',
      boxShadow: '0 4px 24px rgba(255,193,7,0.18)',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      top: 0,
      left: 'unset',
      right: 'unset',
      position: 'sticky',
      zIndex: 2000,
      padding: '20px 0',
      marginBottom: '24px',
      animation: 'banner-pop 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
      // Responsive padding for mobile
      boxSizing: 'border-box',
    }}>
      <style>{`
        @keyframes banner-pop {
          0% { transform: translateY(-40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 700px) {
          .banner-content {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 10px !important;
            padding: 0 8px !important;
          }
        }
      `}</style>
      <div className="banner-content" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Lightning Bolt Icon */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
        }}>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.4))'
            }}
          >
            <path 
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
              fill="#ffc107" 
              stroke="#ff8c00" 
              strokeWidth="1.5"
            />
          </svg>
        </div>
        {/* Text Content */}
        <div style={{
          flex: 1,
          color: '#7a4f01',
          fontSize: '1.25rem',
          fontWeight: '700',
          lineHeight: '1.5',
          letterSpacing: '0.01em',
          textShadow: '0 1px 2px #fffbe6',
          wordBreak: 'break-word',
        }}>
          <span style={{ fontWeight: '800', fontSize: '1.35rem', color: '#7a4f01' }}>
            {notice.message}
          </span>
          {discountText && (
            <span style={{ 
              marginLeft: '14px', 
              fontWeight: '800',
              color: '#b26a00',
              fontSize: '1.15rem',
              textShadow: '0 1px 2px #fffbe6',
            }}>
              💰 {discountText}
              {notice.discountCode && (
                <span style={{ marginLeft: '8px' }}>
                  - Use code: <span style={{
                    background: '#7a4f01',
                    color: '#ffe259',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    fontWeight: '800',
                    letterSpacing: '0.03em',
                  }}>
                    {notice.discountCode}
                  </span>
                </span>
              )}
            </span>
          )}
        </div>
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#7a4f01',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.target.style.backgroundColor = 'rgba(122, 79, 1, 0.12)'}
          onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
} 