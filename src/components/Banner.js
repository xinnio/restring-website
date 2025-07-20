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
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeeba',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '0 auto',
      maxWidth: '1200px',
      padding: '12px 16px',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Lightning Bolt Icon */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(255, 193, 7, 0.3))'
            }}
          >
            <path 
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
              fill="#ffc107" 
              stroke="#ff8c00" 
              strokeWidth="1"
            />
          </svg>
        </div>
        
        {/* Text Content */}
        <div style={{
          flex: 1,
          color: '#856404',
          fontSize: '14px',
          fontWeight: '500',
          lineHeight: '1.4'
        }}>
          <span style={{ fontWeight: '600' }}>
            {notice.message}
          </span>
          {discountText && (
            <span style={{ 
              marginLeft: '8px', 
              fontWeight: '700',
              color: '#664d03'
            }}>
              💰 {discountText}
              {notice.discountCode && (
                <span style={{ marginLeft: '4px' }}>
                  - Use code: <span style={{
                    background: '#856404',
                    color: '#fff3cd',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: '600'
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
            color: '#856404',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(133, 100, 4, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
} 