import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen text-white">
      {/* Mobile Top Navbar */}
      <div className="md:hidden">
        <Navbar />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="md:pl-64 pb-20 md:pb-0"> 
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
    </div>
  );
}