import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/ui/ToastContainer';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#000' }}>
        <Navbar />
        <DashboardPage />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
