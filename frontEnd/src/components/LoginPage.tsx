import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
      if (users[email]) {
        setError('An account with this email already exists');
        return;
      }

      // Store new user
      users[email] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after signup
      onLogin(email);
    } else {
      // Login
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      
      if (!users[email]) {
        setError('No account found with this email');
        return;
      }

      if (users[email].password !== password) {
        setError('Incorrect password');
        return;
      }

      onLogin(email);
    }
  };

  return (
    <div className="page-wrapper" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', backgroundColor:'white'}}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              backgroundColor: '#dbeafe', // matches blue-100
              borderRadius: '50%',
              marginBottom: '0.1rem',
            }}
          >
            {isSignUp ? (
              <UserPlus style={{ width: '32px', height: '32px', color: '#2563eb' }} />
            ) : (
              <LogIn style={{ width: '32px', height: '32px', color: '#2563eb' }} />
            )}
          </div>

          <h1 style={{ fontSize: '1.875rem', 
            fontWeight: 790, 
            marginBottom: '0.5rem', 
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '-0.025em' }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#4b5563',fontFamily: "'Montserrat', sans-serif"}}>
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.25rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle style={{ width: '20px', height: '20px', color: '#ea1616', flexShrink: 0, marginBottom: '0.1px', marginLeft:'0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: '#ea1616',fontFamily: "'Montserrat', sans-serif" }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem',textAlign: 'left',fontFamily: "'Montserrat', sans-serif"}}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.5rem',
                  borderRadius: '0.625rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#fcfcff',
                  outline: 'none',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem',textAlign:'left', fontFamily: "'Montserrat', sans-serif"}}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 2.5rem',
                  borderRadius: '0.625rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#fbfbff',
                  outline: 'none',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              />
            </div>
          </div>

          {/* Confirm Password for Sign Up */}
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem',textAlign:'left', fontFamily: "'Montserrat', sans-serif"}}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                    borderRadius: '0.625rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="button-primary" style={{ width: '100%', fontFamily: "'Montserrat', sans-serif"}}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Switch Sign In / Sign Up */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            style={{ color: '#2563eb', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
