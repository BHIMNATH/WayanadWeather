import { useLanguage } from '../i18n/LanguageContext';

/**
 * About Page Component
 * Detailed information about the Wayanad Weather project, its purpose, 
 * and credits to the Hume Center and development team.
 */
export const About = () => {
    const { t } = useLanguage();
    return (
        <div className="container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="card glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{t('aboutTitle')}</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ height: '150px', background: 'var(--glass)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src="https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop" alt="Weather Monitoring" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ height: '150px', background: 'var(--glass)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop" alt="Data Analysis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{t('purpose')}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        {t('aboutDescription')}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {t('disclaimer')}
                    </p>
                </section>

                <section style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{t('contact')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Email: support@wayanadweather.org</p>
                    <p style={{ color: 'var(--text-muted)' }}>Phone: +91 98470 00000</p>
                </section>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <p><strong>{t('projectBy')}</strong></p>
                    <p><strong>{t('copyrightBy')}</strong></p>
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.6, fontSize: '0.75rem' }}>
                    <p>{t('developedBy')}</p>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};
