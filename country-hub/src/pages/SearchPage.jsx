import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getCountriesByName, 
  getCountriesByRegion,
  getCountriesByLanguage,
  getCountriesByCurrency,
  getCountriesByCapital,
  getAllCountries
} from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import SearchFilters from '@/components/Search/SearchFilters';
import CountryList from '@/components/Country/CountryList';

const SearchPage = () => {
  const [searchType, setSearchType] = useState('all');
  const [searchParam, setSearchParam] = useState('');
  
  // Fetch countries based on search type and param
  const { data: countries = [], isLoading, refetch } = useQuery({
    queryKey: ['countries', searchType, searchParam],
    queryFn: async () => {
      if (searchType === 'all' || !searchParam) {
        return getAllCountries();
      }
      
      switch (searchType) {
        case 'name':
          return getCountriesByName(searchParam);
        case 'region':
          return getCountriesByRegion(searchParam);
        case 'language':
          return getCountriesByLanguage(searchParam);
        case 'currency':
          return getCountriesByCurrency(searchParam);
        case 'capital':
          return getCountriesByCapital(searchParam);
        default:
          return getAllCountries();
      }
    },
    enabled: searchType !== 'all' || searchParam !== '',
  });
  
  // Handler for filtering by name
  const handleFilterByName = (name) => {
    setSearchType('name');
    setSearchParam(name);
  };
  
  // Handler for filtering by region
  const handleFilterByRegion = (region) => {
    setSearchType('region');
    setSearchParam(region);
  };
  
  // Handler for filtering by language
  const handleFilterByLanguage = (language) => {
    setSearchType('language');
    setSearchParam(language);
  };
  
  // Handler for filtering by currency
  const handleFilterByCurrency = (currency) => {
    setSearchType('currency');
    setSearchParam(currency);
  };
  
  // Handler for filtering by capital
  const handleFilterByCapital = (capital) => {
    setSearchType('capital');
    setSearchParam(capital);
  };
  
  // Handler for resetting filters
  const handleReset = () => {
    setSearchType('all');
    setSearchParam('');
  };
  
  // Get initial countries when page loads
  const { data: initialCountries = [], isLoading: isInitialLoading } = useQuery({
    queryKey: ['initialCountries'],
    queryFn: getAllCountries,
    enabled: searchType === 'all' && searchParam === '',
  });
  
  // Determine which countries to display
  const displayCountries = searchType === 'all' && searchParam === '' ? initialCountries : countries;
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-explorer-navy mb-2">Advanced Search</h1>
        <p className="text-gray-600">
          Search countries by different criteria: name, region, language, currency, or capital
        </p>
      </div>
      
      {/* Search Filters */}
      <SearchFilters 
        onFilterByName={handleFilterByName}
        onFilterByRegion={handleFilterByRegion}
        onFilterByLanguage={handleFilterByLanguage}
        onFilterByCurrency={handleFilterByCurrency}
        onFilterByCapital={handleFilterByCapital}
        onReset={handleReset}
      />
      
      {/* Search Results */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-explorer-navy">
            {searchType === 'all' 
              ? 'All Countries' 
              : `Results for: ${searchParam} (${countries.length})`
            }
          </h2>
        </div>
        
        <CountryList 
          countries={displayCountries} 
          loading={searchType === 'all' ? isInitialLoading : isLoading} 
        />
      </div>
    </MainLayout>
  );
};

export default SearchPage; 