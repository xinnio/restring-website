import LoginForm from '../../components/LoginForm';

export default function AdminLogin() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>Markham Restring Studio</h1>
          <p style={{ color: '#666' }}>Admin Access</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
} 