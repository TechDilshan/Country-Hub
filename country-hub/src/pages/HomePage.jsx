
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import CountryList from '@/components/Country/CountryList';
import { Button } from '@/components/ui/button';
import { Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [featuredCountries, setFeaturedCountries] = useState([]);
  
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: getAllCountries,
  });
  
  // Get 8 random countries to feature on the home page
  useEffect(() => {
    if (countries.length > 0) {
      const shuffled = [...countries].sort(() => 0.5 - Math.random());
      setFeaturedCountries(shuffled.slice(0, 8));
    }
  }, [countries]);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-explorer-blue to-explorer-navy rounded-lg p-4 md:p-8 mb-6 md:mb-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-3 md:mb-4">
            <Globe className="h-12 w-12 md:h-16 md:w-16" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Country Hub Dashboard</h1>
          <p className="text-base md:text-xl mb-4 md:mb-6">
            Discover and explore countries around the world. Search, filter, and save your favorites.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/explore" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-white text-explorer-blue hover:bg-gray-100"
              >
                Start Exploring
              </Button>
            </Link>
            <Link to="/search" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-explorer-blue text-explorer-blue hover:bg-explorer-blue/10"
              >
                Search Countries
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-base md:text-lg font-semibold text-explorer-navy mb-1 md:mb-2">Total Countries</h3>
          <p className="text-2xl md:text-3xl font-bold text-explorer-blue">
            {isLoading ? '—' : countries.length}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-base md:text-lg font-semibold text-explorer-navy mb-1 md:mb-2">Continents</h3>
          <p className="text-2xl md:text-3xl font-bold text-explorer-green">5</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-base md:text-lg font-semibold text-explorer-navy mb-1 md:mb-2">Languages</h3>
          <p className="text-2xl md:text-3xl font-bold text-explorer-teal">100+</p>
        </div>
      </div>
      
      {/* Featured Countries */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-explorer-navy">Featured Countries</h2>
          <Link to="/explore">
            <Button variant="link" className="text-explorer-blue flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <CountryList countries={featuredCountries} loading={isLoading} />
      </div>
      
      {/* App Features */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-explorer-navy mb-3 md:mb-4 text-center">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="text-center p-3 md:p-4">
            <div className="bg-explorer-blue/10 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Globe className="h-5 w-5 md:h-6 md:w-6 text-explorer-blue" />
            </div>
            <h3 className="font-semibold mb-1 md:mb-2">Explore Countries</h3>
            <p className="text-gray-600 text-sm">
              Browse and discover countries from around the world with detailed information.
            </p>
          </div>
          <div className="text-center p-3 md:p-4">
            <div className="bg-explorer-green/10 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 md:h-6 md:w-6 text-explorer-green"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1 md:mb-2">Advanced Search</h3>
            <p className="text-gray-600 text-sm">
              Find countries by name, region, language, capital, or currency.
            </p>
          </div>
          <div className="text-center p-3 md:p-4 sm:col-span-2 md:col-span-1">
            <div className="bg-explorer-teal/10 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 md:h-6 md:w-6 text-explorer-teal"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-1 md:mb-2">Save Favorites</h3>
            <p className="text-gray-600 text-sm">
              Create an account to save your favorite countries for quick access.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
