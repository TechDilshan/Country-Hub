
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCountryByCode } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Globe,
  Users,
  Map,
  Languages,
  Currency,
  Heart,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CountryDetailPage = () => {
  const { countryCode } = useParams();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  // Fetch country details
  const { data: countryData, isLoading } = useQuery({
    queryKey: ['country', countryCode],
    queryFn: () => getCountryByCode(countryCode || ''),
    enabled: !!countryCode,
  });
  
  // Get the first country from the response (API returns an array)
  const country = countryData?.[0];
  
  // Check if the country is a favorite
  const favorite = isAuthenticated && country ? isFavorite(country.cca3) : false;
  
  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!country || !isAuthenticated) return;
    
    if (favorite) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country);
    }
  };
  
  // Helper function to format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  // Extract languages as array
  const getLanguages = (country) => {
    if (!country.languages) return [];
    return Object.values(country.languages);
  };
  
  // Extract currencies as array
  const getCurrencies = (country) => {
    if (!country.currencies) return [];
    return Object.entries(country.currencies).map(([code, details]) => ({
      code,
      ...details
    }));
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-explorer-blue"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!country) {
    return (
      <MainLayout>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Country not found</h1>
          <Link to="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Back button */}
      <div className="mb-4 md:mb-6">
        <Link to="/explore">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Button>
        </Link>
      </div>
      
      {/* Country Header */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Flag */}
        <div className="w-full md:w-1/3">
          <div className="rounded-lg overflow-hidden shadow-md h-[200px] md:h-full max-h-[300px]">
            <img
              src={country.flags.svg || country.flags.png}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Basic Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-explorer-navy mb-1 md:mb-2">
                {country.name.common}
              </h1>
              <p className="text-gray-500 mb-3 md:mb-4">{country.name.official}</p>
            </div>
            
            {isAuthenticated && (
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  favorite ? 'text-red-500 border-red-500' : ''
                }`}
                onClick={handleFavoriteToggle}
              >
                <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
                {favorite ? 'Remove Favorite' : 'Add Favorite'}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4 md:mt-6">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Capital</p>
              <p className="font-medium">{country.capital?.[0] || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs md:text-sm text-gray-500">Region</p>
              <p className="font-medium">{country.region} {country.subregion ? `(${country.subregion})` : ''}</p>
            </div>
            
            <div>
              <p className="text-xs md:text-sm text-gray-500">Population</p>
              <p className="font-medium">{formatNumber(country.population)}</p>
            </div>
            
            <div>
              <p className="text-xs md:text-sm text-gray-500">Area</p>
              <p className="font-medium">{formatNumber(country.area)} km²</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Languages */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Languages className="h-5 w-5 text-explorer-blue" />
              <h2 className="text-lg md:text-xl font-semibold">Languages</h2>
            </div>
            <Separator className="mb-3 md:mb-4" />
            {getLanguages(country).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {getLanguages(country).map((language, index) => (
                  <span 
                    key={index}
                    className="bg-explorer-blue/10 text-explorer-blue px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No language information available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Currencies */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Currency className="h-5 w-5 text-explorer-green" />
              <h2 className="text-lg md:text-xl font-semibold">Currencies</h2>
            </div>
            <Separator className="mb-3 md:mb-4" />
            {getCurrencies(country).length > 0 ? (
              <div className="space-y-2">
                {getCurrencies(country).map((currency, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-sm md:text-base">{currency.name}</span>
                    <span className="bg-explorer-green/10 text-explorer-green px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                      {currency.symbol}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No currency information available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Timezones */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Clock className="h-5 w-5 text-explorer-teal" />
              <h2 className="text-lg md:text-xl font-semibold">Timezones</h2>
            </div>
            <Separator className="mb-3 md:mb-4" />
            {country.timezones && country.timezones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {country.timezones.map((timezone, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm text-center"
                  >
                    {timezone}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No timezone information available</p>
            )}
          </CardContent>
        </Card>
        
        {/* Maps */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Map className="h-5 w-5 text-explorer-navy" />
              <h2 className="text-lg md:text-xl font-semibold">Maps</h2>
            </div>
            <Separator className="mb-3 md:mb-4" />
            {country.maps?.googleMaps ? (
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-explorer-blue hover:underline text-sm md:text-base"
              >
                View on Google Maps
              </a>
            ) : (
              <p className="text-gray-500 text-sm">No map information available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CountryDetailPage;
