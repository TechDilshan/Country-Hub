
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed on mobile, normal on desktop */}
      <div 
        className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'relative'
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header with hamburger menu */}
        {isMobile && (
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-bold text-explorer-navy">Country Hub</h1>
          </div>
        )}
        
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
