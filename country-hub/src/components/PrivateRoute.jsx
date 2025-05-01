
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Check session storage directly for fallback authentication
  const hasSessionUser = sessionStorage.getItem('user') !== null;
  
  // If still loading, we could show a spinner here
  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-explorer-blue"></div>
    </div>;
  }
  
  // Allow access if authenticated through context OR session storage
  if (isAuthenticated || hasSessionUser) {
    return <>{children}</>;
  }
  
  // Redirect to login if not authenticated, but save the current location
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;
