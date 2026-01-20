import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Thermometer, Droplets, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { formatToIST } from '../utils/dateUtils';

/**
 * Home Page Component
 * Main public entry point featuring the Interactive Cluster Map and Latest Updates.
 * Displays real-time weather dynamics across Sugandhagiri, Chembra, and Kurichyarmala.
 */
export const Home = () => {
    const { t } = useLanguage();
    const [weatherEntries, setWeatherEntries] = useState<any[]>([]);
    const [selectedCluster, setSelectedCluster] = useState<any>(null);

    // Mock initial clusters with data
    const baseClusters = [
        {
            id: 'Sugandhagiri',
            name: 'Sugandhagiri',
            color: '#22c55e',
            coords: [[11.53, 75.98], [11.57, 75.98], [11.57, 76.03], [11.53, 76.03]] as [number, number][],
        },
        {
            id: 'Chembra',
            name: 'Chembra',
            color: '#f59e0b',
            coords: [[11.53, 76.10], [11.58, 76.10], [11.58, 76.15], [11.53, 76.15]] as [number, number][],
        },
        {
            id: 'Kurichyarmala',
            name: 'Kurichyarmala',
            color: '#ef4444',
            coords: [[11.60, 75.98], [11.65, 75.98], [11.65, 76.03], [11.60, 76.03]] as [number, number][],
        },
    ];

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('weatherEntries') || '[]');
        setWeatherEntries(saved);

        // Listen for storage changes to update immediately
        const handleStorage = () => {
            setWeatherEntries(JSON.parse(localStorage.getItem('weatherEntries') || '[]'));
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const getLatestForCluster = (clusterId: string) => {
        const entries = weatherEntries.filter(e => e.cluster === clusterId);
        if (entries.length > 0) {
            // Sort by ID (timestamp) desc
            const sorted = [...entries].sort((a, b) => b.id - a.id);
            const latest = sorted[0];
            return {
                temp: latest.temp,
                rainfall: latest.rainfall,
                lastUpdate: formatToIST(latest.id),
                status: latest.rainfall > 100 ? 'Warning' : latest.rainfall > 40 ? 'Watch' : 'Normal'
            };
        }
        // Fallback mock values if no entries exist
        return {
            temp: 24.5,
            rainfall: 12,
            lastUpdate: formatToIST(new Date().setHours(new Date().getHours() - 2)),
            status: 'Normal'
        };
    };

    const clustersWithData = baseClusters.map(c => ({
        ...c,
        ...getLatestForCluster(c.id)
    }));

    return (
        <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', minHeight: '600px' }}>

                {/* Map Section */}
                <div className="card glass" style={{ padding: '0.5rem', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '550px', borderRadius: '12px', overflow: 'hidden' }}>
                        <MapContainer center={[11.57, 76.05] as any} zoom={11} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {clustersWithData.map((cluster) => (
                                <Polygon
                                    key={cluster.id}
                                    positions={cluster.coords as any}
                                    pathOptions={{
                                        color: cluster.status === 'Warning' ? '#ef4444' : cluster.status === 'Watch' ? '#f59e0b' : '#22c55e',
                                        fillColor: cluster.status === 'Warning' ? '#ef4444' : cluster.status === 'Watch' ? '#f59e0b' : '#22c55e',
                                        fillOpacity: 0.3
                                    }}
                                    eventHandlers={{
                                        click: () => setSelectedCluster(cluster),
                                    }}
                                >
                                    <Popup>
                                        <div style={{ color: '#333' }}>
                                            <h3 style={{ margin: 0 }}>{cluster.name}</h3>
                                            <p style={{ margin: '5px 0' }}>{t('temp')}: {cluster.temp}°C</p>
                                            <p style={{ margin: '5px 0' }}>{t('rainfall')}: {cluster.rainfall}mm</p>
                                            <small>{t('lastUpdated')}: {cluster.lastUpdate}</small>
                                        </div>
                                    </Popup>
                                </Polygon>
                            ))}
                        </MapContainer>
                    </div>

                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 500 }} className="glass">
                        <div style={{ padding: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: 12, height: 12, background: '#22c55e', borderRadius: '50%' }}></div> {t('normal')}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: 12, height: 12, background: '#f59e0b', borderRadius: '50%' }}></div> {t('watch')}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%' }}></div> {t('warning')}</span>
                        </div>
                    </div>
                </div>

                {/* Cluster Summary Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card glass" style={{ padding: '1rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Clock size={20} color="var(--primary)" />
                            {t('latestUpdates')}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {t('lastUpdated')}: {clustersWithData[0].lastUpdate}
                        </p>
                    </div>

                    {clustersWithData.map((cluster) => (
                        <div
                            key={cluster.id}
                            className="card glass"
                            style={{
                                borderLeft: `5px solid ${cluster.status === 'Warning' ? '#ef4444' : cluster.status === 'Watch' ? '#f59e0b' : '#22c55e'}`,
                                transition: 'transform 0.2s',
                                cursor: 'pointer',
                                transform: selectedCluster?.id === cluster.id ? 'scale(1.02)' : 'none'
                            }}
                            onClick={() => setSelectedCluster(cluster)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>{cluster.name}</h3>
                                <div style={{
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    background: cluster.status === 'Warning' ? '#ef444422' : cluster.status === 'Watch' ? '#f59e0b22' : '#22c55e22',
                                    color: cluster.status === 'Warning' ? '#ef4444' : cluster.status === 'Watch' ? '#f59e0b' : '#22c55e',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}>
                                    {cluster.status === 'Normal' && <CheckCircle size={14} />}
                                    {cluster.status === 'Watch' && <Info size={14} />}
                                    {cluster.status === 'Warning' && <AlertTriangle size={14} />}
                                    {t(cluster.status.toLowerCase() as any)}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Thermometer size={18} color="var(--text-muted)" />
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('temp').toUpperCase()}</div>
                                        <div style={{ fontWeight: 700 }}>{cluster.temp}°C</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Droplets size={18} color="var(--text-muted)" />
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('rainfall').toUpperCase()}</div>
                                        <div style={{ fontWeight: 700 }}>{cluster.rainfall}mm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <div className="glass" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', border: '1px solid var(--primary)' }}>
                    {t('exploreClusters')}
                </div>
            </div>
        </div>
    );
};
