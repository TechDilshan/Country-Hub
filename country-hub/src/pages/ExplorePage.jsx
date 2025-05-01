import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import CountryList from '@/components/Country/CountryList';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search as SearchIcon } from 'lucide-react';

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  
  // Fetch all countries
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: getAllCountries,
  });
  
  // Filter countries based on search and region
  const filteredCountries = countries.filter(country => {
    const matchesSearch = searchTerm === '' || 
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.name.official.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = regionFilter === 'all' || country.region === regionFilter;
    
    return matchesSearch && matchesRegion;
  });
  
  // Get unique regions for filter
  const regions = ['all', ...new Set(countries.map(country => country.region))].sort();
  
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-explorer-navy mb-2">Explore Countries</h1>
        <p className="text-gray-600">
          Browse all countries or use filters to narrow your search
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search by name */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by name
            </label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* Filter by region */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by region
            </label>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Results Stats */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredCountries.length} of {countries.length} countries
      </div>
      
      {/* Country List */}
      <CountryList countries={filteredCountries} loading={isLoading} />
    </MainLayout>
  );
};

export default ExplorePage; 