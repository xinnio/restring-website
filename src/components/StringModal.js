import React from 'react';

export default function StringModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}>
        <h2>Edit String</h2>
        <p>String edit form coming soon...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
} 