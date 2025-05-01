
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, api } from './AuthContext';
import { toast } from "sonner";

const FavoritesContext = createContext(undefined);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Load favorites from API when user is authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        // Clear favorites when not authenticated
        setFavorites([]);
        sessionStorage.removeItem('favorites');
        return;
      }
      
      try {
        setLoading(true);
        
        // Try to load from session storage first for immediate display
        const storedFavorites = sessionStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        
        // Then fetch from API to ensure data is fresh
        const { data } = await api.get('/favorites');
        setFavorites(data);
        
        // Update session storage with latest data
        sessionStorage.setItem('favorites', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        toast.error('Failed to load your favorite countries.');
        
        // If API fails, try to use session storage as fallback
        const storedFavorites = sessionStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [isAuthenticated, user]);
  
  // Add a country to favorites
  const addFavorite = async (country) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add favorites');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/favorites', {
        countryCode: country.cca3,
        countryData: country
      });
      
      // Add to local state only after successful API call
      const updatedFavorites = [...favorites];
      // Prevent duplicates
      if (!updatedFavorites.some(c => c.cca3 === country.cca3)) {
        updatedFavorites.push(country);
      }
      
      setFavorites(updatedFavorites);
      
      // Update session storage
      sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      toast.success(`Added ${country.name.common} to favorites`);
    } catch (error) {
      console.error('Failed to add favorite:', error);
      toast.error('Failed to add country to favorites');
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a country from favorites
  const removeFavorite = async (countryCode) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      await api.delete(`/favorites/${countryCode}`);
      
      // Remove from local state
      const updatedFavorites = favorites.filter(c => c.cca3 !== countryCode);
      setFavorites(updatedFavorites);
      
      // Update session storage
      sessionStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      toast.error('Failed to remove country from favorites');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if a country is in favorites
  const isFavorite = (countryCode) => {
    if (!isAuthenticated) return false;
    
    return favorites.some(c => c.cca3 === countryCode);
  };
  
  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
  
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
