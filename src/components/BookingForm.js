"use client";

import React, { useState, useEffect } from 'react';

export default function BookingForm() {
  // --- State ---
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    racketType: '',
    stringName: '',
    stringColor: '',
    stringTension: '',
    ownString: false,
    grommetReplacement: false,
    turnaroundTime: '',
    dropoffLocation: '',
    dropoffSlotId: '',
    pickupLocation: '',
    pickupSlotId: '',
    notes: '',
  });
  const [status, setStatus] = useState(null);
  const [strings, setStrings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [showPickupFields, setShowPickupFields] = useState(false);
  const [showDeliveryFields, setShowDeliveryFields] = useState(false);

  // Add state for multiple racket/string combos
  const [rackets, setRackets] = useState([
    { racketType: '', stringName: '', stringColor: '', stringTension: '', quantity: 1 }
  ]);

  // --- Fetch inventory and availability ---
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

  useEffect(() => {
    async function fetchAvailability() {
      setAvailabilityLoading(true);
      try {
        const res = await fetch('/api/availability');
        const data = await res.json();
        setAvailability(data.filter(slot => slot.available !== false));
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setAvailabilityLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  // --- Handlers ---
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleRacketTypeChange(e) {
    setForm(f => ({ ...f, racketType: e.target.value, stringName: '', stringColor: '' }));
  }

  function handleStringNameSelect(e) {
    setForm(f => ({ ...f, stringName: e.target.value, stringColor: '' }));
  }

  function handleStringColorSelect(e) {
    setForm(f => ({ ...f, stringColor: e.target.value }));
  }

  function handleRacketChange(idx, e) {
    const { name, value } = e.target;
    setRackets(rackets => rackets.map((r, i) => i === idx ? { ...r, [name]: value } : r));
  }
  function handleAddRacket() {
    setRackets(rackets => [...rackets, { racketType: '', stringName: '', stringColor: '', stringTension: '', quantity: 1 }]);
  }
  function handleRemoveRacket(idx) {
    setRackets(rackets => rackets.filter((_, i) => i !== idx));
  }

  // --- Inventory Filtering ---
  // Returns grouped strings for a given racket type
  function getGroupedStringsForType(racketType) {
    if (!racketType) return {};
    const filtered = strings.filter(s => s.type === racketType && s.quantity > 0);
    return filtered.reduce((acc, s) => {
      if (!acc[s.name]) acc[s.name] = [];
      acc[s.name].push(s);
      return acc;
    }, {});
  }
  // Returns available colors for a given racket type and string name
  function getAvailableColors(racketType, stringName) {
    const grouped = getGroupedStringsForType(racketType);
    return stringName && grouped[stringName] ? grouped[stringName].map(s => s.color) : [];
  }

  // --- Availability Filtering ---
  function getSlotsForLocation(location) {
    return availability.filter(slot => slot.location === location);
  }

  // Helper to generate 30-min windows
  function getThirtyMinWindows(start, end) {
    const result = [];
    let [sh, sm] = start.split(':').map(Number);
    let [eh, em] = end.split(':').map(Number);
    let startDate = new Date(0, 0, 0, sh, sm);
    let endDate = new Date(0, 0, 0, eh, em);
    while (startDate < endDate) {
      let next = new Date(startDate.getTime() + 30 * 60000);
      if (next > endDate) next = endDate;
      const pad = n => n.toString().padStart(2, '0');
      result.push(`${pad(startDate.getHours())}:${pad(startDate.getMinutes())} - ${pad(next.getHours())}:${pad(next.getMinutes())}`);
      startDate = next;
    }
    return result;
  }

  // --- Helper: Get available dates for location ---
  function getAvailableDatesForLocation(location) {
    const slots = getSlotsForLocation(location);
    // Return unique dates with available slots
    return [...new Set(slots.map(slot => slot.date))];
  }
  // --- Helper: Get slots for selected date/location ---
  function getSlotsForDate(location, date) {
    return getSlotsForLocation(location).filter(slot => slot.date === date);
  }

  // --- Pricing ---
  function calculatePriceBreakdown() {
    // Per-racket base price (based on turnaroundTime)
    let basePrice = 0;
    switch (form.turnaroundTime) {
      case 'sameDay': basePrice = 35; break;
      case 'nextDay': basePrice = 30; break;
      case '3-5days': basePrice = 25; break;
      default: basePrice = 0;
    }
    // Calculate subtotal for all rackets
    let racketsSubtotal = rackets.reduce((sum, r) => sum + (basePrice * (parseInt(r.quantity) || 1)), 0);
    // Extras (apply to whole order)
    let extras = 0;
    if (form.ownString) extras -= 5; // $5 discount for own string
    if (form.grommetReplacement) extras += 0.25;
    let deliveryFee = 0;
    const dropoffDelivery = form.dropoffLocation === 'Door-to-Door (Delivery)';
    const pickupDelivery = form.pickupLocation === 'Door-to-Door (Delivery)';
    if (dropoffDelivery) deliveryFee += 12;
    if (pickupDelivery) deliveryFee += 12;
    if (dropoffDelivery && pickupDelivery) deliveryFee -= 4; // $4 discount if both
    const total = racketsSubtotal + extras + deliveryFee;
    return {
      basePrice,
      racketsSubtotal,
      extras,
      deliveryFee,
      total,
    };
  }
  const priceDetails = calculatePriceBreakdown();

  // --- Submit ---
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    // DEBUG: Log what is being sent
    console.log('BookingForm SUBMIT payload:', { ...form, rackets });
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rackets }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({
          fullName: '', email: '', phone: '', racketType: '', stringName: '', stringColor: '', stringTension: '', ownString: false, grommetReplacement: false, turnaroundTime: '', dropoffLocation: '', dropoffSlotId: '', pickupLocation: '', pickupSlotId: '', notes: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // --- UI ---
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Book Your Stringing Service
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Professional racket stringing with quality strings and expert care.
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 1. Personal Information */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📋 1. Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Full Name *</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }} placeholder="Enter your full name" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }} placeholder="your.email@example.com" />
              <small style={{ color: '#888' }}>Confirmation sent here</small>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }} placeholder="(123) 456-7890" />
              <small style={{ color: '#888' }}>For pickup/drop-off coordination</small>
            </div>
          </div>
        </div>
        {/* 2. Racket & String Details */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>🔍 2. Racket & String Details</h3>
          {rackets.map((r, idx) => (
            <div key={idx} style={{ marginBottom: '2rem', borderBottom: idx < rackets.length - 1 ? '1px solid #e9ecef' : 'none', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Racket Type *</label>
                  <select name="racketType" value={r.racketType} onChange={e => handleRacketChange(idx, e)} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Select Racket Type...</option>
                    <option value="tennis">🎾 Tennis</option>
                    <option value="badminton">🏸 Badminton</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>String Type *</label>
                  <select name="stringName" value={r.stringName} onChange={e => handleRacketChange(idx, e)} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Select String...</option>
                    {Object.keys(getGroupedStringsForType(r.racketType)).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>String Color</label>
                  <select name="stringColor" value={r.stringColor} onChange={e => handleRacketChange(idx, e)} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Select Color...</option>
                    {(r.stringName && getAvailableColors(r.racketType, r.stringName)) ? getAvailableColors(r.racketType, r.stringName).map(color => (
                      <option key={color} value={color}>{color}</option>
                    )) : null}
                  </select>
                  <small style={{ color: '#888' }}>Optional (based on available stock)</small>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>String Tension (lbs) *</label>
                  <select name="stringTension" value={r.stringTension} onChange={e => handleRacketChange(idx, e)} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="">Select Tension...</option>
                    <option value="16-20">16-20 lbs : Recreational</option>
                    <option value="19-23">19-23 lbs : Beginner</option>
                    <option value="22-26">22-26 lbs : Intermediate</option>
                    <option value="25-29">25-29 lbs : Advanced</option>
                    <option value="27-35">27-35 lbs : Professional</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Quantity *</label>
                  <input type="number" name="quantity" min={1} value={r.quantity} onChange={e => handleRacketChange(idx, e)} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }} />
                </div>
              </div>
              {rackets.length > 1 && (
                <button type="button" onClick={() => handleRemoveRacket(idx)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.825rem', marginTop: '0.5rem' }}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddRacket} style={{ background: '#6c63ff', color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem' }}>+ Add Another Racket</button>
        </div>
        {/* 3. Service Options */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          {/* Same-Day Service Warning */}
          <div style={{ background: 'linear-gradient(90deg, #fef9c3 60%, #f8fafc 100%)', border: '1.5px solid #fde68a', borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.3rem', color: '#f59e42' }}>⚡</span>
            <span style={{ fontSize: '1.05rem', color: '#b45309', fontWeight: 600 }}>Same-Day Service: Book before 2:00 AM for same-day pick-up</span>
          </div>
          {/* Modern card selection for turnaround time */}
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {/* Same Day Service Card */}
            <div
              onClick={() => setForm(f => ({ ...f, turnaroundTime: 'sameDay' }))}
              style={{
                flex: 1,
                cursor: 'pointer',
                border: form.turnaroundTime === 'sameDay' ? '2.5px solid #6c63ff' : '1.5px solid #e9ecef',
                borderRadius: '18px',
                background: form.turnaroundTime === 'sameDay'
                  ? 'linear-gradient(135deg, #f5f7ff 60%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #f8f9fa 100%)',
                boxShadow: form.turnaroundTime === 'sameDay'
                  ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)'
                  : '0 1.5px 8px rgba(0,0,0,0.06)',
                padding: '1.25rem 0.75rem 1rem 0.75rem',
                position: 'relative',
                transition: 'border 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s',
                minWidth: 140,
                maxWidth: 180,
                textAlign: 'center',
                outline: 'none',
                transform: form.turnaroundTime === 'sameDay' ? 'scale(1.045)' : 'scale(1)',
              }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, turnaroundTime: 'sameDay' }))}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(102,99,255,0.18), 0 2px 10px rgba(108,99,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = form.turnaroundTime === 'sameDay' ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)' : '0 1.5px 8px rgba(0,0,0,0.06)'}
            >
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>⚡</span>
              <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: '0.18rem', letterSpacing: '0.01em' }}>Same Day Service</div>
              <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: '1.28rem', marginBottom: '0.18rem' }}>$35</div>
              {/* Most Popular Badge */}
              <div style={{
                position: 'absolute',
                top: -15,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #6c63ff 60%, #667eea 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '0.18rem 0.95rem',
                borderRadius: '8px',
                letterSpacing: '0.04em',
                boxShadow: '0 1.5px 6px rgba(102,99,255,0.13)',
                border: '1.5px solid #fff',
                zIndex: 2,
                textShadow: '0 1px 2px rgba(0,0,0,0.08)',
                display: 'block',
              }}>MOST POPULAR</div>
            </div>
            {/* Next Day Service Card */}
            <div
              onClick={() => setForm(f => ({ ...f, turnaroundTime: 'nextDay' }))}
              style={{
                flex: 1,
                cursor: 'pointer',
                border: form.turnaroundTime === 'nextDay' ? '2.5px solid #6c63ff' : '1.5px solid #e9ecef',
                borderRadius: '18px',
                background: form.turnaroundTime === 'nextDay'
                  ? 'linear-gradient(135deg, #f5f7ff 60%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #f8f9fa 100%)',
                boxShadow: form.turnaroundTime === 'nextDay'
                  ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)'
                  : '0 1.5px 8px rgba(0,0,0,0.06)',
                padding: '1.25rem 0.75rem 1rem 0.75rem',
                position: 'relative',
                transition: 'border 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s',
                minWidth: 140,
                maxWidth: 180,
                textAlign: 'center',
                outline: 'none',
                transform: form.turnaroundTime === 'nextDay' ? 'scale(1.045)' : 'scale(1)',
              }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, turnaroundTime: 'nextDay' }))}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(102,99,255,0.18), 0 2px 10px rgba(108,99,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = form.turnaroundTime === 'nextDay' ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)' : '0 1.5px 8px rgba(0,0,0,0.06)'}
            >
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>🚀</span>
              <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: '0.18rem', letterSpacing: '0.01em' }}>Next Day Service</div>
              <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: '1.28rem', marginBottom: '0.18rem' }}>$30</div>
            </div>
            {/* 3-5 Day Service Card */}
            <div
              onClick={() => setForm(f => ({ ...f, turnaroundTime: '3-5days' }))}
              style={{
                flex: 1,
                cursor: 'pointer',
                border: form.turnaroundTime === '3-5days' ? '2.5px solid #6c63ff' : '1.5px solid #e9ecef',
                borderRadius: '18px',
                background: form.turnaroundTime === '3-5days'
                  ? 'linear-gradient(135deg, #f5f7ff 60%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #f8f9fa 100%)',
                boxShadow: form.turnaroundTime === '3-5days'
                  ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)'
                  : '0 1.5px 8px rgba(0,0,0,0.06)',
                padding: '1.25rem 0.75rem 1rem 0.75rem',
                position: 'relative',
                transition: 'border 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s',
                minWidth: 140,
                maxWidth: 180,
                textAlign: 'center',
                outline: 'none',
                transform: form.turnaroundTime === '3-5days' ? 'scale(1.045)' : 'scale(1)',
              }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, turnaroundTime: '3-5days' }))}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(102,99,255,0.18), 0 2px 10px rgba(108,99,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = form.turnaroundTime === '3-5days' ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)' : '0 1.5px 8px rgba(0,0,0,0.06)'}
            >
              <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>📅</span>
              <div style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: '0.18rem', letterSpacing: '0.01em' }}>3-5 Day Service</div>
              <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: '1.28rem', marginBottom: '0.18rem' }}>$25</div>
            </div>
          </div>
          {/* Keep other service options as-is */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Own String?</label>
              <input type="checkbox" name="ownString" checked={form.ownString} onChange={handleChange} />
              <span style={{ marginLeft: '0.5rem', color: '#666' }}>I will provide my own string (-$5.00 discount)</span>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Grommet Replacement?</label>
              <input type="checkbox" name="grommetReplacement" checked={form.grommetReplacement} onChange={handleChange} />
              <span style={{ marginLeft: '0.5rem', color: '#666' }}>Add grommet replacement (4 FREE per racket, +$0.25 each additional)</span>
            </div>
          </div>
        </div>
        {/* 4. Drop-Off / Pick-Up Scheduling */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📍 4. Drop-Off / Pickup Scheduling</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Drop-Off Location *</label>
              <select name="dropoffLocation" value={form.dropoffLocation} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option value="">Select Location...</option>
                <option value="Markham Studio">🏠 Markham Studio</option>
                <option value="Wiser Park Tennis Courts">🎾 Wiser Park Tennis Courts</option>
                <option value="Angus Glen Community Centre">🏢 Angus Glen Community Centre</option>
                <option value="Door-to-Door (Delivery)">🚗 Door-to-Door (Delivery) (+$12.00)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Pick-up Location *</label>
              <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}>
                <option value="">Select Location...</option>
                <option value="Markham Studio">🏠 Markham Studio</option>
                <option value="Wiser Park Tennis Courts">🎾 Wiser Park Tennis Courts</option>
                <option value="Angus Glen Community Centre">🏢 Angus Glen Community Centre</option>
                <option value="Door-to-Door (Delivery)">🚗 Door-to-Door (Delivery) (+$12.00)</option>
              </select>
              <div style={{ color: '#666', fontSize: '1rem', marginTop: '0.5rem' }}>We will contact you once your order is finished for pick-up coordination.</div>
            </div>
          </div>
          {/* Add delivery address field if Door-to-Door (Delivery) is selected for drop-off or pickup */}
          {(form.dropoffLocation === 'Door-to-Door (Delivery)' || form.pickupLocation === 'Door-to-Door (Delivery)') && (
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Delivery Address *</label>
              <input
                type="text"
                name="deliveryAddress"
                value={form.deliveryAddress || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}
                placeholder="Enter your address for Door-to-Door service"
              />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Drop-Off Date *</label>
              {/* Calendar picker for available dates */}
              {availabilityLoading ? (
                <div>Loading available dates...</div>
              ) : getAvailableDatesForLocation(form.dropoffLocation).length === 0 ? (
                <div style={{ color: '#b71c1c', fontWeight: 500 }}>No availability for this location.</div>
              ) : (
                <input
                  type="date"
                  name="dropoffDate"
                  value={form.dropoffDate || ''}
                  onChange={handleChange}
                  required
                  min={getAvailableDatesForLocation(form.dropoffLocation)[0]}
                  max={getAvailableDatesForLocation(form.dropoffLocation).slice(-1)[0]}
                  style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}
                  list="available-dates"
                />
              )}
              {/* Datalist for available dates (for browsers that support it) */}
              <datalist id="available-dates">
                {getAvailableDatesForLocation(form.dropoffLocation).map(date => (
                  <option key={date} value={date} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Drop-Off Time *</label>
              {/* Dropdown for available slots on selected date */}
              {form.dropoffDate ? (
                getSlotsForDate(form.dropoffLocation, form.dropoffDate).length === 0 ? (
                  <div style={{ color: '#b71c1c', fontWeight: 500 }}>No time slots available for this date.</div>
                ) : (
                  <select name="dropoffSlotId" value={form.dropoffSlotId} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}>
                    <option value="">Select a time slot...</option>
                    {getSlotsForDate(form.dropoffLocation, form.dropoffDate).map(slot => (
                      <option key={slot._id} value={slot._id}>{slot.startTime} - {slot.endTime}</option>
                    ))}
                  </select>
                )
              ) : (
                <div style={{ color: '#888' }}>Select a date first</div>
              )}
            </div>
          </div>
          {/* 30-min window selection (if needed) */}
          {form.dropoffSlotId && (() => {
            const slot = getSlotsForLocation(form.dropoffLocation).find(s => s._id === form.dropoffSlotId);
            if (!slot) return null;
            const windows = getThirtyMinWindows(slot.startTime, slot.endTime);
            return (
              <select name="dropoffWindow" value={form.dropoffWindow || ''} onChange={handleChange} required style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}>
                <option value="">Select 30-min window...</option>
                {windows.map(w => (
                  <option key={w} value={w}>{slot.date} | {w}</option>
                ))}
              </select>
            );
          })()}
        </div>
        {/* 5. Additional Notes */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📝 5. Additional Notes</h3>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} style={{ width: '100%', padding: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white', resize: 'vertical' }} placeholder="Any special instructions, requests, or comments? (Optional)" />
        </div>
        {/* 6. Summary & Price Estimate */}
        <div style={{ backgroundColor: '#e8f5e8', padding: '1.5rem', borderRadius: '12px', border: '2px solid #4caf50', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2e7d32' }}>💰 6. Estimated Total</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2e7d32' }}>${priceDetails.total.toFixed(2)}</div>
          <ul style={{ color: '#2e7d32', fontSize: '1rem', margin: '1rem 0', padding: 0, listStyle: 'none', textAlign: 'left', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            <li><strong>Rackets:</strong></li>
            {rackets.map((r, idx) => (
              <li key={idx} style={{ marginLeft: '1.5rem', fontSize: '0.98rem' }}>
                {r.quantity} × {form.turnaroundTime === 'sameDay' ? '$35' : form.turnaroundTime === 'nextDay' ? '$30' : form.turnaroundTime === '3-5days' ? '$25' : '$0'} = <strong>${((parseInt(r.quantity) || 1) * priceDetails.basePrice).toFixed(2)}</strong>
              </li>
            ))}
            <li style={{ marginTop: '0.5rem' }}><strong>Subtotal:</strong> ${priceDetails.racketsSubtotal.toFixed(2)}</li>
            {form.ownString && <li>Own string: -$5.00 discount</li>}
            {form.grommetReplacement && <li>Grommet replacement: 4 FREE per racket, +$0.25 each additional</li>}
            {form.dropoffLocation === 'Door-to-Door (Delivery)' && <li>Drop-off Delivery: +$12.00</li>}
            {form.pickupLocation === 'Door-to-Door (Delivery)' && <li>Pickup Delivery: +$12.00</li>}
            {form.dropoffLocation === 'Door-to-Door (Delivery)' && form.pickupLocation === 'Door-to-Door (Delivery)' && <li>Both Delivery Discount: -$4.00</li>}
          </ul>
          <p style={{ color: '#2e7d32', fontSize: '0.9rem', marginTop: '0.5rem' }}>Payment is due at pick-up/delivery. We accept cash, e-transfer, and credit cards.</p>
        </div>
        {/* Submit Button */}
        <button type="submit" disabled={status === 'loading'} style={{ padding: '1rem 2rem', backgroundColor: status === 'loading' ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', background: status === 'loading' ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', boxShadow: status === 'loading' ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)' }}>
          {status === 'loading' ? '📤 Submitting...' : '📤 Submit Booking'}
        </button>
        {/* Status Messages */}
        {status === 'success' && (
          <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', border: '1px solid #c3e6cb' }}>
            ✅ Booking submitted successfully! We&apos;ll contact you soon to confirm details.
          </div>
        )}
        {status === 'error' && (
          <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', textAlign: 'center', border: '1px solid #f5c6cb' }}>
            ❌ Error submitting booking. Please try again or contact us directly.
          </div>
        )}
      </form>
    </div>
  );
} 