"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function StringForm({ string = null, onSuccess }) {
  const [form, setForm] = useState({
    name: string?.name || '',
    type: string?.type || '',
    color: string?.color || '',
    quantity: string?.quantity || '',
    description: string?.description || '',
    imageUrl: string?.imageUrl || ''
  });
  const [status, setStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(string?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
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
      const url = string ? `/api/strings/${string._id}` : '/api/strings';
      const method = string ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        if (!string) {
          // Only reset form if it's a new string (not editing)
          setForm({ name: '', type: '', color: '', quantity: '', description: '', imageUrl: '' });
          setImagePreview('');
        }
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: 500, 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      border: '1px solid #e9ecef'
    }}>
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        color: '#333', 
        fontSize: '1.5rem', 
        fontWeight: '600',
        textAlign: 'center'
      }}>
        {string ? 'Edit String' : 'Add New String'}
      </h3>
      
      {/* Image Upload Section */}
      <div>
        
        {/* Image Preview */}
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
              height={200}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
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
        
        {/* Upload Button */}
        <div style={{
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          padding: '1.5rem',
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
                  width: '24px', 
                  height: '24px', 
                  border: '2px solid #f3f3f3', 
                  borderTop: '2px solid #667eea', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }}></div>
                <p style={{ color: '#666', margin: 0 }}>Uploading...</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                  {imagePreview ? 'Click to change image' : 'Click to upload image'}
                </p>
                <p style={{ color: '#999', fontSize: '0.8rem', margin: 0 }}>
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
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
            padding: '0.875rem',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
          }}
          placeholder="Enter string name"
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
            padding: '0.875rem',
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
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500', 
          color: '#333', 
          fontSize: '0.95rem' 
        }}>
          Color
        </label>
        <input 
          type="text" 
          name="color" 
          value={form.color} 
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
          }}
          placeholder="e.g., Black, White, Yellow"
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
          Quantity *
        </label>
        <input 
          type="number" 
          name="quantity" 
          value={form.quantity} 
          onChange={handleChange} 
          min="0" 
          required
          style={{
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box'
          }}
          placeholder="Enter quantity"
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
          Description
        </label>
        <textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          rows="3"
          style={{
            width: '100%',
            padding: '0.875rem',
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
        {status === 'loading' ? '📤 Saving...' : (string ? 'Update String' : 'Add String')}
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
           ✅ {string ? 'String updated successfully!' : 'String saved successfully!'}
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
          ❌ Error saving string. Please try again.
        </div>
      )}
    </form>
  );
} 