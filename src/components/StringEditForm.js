"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function StringEditForm({ string, variants, onSuccess }) {
  const [form, setForm] = useState({
    name: string?.name || '',
    type: string?.type || '',
    description: string?.description || '',
    imageUrl: string?.imageUrl || ''
  });
  const [variantForms, setVariantForms] = useState([]);
  const [status, setStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(string?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  // Initialize variant forms when component mounts
  useEffect(() => {
    if (variants && variants.length > 0) {
      setVariantForms(variants.map(v => ({
        _id: v._id,
        color: v.color || '',
        quantity: v.quantity || 0
      })));
    }
  }, [variants]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleVariantChange(index, field, value) {
    setVariantForms(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  }

  function handleAddVariant() {
    setVariantForms(prev => [...prev, { _id: null, color: '', quantity: 0 }]);
  }

  function handleRemoveVariant(index) {
    setVariantForms(prev => prev.filter((_, i) => i !== index));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm(f => ({ ...f, imageUrl: data.url }));
        setImagePreview(data.url);
      } else {
        const error = await res.json();
        alert(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');

    try {
      // First, update the main string properties
      const stringUpdateRes = await fetch(`/api/strings/${string._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!stringUpdateRes.ok) {
        throw new Error('Failed to update string');
      }

      // Then update each variant
      const updatePromises = variantForms.map(async (variant) => {
        if (variant._id) {
          // Update existing variant
          return fetch(`/api/strings/${variant._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              type: form.type,
              description: form.description,
              imageUrl: form.imageUrl,
              color: variant.color,
              quantity: parseInt(variant.quantity) || 0
            }),
          });
        } else {
          // Create new variant
          return fetch('/api/strings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: form.name,
              type: form.type,
              description: form.description,
              imageUrl: form.imageUrl,
              color: variant.color,
              quantity: parseInt(variant.quantity) || 0
            }),
          });
        }
      });

      await Promise.all(updatePromises);
      setStatus('success');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Update error:', error);
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: 600, 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem'
    }}>
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        color: '#333', 
        fontSize: '1.5rem', 
        fontWeight: '600',
        textAlign: 'center'
      }}>
        Edit String: {string?.name}
      </h3>
      
      {/* Image Upload Section */}
      <div>
        
        {imagePreview && (
          <div style={{ 
            marginBottom: '1rem', 
            textAlign: 'center',
            position: 'relative'
          }}>
            <Image 
              src={imagePreview} 
              alt="String preview" 
              width={400}
              height={150}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '150px', 
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                objectFit: 'cover'
              }} 
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview('');
                setForm(f => ({ ...f, imageUrl: '' }));
              }}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        )}
        
        <div style={{
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <div style={{ pointerEvents: 'none' }}>
            {uploading ? (
              <div>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid #f3f3f3', 
                  borderTop: '2px solid #667eea', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }}></div>
                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Uploading...</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📷</div>
                <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  {imagePreview ? 'Click to change image' : 'Click to upload image'}
                </p>
                <p style={{ color: '#999', fontSize: '0.7rem', margin: 0 }}>
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* String Properties */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500', 
            color: '#333', 
            fontSize: '0.95rem' 
          }}>
            String Name *
          </label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '0.875rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500', 
            color: '#333', 
            fontSize: '0.95rem' 
          }}>
            Type *
          </label>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select type...</option>
            <option value="tennis">🎾 Tennis</option>
            <option value="badminton">🏸 Badminton</option>
          </select>
        </div>
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500', 
          color: '#333', 
          fontSize: '0.95rem' 
        }}>
          Description
        </label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          rows="3"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
          placeholder="Describe the string characteristics, performance, etc."
        />
      </div>

      {/* Color Variants Section */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h4 style={{ 
            margin: 0, 
            color: '#333', 
            fontSize: '1.1rem', 
            fontWeight: '600' 
          }}>
            Color Variants
          </h4>
          <button
            type="button"
            onClick={handleAddVariant}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            + Add Color
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {variantForms.map((variant, index) => (
            <div key={index} style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontWeight: '600', color: '#333' }}>Variant {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  Remove
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.25rem', 
                    fontWeight: '500', 
                    color: '#333', 
                    fontSize: '0.875rem' 
                  }}>
                    Color *
                  </label>
                  <input 
                    type="text" 
                    value={variant.color} 
                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Black, White"
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.25rem', 
                    fontWeight: '500', 
                    color: '#333', 
                    fontSize: '0.875rem' 
                  }}>
                    Quantity *
                  </label>
                  <input 
                    type="number" 
                    value={variant.quantity} 
                    onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                    min="0" 
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={status === 'loading'}
        style={{
          padding: '1rem 1.5rem',
          backgroundColor: status === 'loading' ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: status === 'loading' ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)'
        }}
      >
        {status === 'loading' ? '📤 Updating...' : 'Update String & Variants'}
      </button>
      
      {status === 'success' && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          borderRadius: '8px', 
          textAlign: 'center', 
          border: '1px solid #c3e6cb' 
        }}>
          ✅ String and variants updated successfully!
        </div>
      )}
      {status === 'error' && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '8px', 
          textAlign: 'center', 
          border: '1px solid #f5c6cb' 
        }}>
          ❌ Error updating string. Please try again.
        </div>
      )}
    </form>
  );
} 