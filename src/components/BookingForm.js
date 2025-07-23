"use client";

import React, { useState, useEffect, useCallback } from 'react';

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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Add state for multiple racket/string combos
  const [rackets, setRackets] = useState([
    { racketType: '', stringName: '', stringColor: '', stringTension: '', tensionMethod: 'custom', quantity: 1, stringBrand: '', stringModel: '' }
  ]);

  // Add state for discount functionality
  const [discountCode, setDiscountCode] = useState('');
  const [activeNotice, setActiveNotice] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');

  // Add state for coupon code functionality
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponDetails, setCouponDetails] = useState(null);

  // --- Fetch inventory and availability ---
  const fetchStrings = useCallback(async () => {
      try {
        const res = await fetch('/api/strings');
        const data = await res.json();
        setStrings(data);
      } catch (error) {
        console.error('Error fetching strings:', error);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchStrings();
  }, [fetchStrings]);

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

  // Fetch active notice for discount information
  useEffect(() => {
    async function fetchActiveNotice() {
      try {
        const res = await fetch('/api/notices?active=true');
        if (res.ok) {
          const notice = await res.json();
          if (notice && notice.isActive) {
            // Check if notice has expired
            if (notice.expiresAt) {
              const expirationDate = new Date(notice.expiresAt);
              const now = new Date();
              if (now > expirationDate) {
                return; // Notice has expired
              }
            }
            setActiveNotice(notice);
          }
        }
      } catch (error) {
        console.error('Error fetching active notice:', error);
      }
    }
    fetchActiveNotice();
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
    setRackets(rackets => rackets.map((r, i) => {
      if (i === idx) {
        const updatedRacket = { ...r, [name]: value };
        
        // If string name or color changed, update string details
        if (name === 'stringName' || name === 'stringColor') {
          const stringDetails = getStringDetails(updatedRacket.racketType, updatedRacket.stringName, updatedRacket.stringColor);
          if (stringDetails) {
            updatedRacket.stringBrand = stringDetails.brand || '';
            updatedRacket.stringModel = stringDetails.model || '';
          } else {
            updatedRacket.stringBrand = '';
            updatedRacket.stringModel = '';
          }
        }
        
        return updatedRacket;
      }
      return r;
    }));
  }
  function handleAddRacket() {
    setRackets(rackets => [...rackets, { racketType: '', stringName: '', stringColor: '', stringTension: '', tensionMethod: 'custom', quantity: 1, stringBrand: '', stringModel: '' }]);
  }
  function handleRemoveRacket(idx) {
    setRackets(rackets => rackets.filter((_, i) => i !== idx));
  }

  function handleTensionMethodChange(idx, method) {
    setRackets(rackets => rackets.map((r, i) => {
      if (i === idx) {
        return { ...r, tensionMethod: method, stringTension: '' };
      }
      return r;
    }));
  }

  function getTensionOptions(racketType) {
    if (racketType === 'tennis') {
      return [
        { value: 'beginner', label: 'Beginner (50-54 lbs)', description: 'More power, comfort, less shock' },
        { value: 'intermediate', label: 'Intermediate (52-58 lbs)', description: 'Balanced control and power' },
        { value: 'advanced', label: 'Advanced (55-62 lbs)', description: 'More control and spin' },
        { value: 'arm_sensitive', label: 'Arm Sensitive (45-52 lbs)', description: 'Less vibration, softer feel' }
      ];
    } else if (racketType === 'badminton') {
      return [
        { value: 'beginner', label: 'Beginner (18-22 lbs)', description: 'Larger sweet spot, easy power' },
        { value: 'intermediate', label: 'Intermediate (22-26 lbs)', description: 'Better control and feel' },
        { value: 'advanced', label: 'Advanced (26-30 lbs)', description: 'More accuracy and power transfer' },
        { value: 'arm_comfort', label: 'Arm Comfort (20-24 lbs)', description: 'Softer impact, less stress' }
      ];
    }
    return [];
  }

  // --- Inventory Filtering ---
  // Returns grouped strings for a given racket type with Brand-Model display format
  function getGroupedStringsForType(racketType) {
    if (!racketType) return {};
    const filtered = strings.filter(s => s.type === racketType && s.quantity > 0);
    return filtered.reduce((acc, s) => {
      // Create Brand-Model display name
      const displayName = s.stringBrand && s.stringModel 
        ? `${s.stringBrand}-${s.stringModel}` 
        : s.name; // Fallback to original name if brand/model not available
      
      if (!acc[displayName]) acc[displayName] = [];
      acc[displayName].push(s);
      return acc;
    }, {});
  }
  // Returns available colors for a given racket type and string name
  function getAvailableColors(racketType, stringName) {
    const grouped = getGroupedStringsForType(racketType);
    return stringName && grouped[stringName] ? grouped[stringName].map(s => s.color) : [];
  }

  // Get string details (brand and model) for a selected string
  function getStringDetails(racketType, stringName, stringColor) {
    if (!racketType || !stringName) return null;
    const grouped = getGroupedStringsForType(racketType);
    if (!grouped[stringName]) return null;
    
    // If color is specified, find the specific variant
    if (stringColor) {
      const variant = grouped[stringName].find(s => s.color === stringColor);
      return variant ? { brand: variant.stringBrand, model: variant.stringModel } : null;
    }
    
    // If no color specified, return the first variant's details
    const firstVariant = grouped[stringName][0];
    return firstVariant ? { brand: firstVariant.stringBrand, model: firstVariant.stringModel } : null;
  }

  // Helper function to get the original string name from display name
  function getOriginalStringName(racketType, displayName) {
    if (!racketType || !displayName) return null;
    const grouped = getGroupedStringsForType(racketType);
    if (!grouped[displayName]) return null;
    
    // Return the original name from the first variant
    const firstVariant = grouped[displayName][0];
    return firstVariant ? firstVariant.name : null;
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

  // --- Discount Functions ---
  function handleDiscountCodeChange(e) {
    setDiscountCode(e.target.value);
    setDiscountError('');
    if (discountApplied) {
      setDiscountApplied(false);
    }
  }

  function applyDiscount() {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    if (!activeNotice || !activeNotice.discountCode) {
      setDiscountError('No active discount available');
      return;
    }

    if (discountCode.trim().toUpperCase() === activeNotice.discountCode.toUpperCase()) {
      // Check if threshold-based discount applies
      if (activeNotice.discountType === 'threshold') {
        const currentTotal = calculatePriceBreakdown().subtotalBeforeDiscount;
        if (currentTotal < activeNotice.discountThreshold) {
          setDiscountError(`Order must be at least $${activeNotice.discountThreshold} to apply this discount`);
          setDiscountApplied(false);
          return;
        }
      }
      
      setDiscountApplied(true);
      setDiscountError('');
    } else {
      setDiscountError('Invalid discount code');
      setDiscountApplied(false);
    }
  }

  function removeDiscount() {
    setDiscountApplied(false);
    setDiscountCode('');
    setDiscountError('');
  }

  // Coupon code handlers
  function handleCouponCodeChange(e) {
    setCouponCode(e.target.value);
    if (couponError) setCouponError('');
  }

  function applyCoupon() {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Check if the coupon code matches any active notice
    if (!activeNotice || activeNotice.discountCode !== couponCode.trim().toUpperCase()) {
      setCouponError('Invalid coupon code. Please try again.');
      return;
    }

    // Check if coupon is applicable based on notice conditions
    let isApplicable = true;
    let errorMessage = '';

    // Check minimum order value if threshold is set
    if (activeNotice.discountThreshold && activeNotice.discountThreshold > 0) {
      const priceDetails = calculatePriceBreakdown();
      if (priceDetails.subtotalBeforeDiscount < activeNotice.discountThreshold) {
        isApplicable = false;
        errorMessage = `This coupon requires a minimum order of $${activeNotice.discountThreshold}`;
      }
    }

    // Check racket quantity if specified in notice
    if (activeNotice.minRackets && activeNotice.minRackets > 0) {
      const totalRackets = rackets.reduce((sum, r) => sum + (parseInt(r.quantity) || 1), 0);
      if (totalRackets < activeNotice.minRackets) {
        isApplicable = false;
        errorMessage = `This coupon requires ${activeNotice.minRackets} or more rackets`;
      }
    }

    if (!isApplicable) {
      setCouponError(errorMessage);
      return;
    }

    // Create coupon details from the active notice
    const couponDetails = {
      type: activeNotice.discountType || 'percentage',
      value: activeNotice.discountValue || 0,
      description: activeNotice.discountDescription || `${activeNotice.discountValue}% off`,
      threshold: activeNotice.discountThreshold || 0,
      minRackets: activeNotice.minRackets || 0
    };

    setCouponApplied(true);
    setCouponDetails(couponDetails);
    setCouponError('');
  }

  function removeCoupon() {
    setCouponApplied(false);
    setCouponCode('');
    setCouponDetails(null);
    setCouponError('');
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
    
    // Calculate subtotal before discount
    const subtotalBeforeDiscount = racketsSubtotal + extras + deliveryFee;
    
    // Apply discount if valid code is entered
    let discountAmount = 0;
    if (discountApplied && activeNotice && activeNotice.discountValue > 0) {
      switch (activeNotice.discountType) {
        case 'percentage':
          discountAmount = (subtotalBeforeDiscount * activeNotice.discountValue) / 100;
          break;
        case 'fixed':
          discountAmount = Math.min(activeNotice.discountValue, subtotalBeforeDiscount);
          break;
        case 'threshold':
          if (subtotalBeforeDiscount >= activeNotice.discountThreshold) {
            discountAmount = Math.min(activeNotice.discountValue, subtotalBeforeDiscount);
          }
          break;
        default:
          // Fallback to percentage for backward compatibility
          discountAmount = (subtotalBeforeDiscount * activeNotice.discountValue) / 100;
      }
    }
    
    // Apply coupon discount if valid coupon is applied
    let couponAmount = 0;
    if (couponApplied && couponDetails) {
      switch (couponDetails.type) {
        case 'percentage':
          couponAmount = (subtotalBeforeDiscount * couponDetails.value) / 100;
          break;
        case 'fixed':
          couponAmount = Math.min(couponDetails.value, subtotalBeforeDiscount);
          break;
        case 'delivery':
          // Free delivery up to the coupon value
          couponAmount = Math.min(couponDetails.value, deliveryFee);
          break;
        default:
          couponAmount = 0;
      }
    }
    
    const total = subtotalBeforeDiscount - discountAmount - couponAmount;
    
    return {
      basePrice,
      racketsSubtotal,
      extras,
      deliveryFee,
      subtotalBeforeDiscount,
      discountAmount,
      discountType: discountApplied && activeNotice ? activeNotice.discountType : null,
      discountValue: discountApplied && activeNotice ? activeNotice.discountValue : 0,
      discountThreshold: activeNotice ? activeNotice.discountThreshold : 0,
      couponAmount,
      couponType: couponApplied && couponDetails ? couponDetails.type : null,
      couponValue: couponApplied && couponDetails ? couponDetails.value : 0,
      total,
    };
  }
  const priceDetails = calculatePriceBreakdown();

  // --- Submit ---
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    
    // Prepare rackets data - clear string info if own string is selected
    const processedRackets = form.ownString 
      ? rackets.map(r => ({ ...r, stringName: '', stringColor: '' }))
      : rackets.map(r => {
          // Convert display name back to original string name for storage
          const originalStringName = getOriginalStringName(r.racketType, r.stringName);
          return {
            ...r,
            stringName: originalStringName || r.stringName // Fallback to display name if original not found
          };
        });
    
    // Get formatted time strings for dropoff and pickup
    const getFormattedTime = (slotId, location) => {
      if (!slotId) return '';
      const slot = getSlotsForLocation(location).find(s => s.id === slotId);
      if (!slot) return '';
      
      // Format as DD/MM/YYYY, HH:mm - HH:mm
      const date = new Date(slot.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}, ${slot.startTime} - ${slot.endTime}`;
    };
    
    const dropoffTime = getFormattedTime(form.dropoffSlotId, form.dropoffLocation);
    const pickupTime = getFormattedTime(form.pickupSlotId, form.pickupLocation);
    
    // DEBUG: Log what is being sent
    console.log('BookingForm SUBMIT payload:', { ...form, rackets: processedRackets, dropoffTime, pickupTime });
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rackets: processedRackets, dropoffTime, pickupTime, agreeToTerms }),
      });
      if (res.ok) {
        const result = await res.json();
        setStatus('success');
        setForm({
          fullName: '', email: '', phone: '', racketType: '', stringName: '', stringColor: '', stringTension: '', ownString: false, grommetReplacement: false, turnaroundTime: '', dropoffLocation: '', dropoffSlotId: '', pickupLocation: '', pickupSlotId: '', notes: '',
        });
        
        // Redirect to success page in new window with booking number
        const successUrl = `/booking-success?email=${encodeURIComponent(form.email)}&bookingNumber=${result.bookingNumber}`;
        window.open(successUrl, '_blank');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // --- UI ---
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: 'clamp(1rem, 4vw, 2rem)', 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
      border: '1px solid rgba(0,0,0,0.08)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-h2)', fontWeight: '700', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Book Your Stringing Service
        </h2>
        <p style={{ color: '#666', fontSize: 'var(--font-size-body-large)', lineHeight: '1.6' }}>
          Professional racket stringing with quality strings and expert care.
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 1. Personal Information */}
        <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📋 1. Personal Information</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'clamp(1rem, 2vw, 1.5rem)'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: 'var(--font-size-label)' }}>Full Name *</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: 'var(--font-size-input)', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }} placeholder="Enter your full name" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: 'var(--font-size-label)' }}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: 'var(--font-size-input)', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }} placeholder="your.email@example.com" />
              <small style={{ color: '#888' }}>Confirmation sent here</small>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: 'var(--font-size-label)' }}>Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: 'var(--font-size-input)', transition: 'border-color 0.2s ease', boxSizing: 'border-box' }} placeholder="(123) 456-7890" />
              <small style={{ color: '#888' }}>For pickup/drop-off coordination</small>
            </div>
          </div>
        </div>
        {/* 2. Racket & String Details */}
        <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>🔍 2. Racket & String Details</h3>
          
          {/* Own String Option */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <input type="checkbox" name="ownString" checked={form.ownString} onChange={handleChange} style={{ marginRight: '0.75rem' }} />
              <label style={{ fontWeight: '600', color: '#333', fontSize: 'var(--font-size-body-large)', cursor: 'pointer' }}>
                I will provide my own string (-$5.00 discount)
              </label>
            </div>
            {form.ownString && (
              <div style={{ 
                background: 'linear-gradient(90deg, #e8f5e8 60%, #f0f9ff 100%)', 
                border: '1.5px solid #4caf50', 
                borderRadius: 12, 
                padding: '1rem 1.5rem', 
                marginBottom: '1rem', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 12 
              }}>
                <span style={{ fontSize: '1.2rem', color: '#4caf50', marginTop: '0.1rem' }}>ℹ️</span>
                <div style={{ fontSize: '0.95rem', color: '#2e7d32', lineHeight: '1.5' }}>
                  <strong>Important:</strong> If you provide your own string, we will only charge for the labor. In the event that the string breaks during the stringing process, we will replace it free of charge using a similar string from our inventory with comparable performance and color.
                </div>
              </div>
            )}
          </div>
          
          {rackets.map((r, idx) => (
            <div key={`racket-${idx}-${r.racketType || 'default'}`} style={{ marginBottom: '2rem', borderBottom: idx < rackets.length - 1 ? '1px solid #e9ecef' : 'none', paddingBottom: '1.5rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: 'clamp(1rem, 2vw, 1.5rem)', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Racket Type *</label>
                  <select name="racketType" value={r.racketType} onChange={e => handleRacketChange(idx, e)} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option key="select-racket" value="">Select Racket Type...</option>
                    <option key="tennis" value="tennis">🎾 Tennis</option>
                    <option key="badminton" value="badminton">🏸 Badminton</option>
                  </select>
                </div>
                {!form.ownString && (
                  <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>String Type *</label>
                      <select name="stringName" value={r.stringName} onChange={e => handleRacketChange(idx, e)} required={!form.ownString} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option key="select-string" value="">Select String...</option>
                    {Object.keys(getGroupedStringsForType(r.racketType)).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  
                  {/* String Details Display - Show when string is selected */}
                  {r.stringName && getStringDetails(r.racketType, r.stringName, r.stringColor) && (
                    <div style={{ 
                      marginTop: '0.75rem',
                      background: 'linear-gradient(90deg, #e8f5e8 60%, #f0f9ff 100%)', 
                      border: '1.5px solid #4caf50', 
                      borderRadius: 8, 
                      padding: '0.75rem 1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8 
                    }}>
                      <span style={{ fontSize: '1rem', color: '#4caf50' }}>ℹ️</span>
                      <div style={{ fontSize: '0.9rem', color: '#2e7d32', lineHeight: '1.4' }}>
                        <strong>Selected:</strong> {r.stringName}
                        {getStringDetails(r.racketType, r.stringName, r.stringColor)?.brand && getStringDetails(r.racketType, r.stringName, r.stringColor)?.model && (
                          <span> • Original: <strong>{getStringDetails(r.racketType, r.stringName, r.stringColor)?.brand} {getStringDetails(r.racketType, r.stringName, r.stringColor)?.model}</strong></span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>String Color</label>
                      <select name="stringColor" value={r.stringColor} onChange={e => handleRacketChange(idx, e)} style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option key="select-color" value="">Select Color...</option>
                    {(r.stringName && getAvailableColors(r.racketType, r.stringName)) ? getAvailableColors(r.racketType, r.stringName).map(color => (
                      <option key={color} value={color}>{color}</option>
                    )) : null}
                  </select>
                  <small style={{ color: '#888' }}>Optional (based on available stock)</small>
                </div>
                

                  </>
                )}
                {form.ownString && (
                  <div style={{ 
                    gridColumn: 'span 2',
                    background: 'linear-gradient(90deg, #e8f5e8 60%, #f0f9ff 100%)', 
                    border: '1.5px solid #4caf50', 
                    borderRadius: 12, 
                    padding: '1rem 1.5rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12 
                  }}>
                    <span style={{ fontSize: '1.2rem', color: '#4caf50' }}>🎾</span>
                    <div style={{ fontSize: '0.95rem', color: '#2e7d32', lineHeight: '1.5' }}>
                      <strong>Own String Selected:</strong> You will provide your own string. No string selection needed.
                    </div>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>String Tension (lbs) *</label>
                  
                  {/* Tension Method Selection */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input 
                          type="radio" 
                          name={`tensionMethod-${idx}`} 
                          checked={r.tensionMethod === 'custom'} 
                          onChange={() => handleTensionMethodChange(idx, 'custom')}
                          style={{ marginRight: '0.5rem' }}
                        />
                        Custom Tension
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input 
                          type="radio" 
                          name={`tensionMethod-${idx}`} 
                          checked={r.tensionMethod === 'level'} 
                          onChange={() => handleTensionMethodChange(idx, 'level')}
                          style={{ marginRight: '0.5rem' }}
                        />
                        Choose by Play Level
                      </label>
                    </div>
                  </div>

                  {/* Custom Tension Input */}
                  {r.tensionMethod === 'custom' && (
                    <div>
                      <input 
                        type="text" 
                        name="stringTension" 
                        value={r.stringTension} 
                        onChange={e => handleRacketChange(idx, e)} 
                        required 
                        placeholder="e.g., 25, 28-30, 22 lbs"
                        style={{ 
                          width: '100%', 
                          padding: '0.875rem', 
                          border: '2px solid #e9ecef', 
                          borderRadius: '8px', 
                          fontSize: '0.875rem', 
                          transition: 'border-color 0.2s ease', 
                          backgroundColor: 'white', 
                          boxSizing: 'border-box' 
                        }} 
                      />
                      <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                        Enter your desired tension (e.g., 25 lbs, 28-30 lbs, or specific range)
                      </small>
                    </div>
                  )}

                  {/* Play Level Selection */}
                  {r.tensionMethod === 'level' && r.racketType && (
                    <div>
                      <select 
                        name="stringTension" 
                        value={r.stringTension} 
                        onChange={e => handleRacketChange(idx, e)} 
                        required
                        style={{ 
                          width: '100%', 
                          padding: '0.875rem', 
                          border: '2px solid #e9ecef', 
                          borderRadius: '8px', 
                          fontSize: '0.875rem', 
                          transition: 'border-color 0.2s ease', 
                          backgroundColor: 'white', 
                          boxSizing: 'border-box' 
                        }}
                      >
                        <option key="select-level" value="">Select your play level...</option>
                        {getTensionOptions(r.racketType).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                  </select>
                      {r.stringTension && (
                        <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                          {getTensionOptions(r.racketType).find(opt => opt.value === r.stringTension)?.description}
                        </small>
                      )}
                    </div>
                  )}

                  {/* Message when no racket type selected for level method */}
                  {r.tensionMethod === 'level' && !r.racketType && (
                    <div style={{ 
                      padding: '0.875rem', 
                      border: '2px solid #e9ecef', 
                      borderRadius: '8px', 
                      backgroundColor: '#f8f9fa',
                      color: '#666',
                      fontSize: '0.875rem',
                      textAlign: 'center'
                    }}>
                      Please select a racket type first to see play level options
                    </div>
                  )}
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
        <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          {/* Same-Day Service Warning */}
          <div style={{ background: 'linear-gradient(90deg, #fef9c3 60%, #f8fafc 100%)', border: '1.5px solid #fde68a', borderRadius: 12, padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', color: '#f59e42' }}>⚡</span>
            <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: '#b45309', fontWeight: 600 }}>Same-Day Service: Book before 2:00 AM for same-day pick-up</span>
          </div>
          {/* Modern card selection for turnaround time */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '0.8rem',
            marginBottom: '2rem' 
          }}>
            {/* Same Day Service Card */}
            <div
              onClick={() => setForm(f => ({ ...f, turnaroundTime: 'sameDay' }))}
              style={{
                border: form.turnaroundTime === 'sameDay' ? '2.5px solid #6c63ff' : '1.5px solid #e9ecef',
                borderRadius: '18px',
                background: form.turnaroundTime === 'sameDay'
                  ? 'linear-gradient(135deg, #f5f7ff 60%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #f8f9fa 100%)',
                boxShadow: form.turnaroundTime === 'sameDay'
                  ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)'
                  : '0 1.5px 8px rgba(0,0,0,0.06)',
                padding: '0.5rem 0.3rem 0.4rem 0.3rem',
                position: 'relative',
                transition: 'border 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s',
                textAlign: 'center',
                outline: 'none',
                transform: form.turnaroundTime === 'sameDay' ? 'scale(1.045)' : 'scale(1)',
                width: '100%',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                zIndex: form.turnaroundTime === 'sameDay' ? 2 : 1,
                cursor: 'pointer',
              }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, turnaroundTime: 'sameDay' }))}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 6px rgba(102,99,255,0.15), 0 1px 3px rgba(108,99,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = form.turnaroundTime === 'sameDay' ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)' : '0 1.5px 8px rgba(0,0,0,0.06)'}
            >
              <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.15rem' }}>⚡</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.12rem', letterSpacing: '0.01em' }}>Same Day Service</div>
              <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.12rem' }}>$35</div>
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
                cursor: 'pointer',
                border: form.turnaroundTime === 'nextDay' ? '2.5px solid #6c63ff' : '1.5px solid #e9ecef',
                borderRadius: '18px',
                background: form.turnaroundTime === 'nextDay'
                  ? 'linear-gradient(135deg, #f5f7ff 60%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #f8f9fa 100%)',
                boxShadow: form.turnaroundTime === 'nextDay'
                  ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)'
                  : '0 1.5px 8px rgba(0,0,0,0.06)',
                padding: '0.5rem 0.3rem 0.4rem 0.3rem',
                position: 'relative',
                transition: 'border 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s',
                textAlign: 'center',
                outline: 'none',
                transform: form.turnaroundTime === 'nextDay' ? 'scale(1.045)' : 'scale(1)',
                width: '100%',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, turnaroundTime: 'nextDay' }))}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(102,99,255,0.18), 0 2px 10px rgba(108,99,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = form.turnaroundTime === 'nextDay' ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)' : '0 1.5px 8px rgba(0,0,0,0.06)'}
            >
              <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.15rem' }}>🚀</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.12rem', letterSpacing: '0.01em' }}>Next Day Service</div>
              <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.12rem' }}>$30</div>
            </div>
            {/* 3-5 Day Service Card */}
            <div
              onClick={() => setForm(f => ({ ...f, turnaroundTime: '3-5days' }))}
              style={{
                cursor: 'pointer',
                border: form.turnaroundTime === '3-5days' ? '2.5px solid #6c63ff' : '1.5px solid #e9ecef',
                borderRadius: '18px',
                background: form.turnaroundTime === '3-5days'
                  ? 'linear-gradient(135deg, #f5f7ff 60%, #e0e7ff 100%)'
                  : 'linear-gradient(135deg, #fff 60%, #f8f9fa 100%)',
                boxShadow: form.turnaroundTime === '3-5days'
                  ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)'
                  : '0 1.5px 8px rgba(0,0,0,0.06)',
                padding: '0.5rem 0.3rem 0.4rem 0.3rem',
                position: 'relative',
                transition: 'border 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s',
                textAlign: 'center',
                outline: 'none',
                transform: form.turnaroundTime === '3-5days' ? 'scale(1.045)' : 'scale(1)',
                width: '100%',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setForm(f => ({ ...f, turnaroundTime: '3-5days' }))}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(102,99,255,0.18), 0 2px 10px rgba(108,99,255,0.10)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = form.turnaroundTime === '3-5days' ? '0 4px 16px rgba(102,99,255,0.13), 0 1.5px 8px rgba(108,99,255,0.08)' : '0 1.5px 8px rgba(0,0,0,0.06)'}
            >
              <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.15rem' }}>📅</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.12rem', letterSpacing: '0.01em' }}>3-5 Day Service</div>
              <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.12rem' }}>$25</div>
            </div>
          </div>
          {/* Grommet Replacement Option */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <input type="checkbox" name="grommetReplacement" checked={form.grommetReplacement} onChange={handleChange} style={{ marginRight: '0.75rem' }} />
            <label style={{ fontWeight: '500', color: '#333', fontSize: '0.95rem', cursor: 'pointer' }}>
              Add grommet replacement (4 FREE per racket, +$0.25 each additional)
            </label>
          </div>
        </div>
        {/* 4. Drop-Off / Pick-Up Scheduling */}
        <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📍 4. Drop-Off / Pickup Scheduling</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'clamp(1rem, 2vw, 1.5rem)', 
            marginBottom: '1.5rem' 
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Drop-Off Location *</label>
              <select name="dropoffLocation" value={form.dropoffLocation} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', transition: 'border-color 0.2s ease', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option key="select-dropoff" value="">Select Location...</option>
                <option key="markham-studio" value="Markham Studio">🏠 Markham Studio</option>
                <option key="wiser-park" value="Wiser Park Tennis Courts">🎾 Wiser Park Tennis Courts - Markham, ON L6E 1H8</option>
                <option key="angus-glen" value="Angus Glen Community Centre">🏢 Angus Glen Community Centre (Library) - 3970 Major Mackenzie Dr E, Markham, ON L6C 1P8</option>
                <option key="door-to-door" value="Door-to-Door (Delivery)">🚗 Door-to-Door (Delivery) (+$12.00)</option>
              </select>
              
              {/* Location Links */}
              {form.dropoffLocation === 'Wiser Park Tennis Courts' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a 
                    href="https://maps.app.goo.gl/AcuokCBYds1XjqAX8?g_st=ipc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#667eea', 
                      textDecoration: 'none', 
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#e3f2fd';
                      e.target.style.borderColor = '#667eea';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.borderColor = '#e9ecef';
                    }}
                  >
                    📍 View on Google Maps
                  </a>
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.95rem' }}>Pick-up Location *</label>
              <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}>
                <option key="select-pickup" value="">Select Location...</option>
                <option key="markham-studio-pickup" value="Markham Studio">🏠 Markham Studio</option>
                <option key="wiser-park-pickup" value="Wiser Park Tennis Courts">🎾 Wiser Park Tennis Courts - Markham, ON L6E 1H8</option>
                <option key="angus-glen-pickup" value="Angus Glen Community Centre">🏢 Angus Glen Community Centre (Library) - 3970 Major Mackenzie Dr E, Markham, ON L6C 1P8</option>
                <option key="door-to-door-pickup" value="Door-to-Door (Delivery)">🚗 Door-to-Door (Delivery) (+$12.00)</option>
              </select>
              
              {/* Location Links for Pickup */}
              {form.pickupLocation === 'Wiser Park Tennis Courts' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a 
                    href="https://maps.app.goo.gl/AcuokCBYds1XjqAX8?g_st=ipc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#667eea', 
                      textDecoration: 'none', 
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#e3f2fd';
                      e.target.style.borderColor = '#667eea';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.borderColor = '#e9ecef';
                    }}
                  >
                    📍 View on Google Maps
                  </a>
                </div>
              )}
              
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'clamp(1rem, 2vw, 1.5rem)', 
            marginBottom: '1.5rem' 
          }}>
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
                  min={new Date().toISOString().split('T')[0]}
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
                    <option key="select-timeslot" value="">Select a time slot...</option>
                    {getSlotsForDate(form.dropoffLocation, form.dropoffDate).map(slot => (
                                              <option key={slot.id} value={slot.id}>{slot.startTime} - {slot.endTime}</option>
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
            const slot = getSlotsForLocation(form.dropoffLocation).find(s => s.id === form.dropoffSlotId);
            if (!slot) return null;
            const windows = getThirtyMinWindows(slot.startTime, slot.endTime);
            return (
              <select name="dropoffWindow" value={form.dropoffWindow || ''} onChange={handleChange} required style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}>
                <option key="select-window" value="">Select 30-min window...</option>
                {windows.map(w => (
                  <option key={w} value={w}>{slot.date} | {w}</option>
                ))}
              </select>
            );
          })()}
        </div>
        {/* 5. Additional Notes */}
        <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📝 5. Additional Notes</h3>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} style={{ width: '100%', padding: '1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white', resize: 'vertical' }} placeholder="Any special instructions, requests, or comments? (Optional)" />
        </div>

        {/* 6. Discount Code */}
        {activeNotice && activeNotice.discountPercentage > 0 && (
          <div style={{ backgroundColor: '#fff3cd', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '2px solid #ffc107' }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#856404' }}>🎫 6. Discount Code</h3>
            <div style={{ 
              background: 'linear-gradient(90deg, #fff3cd 60%, #ffeaa7 100%)', 
              border: '1.5px solid #ffc107', 
              borderRadius: 12, 
              padding: '1rem 1.5rem', 
              marginBottom: '1.5rem', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 12 
            }}>
              <span style={{ fontSize: '1.2rem', color: '#856404', marginTop: '0.1rem' }}>💰</span>
              <div style={{ fontSize: '0.95rem', color: '#856404', lineHeight: '1.5' }}>
                <strong>Special Offer:</strong> {activeNotice.message}
                {activeNotice.discountCode && (
                  <span style={{ fontWeight: 'bold', marginLeft: '0.5rem' }}>
                    Use code: <span style={{ 
                      background: '#856404', 
                      color: '#fff3cd', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}>
                      {activeNotice.discountCode}
                    </span>
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#856404', fontSize: '0.95rem' }}>
                  Enter Discount Code
                </label>
                <input 
                  type="text" 
                  value={discountCode} 
                  onChange={handleDiscountCodeChange}
                  placeholder="Enter your discount code"
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem', 
                    border: discountError ? '2px solid #dc3545' : '2px solid #ffc107', 
                    borderRadius: '8px', 
                    fontSize: '0.875rem', 
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
                {discountError && (
                  <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    {discountError}
                  </div>
                )}
              </div>
              {!discountApplied ? (
                <button
                  type="button"
                  onClick={applyDiscount}
                  style={{
                    padding: '0.875rem 1.5rem',
                    backgroundColor: '#ffc107',
                    color: '#856404',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Apply
                </button>
              ) : (
                <button
                  type="button"
                  onClick={removeDiscount}
                  style={{
                    padding: '0.875rem 1.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            
            {discountApplied && (
              <div style={{ 
                background: '#d4edda', 
                border: '1.5px solid #28a745', 
                borderRadius: 8, 
                padding: '1rem', 
                marginTop: '1rem',
                color: '#155724',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                ✅ Discount applied! You&apos;ll save {
                  activeNotice.discountType === 'percentage' 
                    ? `${activeNotice.discountValue}%` 
                    : activeNotice.discountType === 'fixed' 
                    ? `$${activeNotice.discountValue}` 
                    : activeNotice.discountType === 'threshold' 
                    ? `$${activeNotice.discountValue} (on orders over $${activeNotice.discountThreshold})` 
                    : `${activeNotice.discountValue}%`
                } on your order.
              </div>
            )}
          </div>
        )}

        {/* Coupon Code Section */}
        <div style={{ backgroundColor: '#fff3cd', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #ffeaa7' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#856404' }}>
            🎫 Coupon Code
          </h3>
          
          <div style={{ 
            background: '#fff8e1', 
            border: '1.5px solid #ffc107', 
            borderRadius: 12, 
            padding: '1.5rem', 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 12 
          }}>
            <span style={{ fontSize: '1.2rem', color: '#856404', marginTop: '0.1rem' }}>💡</span>
            <div style={{ fontSize: '0.95rem', color: '#856404', lineHeight: '1.5' }}>
              <strong>Coupon Codes:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                Enter a valid coupon code to receive a discount on your order. 
                Coupon codes are managed by our admin system and may have specific conditions 
                such as minimum order values or racket quantities.
              </p>
              {activeNotice && activeNotice.discountCode && (
                <div style={{ 
                  background: '#d4edda', 
                  border: '1px solid #28a745', 
                  borderRadius: '6px', 
                  padding: '0.75rem', 
                  marginTop: '0.75rem',
                  color: '#155724'
                }}>
                  <strong>Current Promotion:</strong> Use code <strong>{activeNotice.discountCode}</strong> for {activeNotice.discountDescription || `${activeNotice.discountValue}% off`}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#856404', fontSize: '0.95rem' }}>
                Enter Coupon Code
              </label>
              <input 
                type="text" 
                value={couponCode} 
                onChange={handleCouponCodeChange}
                placeholder="Enter your coupon code"
                style={{ 
                  width: '100%', 
                  padding: '0.875rem', 
                  border: couponError ? '2px solid #dc3545' : '2px solid #ffc107', 
                  borderRadius: '8px', 
                  fontSize: '0.875rem', 
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              />
              {couponError && (
                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {couponError}
                </div>
              )}
            </div>
            {!couponApplied ? (
              <button
                type="button"
                onClick={applyCoupon}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#ffc107',
                  color: '#856404',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Apply
              </button>
            ) : (
              <button
                type="button"
                onClick={removeCoupon}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Remove
              </button>
            )}
          </div>
          
          {couponApplied && (
            <div style={{ 
              background: '#d4edda', 
              border: '1.5px solid #28a745', 
              borderRadius: 8, 
              padding: '1rem', 
              marginTop: '1rem',
              color: '#155724',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              ✅ Coupon applied! {couponDetails.description}
            </div>
          )}
        </div>
        
        {/* 7. Summary & Price Estimate */}
        <div style={{ backgroundColor: '#e8f5e8', padding: '1.5rem', borderRadius: '12px', border: '2px solid #4caf50', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2e7d32' }}>💰 {activeNotice && activeNotice.discountPercentage > 0 ? '7' : '6'}. Estimated Total</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2e7d32' }}>${priceDetails.total.toFixed(2)}</div>
          <ul style={{ color: '#2e7d32', fontSize: '1rem', margin: '1rem 0', padding: 0, listStyle: 'none', textAlign: 'left', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            <li><strong>Rackets:</strong></li>
            {rackets.map((r, idx) => (
              <li key={`price-racket-${idx}-${r.racketType || 'default'}`} style={{ marginLeft: '1.5rem', fontSize: '0.98rem' }}>
                {r.quantity} × {form.turnaroundTime === 'sameDay' ? '$35' : form.turnaroundTime === 'nextDay' ? '$30' : form.turnaroundTime === '3-5days' ? '$25' : '$0'} = <strong>${((parseInt(r.quantity) || 1) * priceDetails.basePrice).toFixed(2)}</strong>
              </li>
            ))}
            <li style={{ marginTop: '0.5rem' }}><strong>Subtotal:</strong> ${priceDetails.racketsSubtotal.toFixed(2)}</li>
            {form.ownString && <li>Own string: -$5.00 discount</li>}
            {form.grommetReplacement && <li>Grommet replacement: 4 FREE per racket, +$0.25 each additional</li>}
            {form.dropoffLocation === 'Door-to-Door (Delivery)' && <li>Drop-off Delivery: +$12.00</li>}
            {form.pickupLocation === 'Door-to-Door (Delivery)' && <li>Pickup Delivery: +$12.00</li>}
            {form.dropoffLocation === 'Door-to-Door (Delivery)' && form.pickupLocation === 'Door-to-Door (Delivery)' && <li>Both Delivery Discount: -$4.00</li>}
            {priceDetails.discountAmount > 0 && (
              <li style={{ marginTop: '0.5rem' }}><strong>Discount:</strong> -${priceDetails.discountAmount.toFixed(2)}</li>
            )}
            {couponApplied && couponDetails && (
              <li style={{ marginTop: '0.5rem' }}><strong>Coupon ({couponCode.toUpperCase()}):</strong> -${priceDetails.couponAmount.toFixed(2)}</li>
            )}
          </ul>
          <p style={{ color: '#2e7d32', fontSize: '0.9rem', marginTop: '0.5rem' }}>Payment is due at pick-up/delivery. We currently accept cash only.</p>
        </div>
        
        {/* 8. Terms and Conditions */}
        <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(1rem, 3vw, 2rem)', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <h3 style={{ fontSize: 'var(--font-size-h3)', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a1a' }}>📋 {activeNotice && activeNotice.discountPercentage > 0 ? '8' : '7'}. Terms and Conditions</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input 
                type="checkbox" 
                checked={agreeToTerms} 
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <label style={{ fontWeight: '600', color: '#333', fontSize: '1rem', cursor: 'pointer' }}>
                  I agree to the Terms and Conditions <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                  By placing an order, you agree to our Terms and Conditions including booking, service, liability, and cancellation policies.
                  <button 
                    type="button"
                    onClick={() => setShowTerms(!showTerms)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#6c63ff', 
                      textDecoration: 'underline', 
                      cursor: 'pointer', 
                      fontSize: '0.9rem',
                      marginLeft: '0.5rem'
                    }}
                  >
                    {showTerms ? '[Hide Terms]' : '[View Terms]'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {showTerms && (
            <div style={{ 
              border: '1px solid #ccc', 
              padding: '1rem', 
              maxHeight: '300px', 
              overflow: 'auto', 
              fontSize: '0.875rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              lineHeight: '1.6'
            }}>
              <strong>Terms & Conditions</strong><br/><br/>

              <strong>1. Booking & Payment</strong><br/>
              • All orders must be placed online and confirmed before drop-off or pickup.<br/>
              • Payment is due at the time of drop-off or delivery. We currently accept cash only.<br/>
              • Same-day and next-day orders may include a small rush fee.<br/><br/>

              <strong>2. Providing Your Own String</strong><br/>
              • If you bring your own string, we only charge for labor (-$5 discount).<br/>
              • If your string breaks during stringing, we&apos;ll replace it free of charge using a similar string from our inventory (similar color and performance).<br/>
              • However, we are not responsible for replacing it with the original string you provided.<br/><br/>

              <strong>3. Turnaround Time</strong><br/>
              • Choose from: Same-Day, Next-Day, or 3–5 Business Days.<br/>
              • We always aim to meet your requested turnaround, but delays may occur during busy times. Thanks for your understanding!<br/><br/>

              <strong>4. Pickup & Delivery</strong><br/>
              • Pickup and delivery services are available for $12 each way.<br/>
              • You may mix and match your drop-off and pickup locations (e.g., home, park, community centre).<br/>
              • Please be on time for your appointment. Missed pickups or drop-offs may result in rescheduling.<br/><br/>

              <strong>5. Liability & Damages</strong><br/>
              • We handle every racket with care, but we are not responsible for damage caused by pre-existing cracks, worn grommets, or weakened frames.<br/>
              • If we notice any issues before stringing, we&apos;ll contact you. Grommet replacement may involve an extra fee.<br/>
              • We&apos;re not responsible for string breakage after service unless it&apos;s clearly due to our workmanship.<br/>
              • Please inspect your racket when you pick it up or receive it. Once the racket has been returned to you, we are not responsible for any issues reported afterward.<br/><br/>

              <strong>6. Cancellations</strong><br/>
              • Please cancel or reschedule your appointment at least 12 hours in advance.<br/>
              • Last-minute cancellations or no-shows may result in a fee.
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={status === 'loading' || !agreeToTerms} 
          style={{ 
            padding: 'clamp(0.875rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)', 
            backgroundColor: status === 'loading' || !agreeToTerms ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            background: status === 'loading' || !agreeToTerms ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', 
            fontWeight: '600', 
            cursor: status === 'loading' || !agreeToTerms ? 'not-allowed' : 'pointer', 
            transition: 'all 0.2s ease', 
            boxShadow: status === 'loading' || !agreeToTerms ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
            width: '100%',
            minHeight: '48px'
          }}
        >
          {status === 'loading' ? '📤 Submitting...' : '📤 Submit Booking'}
        </button>
        {/* Status Messages */}
        {status === 'success' && (
          <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', border: '1px solid #c3e6cb' }}>
            ✅ Booking submitted successfully! 📧 Confirmation emails sent to markhamrestring@gmail.com and {form.email}<br/>
            We&apos;ll contact you soon to confirm details and arrange pickup/drop-off.
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

export function generateId() {
  return (
    'id_' +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 9)
  );
}

const EMAIL_FROM = process.env.EMAIL_FROM;