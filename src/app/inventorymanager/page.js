"use client";

import React, { useEffect, useState } from 'react';
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

  async function fetchStrings() {
    setLoading(true);
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

  async function handleDelete(stringId) {
    if (!confirm('Are you sure you want to delete this string?')) {
      return;
    }

    setDeleting(stringId);
    try {
      const res = await fetch(`/api/strings/${stringId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchStrings();
      }
    } catch (error) {
      console.error('Error deleting string:', error);
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
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: '#333', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px' }}>🧵 String Inventory Manager</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1px solid #e9ecef' }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.5rem', fontWeight: 600 }}>Add New String</h2>
              <StringForm onSuccess={fetchStrings} />
            </div>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(102,126,234,0.08)', border: '1px solid #e9ecef' }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.5rem', fontWeight: 600 }}>Current Inventory</h2>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                  <p style={{ fontSize: '1.1rem' }}>Loading strings...</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Image</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Name</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Type</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Colors & Quantities</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '1rem', color: '#333', fontWeight: 600, borderBottom: '1px solid #dee2e6' }}>Actions</th>
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
                              <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#888', background: '#f8f9fa', borderRadius: '12px' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧵</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>No strings in inventory.</div>
                                <div style={{ color: '#aaa', marginTop: '0.5rem' }}>Add your first string to get started!</div>
                              </td>
                            </tr>
                          );
                        }
                        return names.map(name => {
                          const variants = grouped[name];
                          const first = variants[0];
                          return (
                            <tr key={name} style={{ borderBottom: '1px solid #dee2e6', transition: 'background 0.2s' }}>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                {first.imageUrl ? (
                                  <img 
                                    src={first.imageUrl} 
                                    alt={`${name} string`} 
                                    style={{ 
                                      width: '60px', 
                                      height: '60px', 
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
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                <strong style={{ fontSize: '1.1rem', color: '#222' }}>{name}</strong>
                                {first.description && (
                                  <div style={{ fontSize: '0.95rem', color: '#666', marginTop: '4px' }}>{first.description}</div>
                                )}
                              </td>
                              <td style={{ padding: '16px', textTransform: 'capitalize', verticalAlign: 'top', fontWeight: 500 }}>{first.type}</td>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  {variants.map(v => (
                                    <span key={v.color} style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      background: '#f8f9fa',
                                      border: `2px solid ${v.quantity <= 2 ? '#dc3545' : v.quantity <= 5 ? '#ffc107' : '#28a745'}`,
                                      color: v.quantity <= 2 ? '#dc3545' : v.quantity <= 5 ? '#ffc107' : '#28a745',
                                      borderRadius: '8px',
                                      padding: '0.5rem 1.25rem',
                                      fontSize: '1rem',
                                      fontWeight: '600',
                                      minWidth: '90px',
                                      justifyContent: 'center',
                                      boxShadow: v.quantity <= 2 ? '0 0 0 2px #dc354522' : v.quantity <= 5 ? '0 0 0 2px #ffc10722' : '0 0 0 2px #28a74522',
                                    }}>
                                      <span style={{ fontWeight: 700 }}>{v.color}</span>
                                      <span style={{ margin: '0 0.5rem' }}>•</span>
                                      <span>{v.quantity}</span>
                                      {v.quantity <= 2 && <span style={{ marginLeft: '4px' }}>⚠️</span>}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: '16px', verticalAlign: 'top' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {/* Edit button for the string name/type/description */}
                                  <button
                                    onClick={() => handleEdit(first, variants)}
                                    style={{
                                      fontSize: '1rem',
                                      padding: '8px 16px',
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      marginBottom: '0.5rem',
                                      fontWeight: 600,
                                      boxShadow: '0 2px 8px rgba(40,167,69,0.08)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      transition: 'background 0.2s',
                                    }}
                                  >
                                    ✏️ Edit String
                                  </button>
                                  {/* Delete buttons for each variant */}
                                  {variants.map(v => (
                                    <button
                                      key={v._id}
                                      onClick={() => handleDelete(v._id)}
                                      disabled={deleting === v._id}
                                      style={{
                                        fontSize: '1rem',
                                        padding: '8px 16px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        marginBottom: '2px',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 8px rgba(220,53,69,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'background 0.2s',
                                      }}
                                    >
                                      🗑️ {deleting === v._id ? 'Deleting...' : `Delete ${v.color}`}
                                    </button>
                                  ))}
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
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: '2.5rem',
            minWidth: '500px',
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
                fontSize: '2rem', 
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