import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Info } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';

const CountryCard = ({ country }) => {
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isAuthenticated ? isFavorite(country.cca3) : false;
  
  const formatPopulation = (pop) => {
    if (pop >= 1000000000) {
      return `${(pop / 1000000000).toFixed(1)}B`;
    } else if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(1)}M`;
    } else if (pop >= 1000) {
      return `${(pop / 1000).toFixed(1)}K`;
    }
    return pop.toString();
  };
  
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    if (favorite) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country);
    }
  };
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="p-0 h-40 overflow-hidden">
        <div className="w-full h-full relative">
          <img 
            src={country.flags.png} 
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
          />
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full ${
                favorite ? 'text-red-500' : 'text-gray-500'
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <CardTitle className="mb-2 text-xl text-explorer-navy truncate">
          {country.name.common}
        </CardTitle>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Capital:</span>
            <span className="font-medium">{country.capital?.[0] || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Region:</span>
            <span className="font-medium">{country.region}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Population:</span>
            <span className="font-medium">{formatPopulation(country.population)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link 
          to={`/country/${country.cca3}`}
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full flex gap-2 text-explorer-blue border-explorer-blue hover:bg-explorer-blue hover:text-white"
          >
            <Info className="h-4 w-4" />
            <span>Details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CountryCard; 