"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ isCollapsed, onToggle }) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/adminlogin');
  }

  return (
    <>
      {/* Toggle Button - shown when sidebar is collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed',
            top: '100px',
            left: '20px',
            zIndex: 1000,
            padding: '12px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <nav style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem', 
        padding: '1.5rem', 
        borderRight: '1px solid #dee2e6', 
        minWidth: isCollapsed ? 0 : 220,
        maxWidth: isCollapsed ? 0 : 280,
        backgroundColor: 'white',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: isCollapsed ? 0 : 1,
        transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)'
      }}>
        {/* Toggle Button - shown when sidebar is expanded */}
        {!isCollapsed && (
          <button
            onClick={onToggle}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>
        )}

        <div style={{ marginBottom: '1rem', marginTop: isCollapsed ? 0 : '2rem' }}>
          <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Admin Panel</h3>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Markham Restring Studio
          </div>
        </div>
        
        <Link href="/admindashboard" style={{ 
          textDecoration: 'none', 
          color: '#333', 
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📊 Dashboard
        </Link>
        
        <Link href="/analytics" style={{ 
          textDecoration: 'none', 
          color: '#333', 
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📈 Analytics
        </Link>
        
        <Link href="/inventorymanager" style={{ 
          textDecoration: 'none', 
          color: '#333', 
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🧵 Inventory Manager
        </Link>
        
        <Link href="/availabilitymanager" style={{ 
          textDecoration: 'none', 
          color: '#333', 
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📅 Availability Manager
        </Link>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #dee2e6' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </nav>
    </>
  );
} 