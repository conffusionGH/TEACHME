import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';


export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)'); 

    const handleMediaChange = (e) => {
      if (e.matches) {
        setMobileSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar
          isOpen={true}
          toggleSidebar={() => { }}
          isPermanent={true}
        />
      </div>

      {/* Mobile sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isPermanent={false}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          sidebarOpen={mobileSidebarOpen}
          setSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}