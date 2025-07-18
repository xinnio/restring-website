"use client";

import React, { useState } from 'react';

export default function StringForm({ string = null, onSuccess }) {
  const [form, setForm] = useState({
    name: string?.name || '',
    type: string?.type || '',
    color: string?.color || '',
    quantity: string?.quantity || '',
    description: string?.description || ''
  });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/strings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', type: '', color: '', quantity: '', description: '' });
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3>{string ? 'Edit String' : 'Add New String'}</h3>
      
      <label>
        String Name
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </label>
      
      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Select...</option>
          <option value="tennis">Tennis</option>
          <option value="badminton">Badminton</option>
        </select>
      </label>
      
      <label>
        Color
        <input type="text" name="color" value={form.color} onChange={handleChange} />
      </label>
      
      <label>
        Quantity
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="0" required />
      </label>
      
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
      </label>
      
      <button type="submit" disabled={status === 'loading'}>
        {string ? 'Update String' : 'Add String'}
      </button>
      
      {status === 'success' && <p style={{ color: 'green' }}>String saved!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Error saving string.</p>}
    </form>
  );
} 