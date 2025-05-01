import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import MainLayout from '@/components/Layout/MainLayout';
import CountryList from '@/components/Country/CountryList';
import { Button } from '@/components/ui/button';
import { Heart, LogIn } from 'lucide-react';

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-block p-6 rounded-full mb-4">
            <LogIn className="h-10 w-10 text-explorer-blue" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Please log in to view and manage your favorite countries
          </p>
          <Link to="/login">
            <Button 
              size="lg" 
              className="bg-explorer-blue hover:bg-explorer-navy"
            >
              Log In
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  // Show favorites or empty state if authenticated
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-explorer-navy mb-2">My Favorite Countries</h1>
        <p className="text-gray-600">
          Countries you've saved to your favorites for quick access
        </p>
      </div>
      
      {favorites.length > 0 ? (
        <CountryList countries={favorites} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start exploring countries and click the heart icon to add them to your favorites.
          </p>
          <Link to="/explore">
            <Button>Explore Countries</Button>
          </Link>
        </div>
      )}
    </MainLayout>
  );
};

export default FavoritesPage; 