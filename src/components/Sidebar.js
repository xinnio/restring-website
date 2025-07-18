"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/adminlogin');
  }

  return (
    <nav style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem', 
      padding: '1.5rem', 
      borderRight: '1px solid #dee2e6', 
      minWidth: 250,
      backgroundColor: 'white',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '1rem' }}>
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
  );
} 