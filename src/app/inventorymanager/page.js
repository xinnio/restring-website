"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Sidebar from '../../components/Sidebar';
import StringForm from '../../components/StringForm';
import StringEditForm from '../../components/StringEditForm';

export default function InventoryManager() {
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null); // string object being edited
  const [editingVariants, setEditingVariants] = useState([]); // all variants for the string being edited
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageUrls, setImageUrls] = useState({}); // Store presigned URLs
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Function to generate presigned URL for an image
  async function getImageUrl(imageUrl) {
    if (!imageUrl) return null;
    try {
      // Extract filename from the S3 URL or use the key directly
      const filename = imageUrl.split('/').pop();
      if (!filename) return null;
      const response = await fetch(`/api/images/${filename}`);
      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (error) {
      console.error('Error generating image URL:', error);
    }
    return null;
  }

  const fetchStrings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/strings');
      const data = await res.json();
      // Normalize all string and variant objects to have an id property
      const normalized = data.map(s => ({
        ...s,
        id: s.id || s._id,
      }));
      setStrings(normalized);
      // Generate presigned URLs for all images on demand
      const urlPromises = data.map(async (string) => {
        if (string.imageUrl) {
          const presignedUrl = await getImageUrl(string.imageUrl);
          return { id: string.id, url: presignedUrl };
        }
        return null;
      });
      const urlResults = await Promise.all(urlPromises);
      const urlMap = {};
      urlResults.forEach(result => {
        if (result) {
          urlMap[result.id] = result.url;
        }
      });
      setImageUrls(urlMap);
    } catch (error) {
      console.error('Error fetching strings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleDelete(stringId) {
    if (!confirm('Are you sure you want to delete this string?')) {
      return;
    }

    // Check if the stringId is valid
    if (!stringId || stringId === 'undefined' || stringId === undefined || stringId === null || stringId === '') {
      alert('Cannot delete string: Invalid or missing ID. This string may have been corrupted. Please refresh the page and try again.');
      fetchStrings(); // Refresh to get updated data
      return;
    }

    console.log('Attempting to delete string with ID:', stringId);
    setDeleting(stringId);
    
    try {
      const res = await fetch(`/api/strings/${stringId}`, {
        method: 'DELETE',
      });
      
      const responseData = await res.json();
      console.log('Delete string response:', responseData);
      
      if (res.ok) {
        alert('String deleted successfully!');
        fetchStrings(); // Refresh the list
      } else if (res.status === 404) {
        // String was already deleted or doesn't exist
        alert('This string has already been deleted or does not exist. Refreshing the list...');
        fetchStrings(); // Refresh to remove from UI
      } else if (res.status === 400 && responseData.details && responseData.details.includes('String ID is missing or undefined')) {
        // Handle the specific case of undefined IDs
        alert('This string has an invalid ID and cannot be deleted through the normal interface. It has been automatically cleaned up. Refreshing the list...');
        fetchStrings(); // Refresh to remove from UI
      } else {
        const errorMessage = responseData.details || responseData.error || 'Error deleting string. Please try again.';
        alert(errorMessage);
        // Refresh data even on error to ensure UI is up to date
        fetchStrings();
      }
    } catch (error) {
      console.error('Error deleting string:', error);
      alert('Error deleting string. Please try again.');
      // Refresh data even on error to ensure UI is up to date
      fetchStrings();
    } finally {
      setDeleting(null);
    }
  }

  function handleEdit(string, allVariants) {
    setEditing(string);
    setEditingVariants(allVariants);
    setShowEditModal(true);
  }

  function handleCloseEdit() {
    setEditing(null);
    setEditingVariants([]);
    setShowEditModal(false);
  }

  useEffect(() => {
    fetchStrings();
  }, [fetchStrings]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)', overflow: 'auto' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          <h1 style={{ 
            color: '#333', 
            marginBottom: 'clamp(1rem, 3vw, 2rem)', 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 700, 
            letterSpacing: '-1px',
            lineHeight: '1.2'
          }}>🧵 String Inventory Manager</h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)', 
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 2rem)', 
              borderRadius: '16px', 
              boxShadow: '0 4px 24px rgba(102,126,234,0.08)', 
              border: '1px solid #e9ecef',
              minWidth: '280px'
            }}>
              <h2 style={{ 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)', 
                color: '#333', 
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                fontWeight: 600 
              }}>Add New String</h2>
              <StringForm onSuccess={fetchStrings} />
            </div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: 'clamp(1rem, 3vw, 2rem)', 
              borderRadius: '16px', 
              boxShadow: '0 4px 24px rgba(102,126,234,0.08)', 
              border: '1px solid #e9ecef',
              minWidth: '280px'
            }}>
              <h2 style={{ 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)', 
                color: '#333', 
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                fontWeight: 600 
              }}>Current Inventory</h2>
              {loading ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: 'clamp(2rem, 5vw, 3rem)', 
                  color: '#666' 
                }}>
                  <div style={{ 
                    width: 'clamp(30px, 8vw, 40px)', 
                    height: 'clamp(30px, 8vw, 40px)', 
                    border: '4px solid #f3f3f3', 
                    borderTop: '4px solid #667eea', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite', 
                    margin: '0 auto 1rem' 
                  }}></div>
                  <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>Loading strings...</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100vw' }}>
                  <table style={{ 
                    width: '100%',
                    maxWidth: '100vw',
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    minWidth: '700px',
                    tableLayout: 'auto',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ 
                          padding: 'clamp(8px, 2vw, 12px)', 
                          textAlign: 'left', 
                          fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', 
                          color: '#333', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #dee2e6',
                          minWidth: '60px',
                          maxWidth: '100px',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}>Image</th>
                        <th style={{ 
                          padding: 'clamp(12px, 3vw, 16px)', 
                          textAlign: 'left', 
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                          color: '#333', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #dee2e6', 
                          width: '20%' 
                        }}>Name</th>
                        <th style={{ 
                          padding: 'clamp(12px, 3vw, 16px)', 
                          textAlign: 'left', 
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                          color: '#333', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #dee2e6', 
                          width: '12%' 
                        }}>Type</th>
                        <th style={{ 
                          padding: 'clamp(12px, 3vw, 16px)', 
                          textAlign: 'left', 
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                          color: '#333', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #dee2e6', 
                          width: '18%' 
                        }}>Brand & Model</th>
                        <th style={{ 
                          padding: 'clamp(12px, 3vw, 16px)', 
                          textAlign: 'left', 
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                          color: '#333', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #dee2e6', 
                          width: '25%' 
                        }}>Colors & Quantities</th>
                        <th style={{ 
                          padding: 'clamp(12px, 3vw, 16px)', 
                          textAlign: 'left', 
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', 
                          color: '#333', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #dee2e6', 
                          width: '15%' 
                        }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const grouped = strings.reduce((acc, s) => {
                          if (!acc[s.name]) acc[s.name] = [];
                          acc[s.name].push(s);
                          return acc;
                        }, {});
                        const names = Object.keys(grouped);
                        if (names.length === 0) {
                          return (
                            <tr>
                              <td colSpan="6" style={{ 
                                padding: 'clamp(2rem, 5vw, 3rem)', 
                                textAlign: 'center', 
                                color: '#888', 
                                background: '#f8f9fa', 
                                borderRadius: '12px' 
                              }}>
                                <div style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>🧵</div>
                                <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: 600 }}>No strings in inventory.</div>
                                <div style={{ color: '#aaa', marginTop: '0.5rem', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>Add your first string to get started!</div>
                              </td>
                            </tr>
                          );
                        }
                        return names.map(name => {
                          const variants = grouped[name];
                          const first = variants[0];
                          return (
                            <tr key={name} style={{ borderBottom: '1px solid #dee2e6', transition: 'background 0.2s' }}>
                              <td style={{ padding: 'clamp(8px, 2vw, 12px)', verticalAlign: 'top', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '120px' }}>
                                {first.imageUrl ? (
                                  <Image 
                                    src={imageUrls[first.id] || first.imageUrl} 
                                    alt={`${name} string`} 
                                    width={60}
                                    height={60}
                                    unoptimized={true}
                                    style={{ 
                                      objectFit: 'cover',
                                      borderRadius: '8px',
                                      border: '1px solid #e9ecef'
                                    }} 
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999',
                                    fontSize: '1.5rem'
                                  }}>
                                    📷
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: 'clamp(12px, 3vw, 16px)', verticalAlign: 'top' }}>
                                <strong style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', color: '#222' }}>{name}</strong>
                                {first.description && (
                                  <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)', color: '#666', marginTop: '4px' }}>{first.description}</div>
                                )}
                              </td>
                              <td style={{ padding: 'clamp(12px, 3vw, 16px)', textTransform: 'capitalize', verticalAlign: 'top', fontWeight: 500, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>{first.type}</td>
                              <td style={{ padding: 'clamp(12px, 3vw, 16px)', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  {first.stringBrand && (
                                    <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)', color: '#333', fontWeight: '500' }}>
                                      <strong>Brand:</strong> {first.stringBrand}
                                    </div>
                                  )}
                                  {first.stringModel && (
                                    <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 0.95rem)', color: '#333', fontWeight: '500' }}>
                                      <strong>Model:</strong> {first.stringModel}
                                    </div>
                                  )}
                                  {!first.stringBrand && !first.stringModel && (
                                    <div style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)', color: '#999', fontStyle: 'italic' }}>
                                      No brand/model info
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: 'clamp(12px, 3vw, 16px)', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '100%' }}>
                                  {variants.map(v => (
                                    <span key={`${v.color}-${v.id || Math.random()}`} style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      background: '#f8f9fa',
                                      border: `1px solid ${v.quantity <= 2 ? '#dc3545' : v.quantity <= 5 ? '#ffc107' : '#28a745'}`,
                                      color: v.quantity <= 2 ? '#dc3545' : v.quantity <= 5 ? '#ffc107' : '#28a745',
                                      borderRadius: '6px',
                                      padding: '0.25rem 0.5rem',
                                      fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)',
                                      fontWeight: '600',
                                      minWidth: '60px',
                                      justifyContent: 'center',
                                      boxShadow: v.quantity <= 2 ? '0 0 0 1px #dc354522' : v.quantity <= 5 ? '0 0 0 1px #ffc10722' : '0 0 0 1px #28a74522',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}>
                                      <span style={{ fontWeight: 700, fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)' }}>{v.color}</span>
                                      <span style={{ margin: '0 0.25rem', fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)' }}>•</span>
                                      <span style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.8rem)' }}>{v.quantity}</span>
                                      {v.quantity <= 2 && <span style={{ marginLeft: '2px', fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)' }}>⚠️</span>}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: 'clamp(12px, 3vw, 16px)', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  {/* Edit button for the string name/type/description */}
                                  <button
                                    onClick={() => handleEdit(first, variants)}
                                    style={{
                                      fontSize: 'clamp(0.8rem, 2.5vw, 0.85rem)',
                                      padding: 'clamp(4px, 1.5vw, 6px) clamp(8px, 2.5vw, 12px)',
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontWeight: 600,
                                      boxShadow: '0 2px 4px rgba(40,167,69,0.15)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                      transition: 'background 0.2s',
                                      whiteSpace: 'nowrap',
                                      width: '100%',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    ✏️ Edit
                                  </button>
                                  {/* Compact delete buttons */}
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                    {variants.map(v => (
                                      <button
                                        key={v.id}
                                        onClick={() => handleDelete(v.id)}
                                        disabled={deleting === v.id}
                                        style={{
                                          fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
                                          padding: 'clamp(3px, 1.5vw, 4px) clamp(6px, 2.5vw, 8px)',
                                          backgroundColor: '#dc3545',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontWeight: 600,
                                          boxShadow: '0 2px 4px rgba(220,53,69,0.15)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          transition: 'background 0.2s',
                                          whiteSpace: 'nowrap',
                                          minWidth: '60px',
                                          justifyContent: 'center'
                                        }}
                                      >
                                        🗑️ {deleting === v.id ? '...' : v.color}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'clamp(1rem, 3vw, 2rem)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            minWidth: 'clamp(300px, 80vw, 500px)',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={handleCloseEdit} 
              style={{ 
                position: 'absolute', 
                top: 18, 
                right: 24, 
                background: 'none', 
                border: 'none', 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                color: '#6c63ff', 
                cursor: 'pointer' 
              }}
            >
              &times;
            </button>
            <StringEditForm 
              string={editing} 
              variants={editingVariants}
              onSuccess={() => {
                fetchStrings();
                handleCloseEdit();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
} 