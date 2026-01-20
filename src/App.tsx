import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { useLanguage } from './i18n/LanguageContext';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  const { t } = useLanguage();
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['User']}>
              <UserDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', opacity: 0.6, borderTop: '1px solid var(--border)' }}>
        <p className="container">
          {t('footerDisclaimer')}
        </p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
