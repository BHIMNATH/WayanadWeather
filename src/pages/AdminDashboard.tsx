import { useState, useEffect } from 'react';
import { Users, Database, Shield, Trash2, Filter, UserMinus, UserCheck, UserPlus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Admin Dashboard Component
 * Central control panel for administrators.
 * Features: User Management (Create/Modify Users) and Data Management (System-wide Data Review/Cleanup).
 */
export const AdminDashboard = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'users' | 'data'>('users');
    const [users, setUsers] = useState<any[]>([]);
    const [weatherData, setWeatherData] = useState<any[]>([]);
    const [filterCluster, setFilterCluster] = useState('All');

    // Form for new user
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', mobile: '', role: 'User', password: '' });

    const loadData = () => {
        const savedEntries = JSON.parse(localStorage.getItem('weatherEntries') || '[]');
        setWeatherData(savedEntries);

        const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (savedUsers.length === 0) {
            const initialUsers = [
                { id: 1, name: 'Admin User', email: 'admin@weather.com', mobile: '1234567890', role: 'Admin', status: 'Active' },
                { id: 2, name: 'ASHIFA', email: 'ashifa@weather.com', mobile: '97479 54589', role: 'User', status: 'Active' },
                { id: 3, name: 'SHAMNA', email: 'shamna@weather.com', mobile: '80866 89553', role: 'User', status: 'Active' },
                { id: 4, name: 'GABRIEL', email: 'gabriel@weather.com', mobile: '7025392450', role: 'User', status: 'Active' },
                { id: 5, name: 'FASEELA FAISEL', email: 'faseela@weather.com', mobile: '99473 07399', role: 'User', status: 'Active' },
                { id: 6, name: 'SURESH', email: 'suresh@weather.com', mobile: '9744697940', role: 'User', status: 'Active' },
                { id: 7, name: 'RESHMA', email: 'reshma@weather.com', mobile: '95449 50309', role: 'User', status: 'Active' },
            ];
            setUsers(initialUsers);
            localStorage.setItem('registeredUsers', JSON.stringify(initialUsers));
        } else {
            setUsers(savedUsers);
        }
    };

    useEffect(() => {
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const userToAdd = {
            ...newUser,
            id: Date.now(),
            status: 'Active'
        };
        const updatedUsers = [...users, userToAdd];
        setUsers(updatedUsers);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        setNewUser({ name: '', email: '', mobile: '', role: 'User', password: '' });
        setShowAddUser(false);
        alert('User created successfully!');
    };

    const handleDeleteEntry = (id: number) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const updated = weatherData.filter(d => d.id !== id);
            setWeatherData(updated);
            localStorage.setItem('weatherEntries', JSON.stringify(updated));
            window.dispatchEvent(new Event('storage'));
        }
    };

    const toggleUserStatus = (id: number) => {
        const updated = users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' } : u
        );
        setUsers(updated);
        localStorage.setItem('registeredUsers', JSON.stringify(updated));
    };

    const changeUserRole = (id: number, newRole: string) => {
        const updated = users.map(u => u.id === id ? { ...u, role: newRole } : u);
        setUsers(updated);
        localStorage.setItem('registeredUsers', JSON.stringify(updated));
    };

    const filteredData = filterCluster === 'All'
        ? weatherData
        : weatherData.filter(d => d.cluster === filterCluster);

    return (
        <div className="container">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : 'glass'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <Users size={18} /> {t('userManagement')}
                </button>
                <button
                    onClick={() => setActiveTab('data')}
                    className={`btn ${activeTab === 'data' ? 'btn-primary' : 'glass'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <Database size={18} /> {t('dataManagement')}
                </button>
            </div>

            {activeTab === 'users' ? (
                <div className="card glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={24} color="var(--primary)" /> {t('registeredUsers')}
                        </h2>
                        <button onClick={() => setShowAddUser(!showAddUser)} className="btn btn-primary">
                            <UserPlus size={18} /> {showAddUser ? t('cancel') : t('addUser')}
                        </button>
                    </div>

                    {showAddUser && (
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                            <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div style={fieldStyle}>
                                    <label>{t('fullName')}</label>
                                    <input type="text" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} style={inputStyle} placeholder="Name" />
                                </div>
                                <div style={fieldStyle}>
                                    <label>{t('email')}</label>
                                    <input type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={inputStyle} placeholder="email@weather.com" />
                                </div>
                                <div style={fieldStyle}>
                                    <label>{t('mobile')}</label>
                                    <input type="text" required value={newUser.mobile} onChange={e => setNewUser({ ...newUser, mobile: e.target.value })} style={inputStyle} placeholder="Mobile" />
                                </div>
                                <div style={fieldStyle}>
                                    <label>{t('passwordLabel')}</label>
                                    <input type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} style={inputStyle} placeholder="Password" />
                                </div>
                                <div style={fieldStyle}>
                                    <label>{t('role')}</label>
                                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={inputStyle}>
                                        <option value="User" style={optionStyle}>User</option>
                                        <option value="Admin" style={optionStyle}>Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '1rem', justifyContent: 'center' }}>
                                    {t('confirmAdd')}
                                </button>
                            </form>
                        </div>
                    )}

                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={thStyle}>{t('fullName')}</th>
                                    <th style={thStyle}>{t('email')}</th>
                                    <th style={thStyle}>{t('role')}</th>
                                    <th style={thStyle}>{t('status')}</th>
                                    <th style={thStyle}>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={tdStyle}>{user.name}</td>
                                        <td style={tdStyle}>{user.email}</td>
                                        <td style={tdStyle}>
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeUserRole(user.id, e.target.value)}
                                                style={selectStyle}
                                            >
                                                <option value="User" style={optionStyle}>User</option>
                                                <option value="Admin" style={optionStyle}>Admin</option>
                                            </select>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                background: user.status === 'Active' ? '#22c55e22' : '#ef444422',
                                                color: user.status === 'Active' ? '#22c55e' : '#ef4444'
                                            }}>
                                                {user.status === 'Active' ? t('active') : t('disabled')}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => toggleUserStatus(user.id)} className="btn glass" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                                                    {user.status === 'Active' ? <UserMinus size={16} color="var(--danger)" /> : <UserCheck size={16} color="var(--success)" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={24} color="var(--primary)" /> {t('allEntries')}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Filter size={18} color="var(--text-muted)" />
                            <select
                                value={filterCluster}
                                onChange={(e) => setFilterCluster(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="All" style={optionStyle}>{t('allClusters')}</option>
                                <option value="Sugandhagiri" style={optionStyle}>Sugandhagiri</option>
                                <option value="Chembra" style={optionStyle}>Chembra</option>
                                <option value="Kurichyarmala" style={optionStyle}>Kurichyarmala</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={thStyle}>{t('dateTime')}</th>
                                    <th style={thStyle}>{t('cluster')}</th>
                                    <th style={thStyle}>{t('temp')}</th>
                                    <th style={thStyle}>{t('rainfall')}</th>
                                    <th style={thStyle}>{t('submittedBy')}</th>
                                    <th style={thStyle}>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
                                ) : (
                                    filteredData.map(entry => (
                                        <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={tdStyle}>{entry.dateTime}</td>
                                            <td style={tdStyle}>{entry.cluster}</td>
                                            <td style={tdStyle}>{entry.temp}°C</td>
                                            <td style={tdStyle}>{entry.rainfall}mm</td>
                                            <td style={tdStyle}><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{entry.submittedBy}</span></td>
                                            <td style={tdStyle}>
                                                <button onClick={() => handleDeleteEntry(entry.id)} className="btn glass" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                                                    <Trash2 size={16} color="var(--danger)" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' };
const thStyle: React.CSSProperties = { padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '1rem' };
const selectStyle: React.CSSProperties = {
    background: 'var(--background)',
    border: '1px solid var(--border)',
    color: 'white',
    padding: '0.3rem 0.5rem',
    borderRadius: '4px',
    outline: 'none'
};
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.4rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' };
const optionStyle: React.CSSProperties = { background: '#1e293b', color: 'white' };
