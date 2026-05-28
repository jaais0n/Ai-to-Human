import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/ui/ToastContainer';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import { Analytics } from '@vercel/analytics/react';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/history" element={<PageWrapper><HistoryPage /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
        <Navbar />
        <AnimatedRoutes />
        <ToastContainer />
        <Analytics />
      </div>
    </BrowserRouter>
  );
}
