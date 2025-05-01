
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Globe, 
  Search, 
  Home, 
  Heart, 
  LogIn, 
  User, 
  LogOut,
  Filter,
  MapPin,
  X,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarLink = ({ to, icon, label, active = false, onClick }) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button 
        variant={active ? 'default' : 'ghost'} 
        className={cn(
          "w-full justify-start gap-2 mb-1",
          active ? "bg-explorer-blue text-white" : ""
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = ({ onCloseMobile }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  
  // Combined handler for links on mobile
  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  // Handle logout and close sidebar on mobile
  const handleLogout = () => {
    logout();
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };
  
  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 px-4 py-6 flex flex-col">
      {/* Logo and App Name */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-explorer-blue" />
          <h1 className="text-lg font-bold text-explorer-navy">Country Hub</h1>
        </div>
        
        {/* Close button for mobile */}
        {isMobile && onCloseMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCloseMobile}
            className="text-gray-500"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1">
        <SidebarLink 
          to="/" 
          icon={<Home className="h-4 w-4" />} 
          label="Home" 
          active={location.pathname === '/'} 
          onClick={handleLinkClick}
        />
        
        <SidebarLink 
          to="/search" 
          icon={<Search className="h-4 w-4" />} 
          label="Search" 
          active={location.pathname === '/search'} 
          onClick={handleLinkClick}
        />
        
        <SidebarLink 
          to="/explore" 
          icon={<MapPin className="h-4 w-4" />} 
          label="Explore" 
          active={location.pathname === '/explore'} 
          onClick={handleLinkClick}
        />
        
        <SidebarLink 
          to="/filter" 
          icon={<Filter className="h-4 w-4" />} 
          label="Filter" 
          active={location.pathname === '/filter'} 
          onClick={handleLinkClick}
        />
        
        {isAuthenticated && (
          <>
            <SidebarLink 
              to="/favorites" 
              icon={<Heart className="h-4 w-4" />} 
              label="Favorites" 
              active={location.pathname === '/favorites'} 
              onClick={handleLinkClick}
            />
            
            <SidebarLink 
              to="/profile" 
              icon={<Settings className="h-4 w-4" />} 
              label="My Profile" 
              active={location.pathname === '/profile'} 
              onClick={handleLinkClick}
            />
          </>
        )}
      </nav>
      
      {/* User Section */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-explorer-blue text-white flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </>
        ) : (
          <>
            <SidebarLink 
              to="/login" 
              icon={<LogIn className="h-4 w-4" />} 
              label="Log In" 
              active={location.pathname === '/login'} 
              onClick={handleLinkClick}
            />
            <SidebarLink 
              to="/register" 
              icon={<User className="h-4 w-4" />} 
              label="Register" 
              active={location.pathname === '/register'} 
              onClick={handleLinkClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
