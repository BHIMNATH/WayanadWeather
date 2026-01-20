import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Login Page Component
 * Secure authentication interface for the Wayanad Weather system.
 * Handles role-based access control (RBAC) and credentials verification.
 */
export const Login = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const defaultAdmin = { email: 'admin@weather.com', password: 'admin123', role: 'Admin', name: 'Super Admin' };
        const allUsers = savedUsers.length > 0 ? savedUsers : [defaultAdmin];

        const foundUser = allUsers.find((u: any) => u.email === email);

        if (foundUser) {
            // Check for explicit password field or use defaults for legacy users
            const correctPassword = foundUser.password || (foundUser.role === 'Admin' ? 'admin123' : 'user123');

            if (password !== correctPassword) {
                setError(t('invalidPassword') || 'Invalid password.');
                return;
            }

            localStorage.setItem('user', JSON.stringify(foundUser));
            navigate(foundUser.role === 'Admin' ? '/admin' : '/dashboard');
        } else {
            setError(t('accountNotFound') || 'Account not found. Please contact an administrator.');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="card glass" style={{ width: '100%', maxWidth: '400px', animation: 'scaleUp 0.3s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('welcomeBack')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('loginSubtitle')}</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t('email')}</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    borderRadius: '8px',
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t('password')}</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    borderRadius: '8px',
                                    background: 'var(--background)',
                                    border: '1px solid var(--border)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem', background: '#ef444415', padding: '0.75rem', borderRadius: '8px' }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.8rem' }}>
                        <LogIn size={18} /> {t('login')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {t('adminOnly')}
                </div>
            </div>

            <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
      `}</style>
        </div>
    );
};
