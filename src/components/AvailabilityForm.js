"use client";

import React, { useState } from 'react';

export default function AvailabilityForm({ slot = null, onSuccess }) {
  const [form, setForm] = useState({
    date: slot?.date || '',
    startTime: slot?.startTime || '',
    endTime: slot?.endTime || '',
    location: slot?.location || '',
    available: slot?.available !== false
  });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ date: '', startTime: '', endTime: '', location: '', available: true });
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
      <h3>{slot ? 'Edit Time Slot' : 'Add New Time Slot'}</h3>
      
      <label>
        Date
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </label>
      
      <label>
        Start Time
        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
      </label>
      <label>
        End Time
        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
      </label>
      <label>
        Location
        <select name="location" value={form.location} onChange={handleChange} required>
          <option value="">Select...</option>
          <option value="Wiser Park Tennis Courts">Wiser Park Tennis Courts</option>
          <option value="Angus Glen Community Centre">Angus Glen Community Centre</option>
          <option value="Door-to-door pickup">Door-to-door pickup</option>
        </select>
      </label>
      
      <label>
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
        Available
      </label>
      
      <button type="submit" disabled={status === 'loading'}>
        {slot ? 'Update Slot' : 'Add Slot'}
      </button>
      
      {status === 'success' && <p style={{ color: 'green' }}>Time slot saved!</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Error saving time slot.</p>}
    </form>
  );
} 