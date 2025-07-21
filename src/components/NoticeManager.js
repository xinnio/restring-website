"use client";

import React, { useState, useEffect } from 'react';

export default function NoticeManager() {
  const [notice, setNotice] = useState({
    message: '',
    isActive: false,
    discountType: 'percentage', // 'percentage', 'fixed', 'threshold'
    discountValue: 0,
    discountThreshold: 0, // For threshold-based discounts
    discountCode: '',
    expiresAt: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCurrentNotice();
  }, []);

  async function fetchCurrentNotice() {
    setLoading(true);
    try {
      const response = await fetch('/api/notices?active=true');
      if (response.ok) {
        const currentNotice = await response.json();
        if (currentNotice) {
          setNotice({
            message: currentNotice.message || '',
            isActive: currentNotice.isActive || false,
            discountType: currentNotice.discountType || 'percentage',
            discountValue: currentNotice.discountValue || 0,
            discountThreshold: currentNotice.discountThreshold || 0,
            discountCode: currentNotice.discountCode || '',
            expiresAt: currentNotice.expiresAt || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching notice:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveNotice() {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notice)
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('Notice saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${result.error || 'Failed to save notice'}`);
      }
    } catch (error) {
      console.error('Error saving notice:', error);
      setMessage('Error saving notice. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setNotice(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function calculateDiscountPreview() {
    const testTotal = 100; // Example total for preview
    let discountAmount = 0;
    let finalTotal = testTotal;

    switch (notice.discountType) {
      case 'percentage':
        discountAmount = (testTotal * notice.discountValue) / 100;
        finalTotal = testTotal - discountAmount;
        break;
      case 'fixed':
        discountAmount = Math.min(notice.discountValue, testTotal);
        finalTotal = testTotal - discountAmount;
        break;
      case 'threshold':
        if (testTotal >= notice.discountThreshold) {
          discountAmount = notice.discountValue;
          finalTotal = testTotal - discountAmount;
        }
        break;
    }

    return { discountAmount, finalTotal };
  }

  const { discountAmount, finalTotal } = calculateDiscountPreview();

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading notice settings...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '100vw', overflowX: 'auto', boxSizing: 'border-box' }}>
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          color: '#1a1a1a',
          marginBottom: '1.5rem'
        }}>
          📢 Notice & Banner Management
        </h2>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            backgroundColor: message.includes('Error') ? '#fee' : '#e8f5e8',
            color: message.includes('Error') ? '#c53030' : '#2e7d32',
            border: `1px solid ${message.includes('Error') ? '#feb2b2' : '#c8e6c9'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            Banner Message:
          </label>
          <textarea
            name="message"
            value={notice.message}
            onChange={handleChange}
            rows={3}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '1rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '0.875rem',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your banner message here..."
          />
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            color: '#1a1a1a',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              name="isActive"
              checked={notice.isActive}
              onChange={handleChange}
              style={{ transform: 'scale(1.2)' }}
            />
            Activate Banner
          </label>
        </div>

        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '1rem'
          }}>
            💰 Discount Settings
          </h3>

          <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '500px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              Discount Type:
            </label>
            <select
              name="discountType"
              value={notice.discountType}
              onChange={handleChange}
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Amount Discount ($)</option>
              <option value="threshold">Threshold-based Discount</option>
            </select>
          </div>

          {notice.discountType === 'percentage' && (
            <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '500px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                Discount Percentage (%):
              </label>
              <input
                type="number"
                name="discountValue"
                value={notice.discountValue}
                onChange={handleChange}
                min="0"
                max="100"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g., 10 for 10% off"
              />
            </div>
          )}

          {notice.discountType === 'fixed' && (
            <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '500px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                Fixed Discount Amount ($):
              </label>
              <input
                type="number"
                name="discountValue"
                value={notice.discountValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g., 5 for $5 off"
              />
            </div>
          )}

          {notice.discountType === 'threshold' && (
            <>
              <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '500px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  Minimum Order Total ($):
                </label>
                <input
                  type="number"
                  name="discountThreshold"
                  value={notice.discountThreshold}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., 50 for orders over $50"
                />
              </div>
              <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '500px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  Discount Amount ($):
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={notice.discountValue}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., 5 for $5 off"
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '500px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              Discount Code (Optional):
            </label>
            <input
              type="text"
              name="discountCode"
              value={notice.discountCode}
              onChange={handleChange}
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
              placeholder="e.g., SUMMER10, SAVE5"
            />
          </div>

          {/* Discount Preview */}
          {notice.discountValue > 0 && (
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #c8e6c9'
            }}>
              <h4 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2e7d32',
                marginBottom: '0.5rem'
              }}>
                💡 Discount Preview (on $100 order):
              </h4>
              <div style={{ fontSize: '0.875rem', color: '#2e7d32' }}>
                <div>Original Total: $100.00</div>
                <div>Discount: -${discountAmount.toFixed(2)}</div>
                <div style={{ fontWeight: '600' }}>Final Total: ${finalTotal.toFixed(2)}</div>
                {notice.discountType === 'threshold' && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    * Applies to orders of ${notice.discountThreshold} or more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            Expiration Date (Optional):
          </label>
          <input
            type="datetime-local"
            name="expiresAt"
            value={notice.expiresAt}
            onChange={handleChange}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={saveNotice}
            disabled={saving}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Notice'}
          </button>
          
          <button
            onClick={() => setNotice(prev => ({ ...prev, isActive: !prev.isActive }))}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: notice.isActive ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {notice.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
} 