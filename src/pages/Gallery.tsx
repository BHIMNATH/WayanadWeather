import { useLanguage } from '../i18n/LanguageContext';
import { Users, Thermometer, PlayCircle, Image as ImageIcon } from 'lucide-react';

/**
 * Gallery Page Component
 * Displays three main sections: Social Economic Survey, Weather Instruments, and Video Section.
 * Uses glassmorphism styling consistent with the rest of the application.
 */
export const Gallery = () => {
    const { t } = useLanguage();

    const sections = [
        {
            id: 'survey',
            title: t('survey'),
            icon: <Users size={32} color="var(--primary)" />,
            items: [
                { id: 1, type: 'image', url: '/gallery/survey/survey1.jpg', caption: 'Community Engagement' },
                { id: 2, type: 'image', url: '/gallery/survey/survey2.jpg', caption: 'Field Data Collection' },
                { id: 3, type: 'image', url: '/gallery/survey/survey3.jpg', caption: 'Interacting with Farmers' },
                { id: 4, type: 'image', url: '/gallery/survey/survey4.jpg', caption: 'Survey Methodology' },
                { id: 5, type: 'image', url: '/gallery/survey/survey5.jpg', caption: 'Community Workshop' },
                { id: 6, type: 'image', url: '/gallery/survey/survey6.jpg', caption: 'Socio-economic Data Gathering' }
            ]
        },
        {
            id: 'instruments',
            title: t('instruments'),
            icon: <Thermometer size={32} color="var(--primary)" />,
            items: [
                { id: 7, type: 'image', url: '/gallery/instruments/inst1.jpg', caption: 'Automatic Weather Station' },
                { id: 8, type: 'image', url: '/gallery/instruments/inst2.jpg', caption: 'Precision Rain Gauge' },
                { id: 9, type: 'image', url: '/gallery/instruments/inst3.jpg', caption: 'Temperature & Humidity Sensor' },
                { id: 10, type: 'image', url: '/gallery/instruments/inst4.jpg', caption: 'Anemometer Installation' },
                { id: 11, type: 'image', url: '/gallery/instruments/inst5.jpg', caption: 'Solar Radiation Sensor' },
                { id: 12, type: 'image', url: '/gallery/instruments/inst6.jpg', caption: 'Field Equipment Maintenance' }
            ]
        },
        {
            id: 'videos',
            title: t('videos'),
            icon: <PlayCircle size={32} color="var(--primary)" />,
            items: [
                { id: 13, type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Project Overview' },
                { id: 14, type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Community Impact Stories' }
            ]
        }
    ];

    return (
        <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{t('gallery')}</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Explore our collection of field activities, monitoring equipment, and educational weather content.
                </p>
            </div>

            {/* Gallery Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {sections.map(section => (
                    <section key={section.id} style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            {section.icon}
                            <h2 style={{ fontSize: '1.75rem' }}>{section.title}</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {section.items.map(item => (
                                <div key={item.id} className="card glass" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
                                    {item.type === 'image' ? (
                                        <div style={{ height: '200px', overflow: 'hidden' }}>
                                            <img src={item.url} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="hover-scale" />
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                                            <iframe
                                                src={item.url}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                title={item.caption}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                    <div style={{ padding: '1rem', background: 'var(--glass)' }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ImageIcon size={14} /> {item.caption}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Fade In Animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hover-scale:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};
