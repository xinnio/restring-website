"use client";

import React, { useState } from 'react';

export default function AvailabilityForm({ slot = null, onSuccess }) {
  // Helper to normalize date to YYYY-MM-DD
  function normalizeDate(dateStr) {
    if (!dateStr) return '';
    // If already in YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // If in DD/MM/YYYY, convert to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('/');
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  }

  const [form, setForm] = useState({
    date: normalizeDate(slot?.date) || '',
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
    // --- FORCE NORMALIZATION OF ID ---
    let normalizedSlot = slot ? { ...slot } : null;
    if (normalizedSlot && !normalizedSlot.id && normalizedSlot._id) {
      normalizedSlot.id = normalizedSlot._id;
      console.log('Normalized slot id from _id:', normalizedSlot);
    } else if (normalizedSlot) {
      console.log('Slot id is already normalized:', normalizedSlot);
    }
    // --- LOG SLOT OBJECT ---
    console.log('Submitting slot:', normalizedSlot);
    try {
      const url = normalizedSlot?.id ? `/api/availability/${normalizedSlot.id}` : '/api/availability';
      const method = normalizedSlot?.id ? 'PUT' : 'POST';
      // Normalize date before sending
      const formToSend = { ...form, date: normalizeDate(form.date) };
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend),
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