import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Settlements } from './pages/settlements/Settlements';
import { Discrepancies } from './pages/discrepancies/Discrepancies';
import { SystemLogs } from './pages/logs/SystemLogs';

export const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Apply theme to HTML tag for CSS variables to pick it up
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      {/* Passing toggleTheme down to Layout so we can put the button in the header/sidebar */}
      <Layout toggleTheme={toggleTheme} isDark={isDark}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/discrepancies" element={<Discrepancies />} />
          <Route path="/logs" element={<SystemLogs />} />
          {/* Add more routes later */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};