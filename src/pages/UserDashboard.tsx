import React, { useState, useEffect } from 'react';
import { Send, Table as TableIcon, PlusCircle, Pencil, Trash2, XCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { formatToIST } from '../utils/dateUtils';

/**
 * User Dashboard Component
 * Secure portal for authorized users to submit and manage local weather data.
 * Features: Weather Data Entry Form, List of Personal Submissions, and Edit/Delete actions.
 */
export const UserDashboard = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        district: 'Wayanad',
        state: 'Kerala',
        cluster: 'Sugandhagiri',
        latitude: '',
        longitude: '',
        temp: '',
        rainfall: ''
    });

    const [submissions, setSubmissions] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const loadSubmissions = () => {
        const saved = JSON.parse(localStorage.getItem('weatherEntries') || '[]');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setSubmissions(saved.filter((s: any) => s.submittedBy === user.email));
    };

    useEffect(() => {
        loadSubmissions();
        window.addEventListener('storage', loadSubmissions);
        return () => window.removeEventListener('storage', loadSubmissions);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const allEntries = JSON.parse(localStorage.getItem('weatherEntries') || '[]');

        if (editingId) {
            const updatedEntries = allEntries.map((entry: any) =>
                entry.id === editingId ? { ...formData, id: entry.id, dateTime: entry.dateTime, submittedBy: entry.submittedBy } : entry
            );
            localStorage.setItem('weatherEntries', JSON.stringify(updatedEntries));
            setEditingId(null);
            alert('Data updated successfully!');
        } else {
            const entryId = Date.now();
            const newEntry = {
                ...formData,
                id: entryId,
                dateTime: formatToIST(entryId),
                submittedBy: user.email
            };
            const updatedEntries = [newEntry, ...allEntries];
            localStorage.setItem('weatherEntries', JSON.stringify(updatedEntries));
            alert('Data submitted successfully!');
        }

        // Explicitly trigger storage event for the same tab listeners
        window.dispatchEvent(new Event('storage'));

        loadSubmissions();
        setFormData({
            district: 'Wayanad',
            state: 'Kerala',
            cluster: 'Sugandhagiri',
            latitude: '',
            longitude: '',
            temp: '',
            rainfall: ''
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const allEntries = JSON.parse(localStorage.getItem('weatherEntries') || '[]');
            const updatedEntries = allEntries.filter((entry: any) => entry.id !== id);
            localStorage.setItem('weatherEntries', JSON.stringify(updatedEntries));
            window.dispatchEvent(new Event('storage'));
            loadSubmissions();
        }
    };

    const handleEdit = (entry: any) => {
        setFormData({
            district: entry.district,
            state: entry.state,
            cluster: entry.cluster,
            latitude: entry.latitude,
            longitude: entry.longitude,
            temp: entry.temp,
            rainfall: entry.rainfall
        });
        setEditingId(entry.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            district: 'Wayanad',
            state: 'Kerala',
            cluster: 'Sugandhagiri',
            latitude: '',
            longitude: '',
            temp: '',
            rainfall: ''
        });
    };

    return (
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Submission Form */}
                <section>
                    <div className="card glass" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            <PlusCircle size={24} /> {t('submitData')}
                        </h2>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={fieldStyle}>
                                <label>{t('district')}</label>
                                <input type="text" required value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} placeholder="Wayanad" style={inputStyle} />
                            </div>
                            <div style={fieldStyle}>
                                <label>{t('state')}</label>
                                <input type="text" required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="Kerala" style={inputStyle} />
                            </div>
                            <div style={fieldStyle}>
                                <label>{t('cluster')}</label>
                                <select value={formData.cluster} onChange={e => setFormData({ ...formData, cluster: e.target.value })} style={inputStyle}>
                                    <option value="Sugandhagiri" style={optionStyle}>Sugandhagiri</option>
                                    <option value="Chembra" style={optionStyle}>Chembra</option>
                                    <option value="Kurichyarmala" style={optionStyle}>Kurichyarmala</option>
                                </select>
                            </div>
                            <div style={fieldStyle}>
                                <label>{t('temp')} (°C)</label>
                                <input type="number" step="0.1" required value={formData.temp} onChange={e => setFormData({ ...formData, temp: e.target.value })} placeholder="25.5" style={inputStyle} />
                            </div>
                            <div style={fieldStyle}>
                                <label>{t('latitude')}</label>
                                <input type="number" step="0.0001" required value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} placeholder="11.605" style={inputStyle} />
                            </div>
                            <div style={fieldStyle}>
                                <label>{t('longitude')}</label>
                                <input type="number" step="0.0001" required value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} placeholder="76.132" style={inputStyle} />
                            </div>
                            <div style={{ ...fieldStyle, gridColumn: 'span 2', display: 'flex', flexDirection: 'row', gap: '1rem', marginTop: '0.5rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}>
                                    <Send size={18} /> {editingId ? t('saveChanges') || 'Save Changes' : t('submitRecord')}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancelEdit} className="btn glass" style={{ padding: '0.8rem', color: 'var(--danger)' }}>
                                        <XCircle size={18} /> {t('cancel')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                {/* User Submissions Table */}
                <section>
                    <div className="card glass">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <TableIcon size={24} color="var(--primary)" /> {t('mySubmissions')}
                        </h2>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        <th style={thStyle}>{t('dateTime')}</th>
                                        <th style={thStyle}>{t('cluster')}</th>
                                        <th style={thStyle}>{t('temp')}</th>
                                        <th style={thStyle}>{t('rainfall')}</th>
                                        <th style={thStyle}>{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length === 0 ? (
                                        <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('noData')}</td></tr>
                                    ) : (
                                        submissions.map(entry => (
                                            <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                                <td style={tdStyle}>{entry.dateTime}</td>
                                                <td style={tdStyle}><span style={{ padding: '2px 8px', borderRadius: '12px', background: 'var(--glass)', fontSize: '0.8rem' }}>{entry.cluster}</span></td>
                                                <td style={tdStyle}>{entry.temp}°C</td>
                                                <td style={tdStyle}>{entry.rainfall}mm</td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleEdit(entry)}
                                                            className="btn glass"
                                                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                                                            title={t('edit')}
                                                        >
                                                            <Pencil size={16} color="var(--primary)" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entry.id)}
                                                            className="btn glass"
                                                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                                                            title={t('delete')}
                                                        >
                                                            <Trash2 size={16} color="var(--danger)" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', color: 'white', outline: 'none' };
const optionStyle: React.CSSProperties = { background: '#1e293b', color: 'white' };
const thStyle: React.CSSProperties = { padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 };
const tdStyle: React.CSSProperties = { padding: '1rem' };
