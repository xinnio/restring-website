"use client";

import React, { useState, useEffect } from 'react';

export default function Strings() {
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, tennis, badminton
  const [selectedName, setSelectedName] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    async function fetchStrings() {
      try {
        const res = await fetch('/api/strings');
        const data = await res.json();
        setStrings(data);
      } catch (error) {
        console.error('Error fetching strings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStrings();
  }, []);

  // Group strings by name
  const filteredStrings = strings.filter(string => {
    if (filter === 'all') return true;
    return string.type === filter;
  });
  const grouped = filteredStrings.reduce((acc, s) => {
    if (!acc[s.name]) acc[s.name] = [];
    acc[s.name].push(s);
    return acc;
  }, {});
  const stringNames = Object.keys(grouped);

  // Get available colors for selected name
  const availableColors = selectedName ? grouped[selectedName]?.map(s => s.color) : [];
  // Get selected string object
  const selectedStringObj = selectedName && selectedColor
    ? grouped[selectedName].find(s => s.color === selectedColor)
    : null;

  function getStockStatus(quantity) {
    if (quantity === 0) return { status: 'Out of Stock', color: '#dc3545', bgColor: '#f8d7da' };
    if (quantity <= 2) return { status: 'Low Stock', color: '#ffc107', bgColor: '#fff3cd' };
    return { status: 'In Stock', color: '#28a745', bgColor: '#d4edda' };
  }

  function getTensionRange(type) {
    if (type === 'badminton') return '16-35 lbs';
    if (type === 'tennis') return '40-70 lbs';
    return 'Varies';
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '2.875rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            String Options
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            opacity: 0.9,
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Professional quality strings for tennis and badminton rackets. 
            Choose from our carefully selected inventory of premium strings.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginBottom: '3rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.875rem 1.75rem',
            backgroundColor: filter === 'all' ? '#667eea' : 'white',
            color: filter === 'all' ? 'white' : '#333',
            border: filter === 'all' ? 'none' : '2px solid #e9ecef',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: filter === 'all' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          🏸 All Strings
        </button>
        <button
          onClick={() => setFilter('tennis')}
          style={{
            padding: '0.875rem 1.75rem',
            backgroundColor: filter === 'tennis' ? '#667eea' : 'white',
            color: filter === 'tennis' ? 'white' : '#333',
            border: filter === 'tennis' ? 'none' : '2px solid #e9ecef',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: filter === 'tennis' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          🎾 Tennis Strings
        </button>
        <button
          onClick={() => setFilter('badminton')}
          style={{
            padding: '0.875rem 1.75rem',
            backgroundColor: filter === 'badminton' ? '#667eea' : 'white',
            color: filter === 'badminton' ? 'white' : '#333',
            border: filter === 'badminton' ? 'none' : '2px solid #e9ecef',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: '600',
            fontSize: '0.875rem',
            boxShadow: filter === 'badminton' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          🏸 Badminton Strings
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          color: '#666',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #667eea', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '0.975rem' }}>Loading string options...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
          gap: '2rem' 
        }}>
          {stringNames.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem', 
              color: '#666',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px dashed #e9ecef'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                No strings found
              </h3>
              <p style={{ color: '#666' }}>
                No strings available for the selected category. Please try a different filter.
              </p>
            </div>
          ) : (
            stringNames.map(name => {
              const first = grouped[name][0];
              return (
                <div key={name} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Type Badge */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    right: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: first.type === 'tennis' ? '#e3f2fd' : '#f3e5f5',
                    color: first.type === 'tennis' ? '#1976d2' : '#7b1fa2',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {first.type === 'tennis' ? '🎾 Tennis' : '🏸 Badminton'}
                  </div>

                  {/* String Name */}
                  <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    color: '#1a1a1a', 
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    lineHeight: '1.3'
                  }}>
                    {name}
                  </h3>

                  {/* Description */}
                  {first.description && (
                    <p style={{ 
                      color: '#666', 
                      marginBottom: '1.5rem', 
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      {first.description}
                    </p>
                  )}

                  {/* Color Selection */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: '500', color: '#333', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'block' }}>
                      Available Colors
                    </label>
                    <select
                      value={selectedName === name ? selectedColor : ''}
                      onChange={e => {
                        setSelectedName(name);
                        setSelectedColor(e.target.value);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <option value="">Select Color...</option>
                      {grouped[name].map(s => (
                        <option key={s.color} value={s.color}>{s.color}</option>
                      ))}
                    </select>
                  </div>

                  {/* Show details for selected color */}
                  {selectedName === name && selectedColor && selectedStringObj && (
                    <>
                      {/* String Details Grid */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '1rem', 
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                      }}>
                        <div>
                          <strong style={{ color: '#333', fontSize: '0.9rem' }}>Color:</strong>
                          <div style={{ color: '#666', fontSize: '1rem', marginTop: '0.25rem' }}>
                            {selectedStringObj.color}
                          </div>
                        </div>
                        <div>
                          <strong style={{ color: '#333', fontSize: '0.9rem' }}>Tension Range:</strong>
                          <div style={{ color: '#666', fontSize: '1rem', marginTop: '0.25rem' }}>
                            {getTensionRange(selectedStringObj.type)}
                          </div>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: getStockStatus(selectedStringObj.quantity).bgColor,
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: `1px solid ${getStockStatus(selectedStringObj.quantity).color}`
                      }}>
                        <div>
                          <strong style={{ color: '#333', fontSize: '0.9rem' }}>Stock Status:</strong>
                          <div style={{ color: getStockStatus(selectedStringObj.quantity).color, fontWeight: '600', fontSize: '1rem' }}>
                            {getStockStatus(selectedStringObj.quantity).status}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ color: '#333', fontSize: '0.9rem' }}>Quantity:</strong>
                          <div style={{ color: '#666', fontSize: '1rem' }}>
                            {selectedStringObj.quantity}
                            {selectedStringObj.quantity <= 2 && <span style={{ marginLeft: '4px' }}>⚠️</span>}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => window.location.href = '/booking'}
                          style={{
                            width: '100%',
                            padding: '1rem 1.5rem',
                            backgroundColor: selectedStringObj.quantity > 0 ? '#667eea' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: selectedStringObj.quantity > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: selectedStringObj.quantity > 0 ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                          }}
                          disabled={selectedStringObj.quantity === 0}
                        >
                          {selectedStringObj.quantity > 0 ? '🎾 Book with this String' : '❌ Out of Stock'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Call to Action */}
      <div style={{ 
        marginTop: '4rem',
        padding: '3rem 2rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        border: '2px solid #e9ecef'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          color: '#1a1a1a'
        }}>
          Ready to Book Your Stringing?
        </h2>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1rem', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Choose your preferred string and book your professional stringing service today.
        </p>
        <button
          onClick={() => window.location.href = '/booking'}
          style={{
            padding: '1rem 2.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          🎾 Book Now
        </button>
      </div>
    </div>
  );
} 