"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        setStatus('success');
        
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          router.push('/admindashboard');
        }, 1000);
      } else {
        setStatus('error');
        setForm({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Admin Login
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          Email
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required
            style={{ 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
            placeholder="markhamrestring@gmail.com"
          />
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          Password
          <input 
            type="password" 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            required
            style={{ 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
            placeholder="Enter your password"
          />
        </label>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '1rem', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '0.975rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        {status === 'success' && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            borderRadius: '4px', 
            textAlign: 'center' 
          }}>
            ✅ Login successful! Redirecting...
          </div>
        )}
        
        {status === 'error' && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '4px', 
            textAlign: 'center' 
          }}>
            ❌ Invalid email or password. Please try again.
          </div>
        )}
      </form>
      

    </div>
  );
} 