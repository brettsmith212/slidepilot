import React, { useState, useEffect } from 'react';
import Header from './Header';
import useLocalStorage from '../../hooks/useLocalStorage';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar-open', true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
        
        {/* Sidebar */}
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            <aside className={`
              ${isMobile 
                ? 'fixed right-0 top-16 bottom-0 w-80 z-20' 
                : 'w-80'
              } 
              bg-white border-l border-gray-200 flex flex-col
              transition-transform duration-300 ease-in-out
              ${isMobile && !sidebarOpen ? 'transform translate-x-full' : ''}
            `}>
              {sidebar || (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Sidebar content will go here</p>
                </div>
              )}
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
