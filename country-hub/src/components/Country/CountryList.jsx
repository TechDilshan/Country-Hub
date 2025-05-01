
import React from 'react';
import CountryCard from './CountryCard';

const CountryList = ({ countries, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`skeleton-${i}`} 
            className="h-80 rounded-lg bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  if (countries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">No countries found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {countries.map(country => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
};

export default CountryList;
