import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Cloud, LayoutDashboard, LogIn, LogOut, Info, Home as HomeIcon, Languages, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Navigation Bar Component
 * Handles site-wide navigation and language switching.
 */
export const Navbar = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ml' : 'en');
    };

    return (
        <nav className="glass" style={{ margin: '1rem', position: 'sticky', top: '1rem', zIndex: 1000 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 800 }}>
                    <Cloud size={32} color="var(--primary)" />
                    <span>{t('appName').split(' ')[0]}<span style={{ color: 'var(--primary)' }}>{t('appName').split(' ')[1]}</span></span>
                </Link>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    {/* Home Link */}
                    <NavLink to="/" style={({ isActive }) => ({ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' })}>
                        <HomeIcon size={18} /> {t('home')}
                    </NavLink>

                    {/* Gallery Link */}
                    <NavLink to="/gallery" style={({ isActive }) => ({ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' })}>
                        <ImageIcon size={18} /> {t('gallery')}
                    </NavLink>

                    {/* About Link */}
                    <NavLink to="/about" style={({ isActive }) => ({ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' })}>
                        <Info size={18} /> {t('about')}
                    </NavLink>

                    {user && (
                        <NavLink to={user.role === 'Admin' ? '/admin' : '/dashboard'} style={({ isActive }) => ({ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' })}>
                            <LayoutDashboard size={18} /> {user.role === 'Admin' ? t('admin') : t('dashboard')}
                        </NavLink>
                    )}

                    <button
                        onClick={toggleLanguage}
                        className="btn glass"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.8rem', border: '1px solid var(--border)' }}
                    >
                        <Languages size={18} /> {language === 'en' ? 'മലയാളം' : 'English'}
                    </button>

                    {user ? (
                        <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <LogOut size={18} /> {t('logout')}
                        </button>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <LogIn size={18} /> {t('login')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
