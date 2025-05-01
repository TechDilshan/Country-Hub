
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import CountryList from '@/components/Country/CountryList';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Filter as FilterIcon, ChevronDown, ChevronUp } from 'lucide-react';

const FilterPage = () => {
  // Fetch all countries
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: getAllCountries
  });
  
  // Filter states
  const [regionFilter, setRegionFilter] = useState('all');
  const [subregionFilter, setSubregionFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [populationRange, setPopulationRange] = useState([0, 1500000000]);
  const [areaRange, setAreaRange] = useState([0, 17000000]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Mobile collapsible sections
  const [showGeoFilters, setShowGeoFilters] = useState(true);
  const [showRangeFilters, setShowRangeFilters] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(true);
  
  // Reset filters
  const resetFilters = () => {
    setRegionFilter('all');
    setSubregionFilter('all');
    setLanguageFilter('all');
    setPopulationRange([0, 1500000000]);
    setAreaRange([0, 17000000]);
    setSortBy('name');
    setSortOrder('asc');
  };
  
  // Extract unique regions, subregions, and languages from countries
  const regions = ['all', ...new Set(countries.map(country => country.region))].sort();
  
  const subregions = ['all', ...new Set(
    countries
      .filter(country => regionFilter === 'all' || country.region === regionFilter)
      .map(country => country.subregion)
      .filter(Boolean)
  )].sort();
  
  const languages = ['all', ...new Set(
    countries.flatMap(country => 
      country.languages ? Object.values(country.languages) : []
    )
  )].sort();
  
  // Filter countries based on selected criteria
  const filteredCountries = countries.filter(country => {
    // Region filter
    const matchesRegion = regionFilter === 'all' || country.region === regionFilter;
    
    // Subregion filter
    const matchesSubregion = subregionFilter === 'all' || 
      (country.subregion && country.subregion === subregionFilter);
    
    // Language filter
    const matchesLanguage = languageFilter === 'all' || 
      (country.languages && Object.values(country.languages).includes(languageFilter));
    
    // Population filter
    const matchesPopulation = country.population >= populationRange[0] && 
      country.population <= populationRange[1];
    
    // Area filter
    const matchesArea = country.area >= areaRange[0] && country.area <= areaRange[1];
    
    return matchesRegion && matchesSubregion && matchesLanguage && 
      matchesPopulation && matchesArea;
  });
  
  // Sort filtered countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.common.localeCompare(b.name.common);
        break;
      case 'population':
        comparison = a.population - b.population;
        break;
      case 'area':
        comparison = a.area - b.area;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  // Toggle section collapse (for mobile)
  const toggleSection = (section) => {
    switch(section) {
      case 'geo':
        setShowGeoFilters(!showGeoFilters);
        break;
      case 'range':
        setShowRangeFilters(!showRangeFilters);
        break;
      case 'sort':
        setShowSortOptions(!showSortOptions);
        break;
      default:
        break;
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-explorer-navy mb-1 md:mb-2">Filter Countries</h1>
        <p className="text-gray-600">
          Apply multiple filters to find countries that match specific criteria
        </p>
      </div>
      
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-explorer-navy flex items-center">
            <FilterIcon className="mr-2 h-4 w-4 md:h-5 md:w-5 text-explorer-blue" />
            Filters
          </h2>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            size="sm"
            className="text-sm"
          >
            Reset Filters
          </Button>
        </div>
        
        {/* Geography Filters - Collapsible on mobile */}
        <div className="mb-4 md:mb-6 border rounded-md p-3">
          <div 
            className="flex justify-between items-center mb-2 cursor-pointer md:cursor-default"
            onClick={() => toggleSection('geo')}
          >
            <h3 className="text-sm font-semibold">Geography Filters</h3>
            <Button variant="ghost" size="sm" className="md:hidden p-1">
              {showGeoFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          {showGeoFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Region</label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region === 'all' ? 'All Regions' : region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Subregion</label>
                <Select value={subregionFilter} onValueChange={setSubregionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subregion" />
                  </SelectTrigger>
                  <SelectContent>
                    {subregions.map(subregion => (
                      <SelectItem key={subregion} value={subregion}>
                        {subregion === 'all' ? 'All Subregions' : subregion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Language</label>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(language => (
                      <SelectItem key={language} value={language}>
                        {language === 'all' ? 'All Languages' : language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        {/* Range Filters - Collapsible on mobile */}
        <div className="mb-4 md:mb-6 border rounded-md p-3">
          <div 
            className="flex justify-between items-center mb-2 cursor-pointer md:cursor-default"
            onClick={() => toggleSection('range')}
          >
            <h3 className="text-sm font-semibold">Range Filters</h3>
            <Button variant="ghost" size="sm" className="md:hidden p-1">
              {showRangeFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          {showRangeFilters && (
            <>
              {/* Population Range */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Population Range: {formatNumber(populationRange[0])} - {formatNumber(populationRange[1])}
                </label>
                <div className="pt-6 pb-2 px-2 md:px-4">
                  <Slider 
                    min={0} 
                    max={1500000000} 
                    step={1000000} 
                    value={populationRange}
                    onValueChange={setPopulationRange}
                    className="py-4"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>1.5B</span>
                </div>
              </div>
              
              {/* Area Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Area Range (km²): {formatNumber(areaRange[0])} - {formatNumber(areaRange[1])}
                </label>
                <div className="pt-6 pb-2 px-2 md:px-4">
                  <Slider 
                    min={0} 
                    max={17000000} 
                    step={100000} 
                    value={areaRange}
                    onValueChange={setAreaRange}
                    className="py-4"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>17M km²</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Sorting - Collapsible on mobile */}
        <div className="border rounded-md p-3">
          <div 
            className="flex justify-between items-center mb-2 cursor-pointer md:cursor-default"
            onClick={() => toggleSection('sort')}
          >
            <h3 className="text-sm font-semibold">Sorting Options</h3>
            <Button variant="ghost" size="sm" className="md:hidden p-1">
              {showSortOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>
          
          {showSortOptions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Country Name</SelectItem>
                    <SelectItem value="population">Population</SelectItem>
                    <SelectItem value="area">Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sort Order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Results */}
      <div className="mb-3 md:mb-4 text-sm text-gray-500">
        Showing {sortedCountries.length} of {countries.length} countries
      </div>
      
      <CountryList countries={sortedCountries} loading={isLoading} />
    </MainLayout>
  );
};

export default FilterPage;
