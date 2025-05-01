
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  X as XIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SearchFilters = ({
  onFilterByName,
  onFilterByRegion,
  onFilterByLanguage,
  onFilterByCurrency,
  onFilterByCapital,
  onReset
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  
  const regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ];
  
  const languages = [
    'English',
    'Spanish',
    'French',
    'Arabic',
    'Chinese',
    'Russian',
    'Portuguese',
    'German',
    'Japanese',
    'Hindi'
  ];
  
  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CNY',
    'AUD',
    'CAD'
  ];
  
  const handleSearch = () => {
    if (!searchText.trim()) return;
    
    switch (filterType) {
      case 'name':
        onFilterByName(searchText);
        break;
      case 'capital':
        onFilterByCapital(searchText);
        break;
      case 'currency':
        onFilterByCurrency(searchText);
        break;
      case 'language':
        onFilterByLanguage(searchText);
        break;
      default:
        onFilterByName(searchText);
        break;
    }
  };
  
  const handleReset = () => {
    setSearchText('');
    setFilterType('name');
    onReset();
  };
  
  const toggleQuickFilters = () => {
    setShowQuickFilters(!showQuickFilters);
  };
  
  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm mb-4 md:mb-6 space-y-3 md:space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* Search Type Selector */}
        <div className="w-full md:w-44">
          <p className="text-sm font-medium mb-1 text-gray-700">Search By</p>
          <Select 
            value={filterType} 
            onValueChange={setFilterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Country Name</SelectItem>
                <SelectItem value="capital">Capital</SelectItem>
                <SelectItem value="currency">Currency</SelectItem>
                <SelectItem value="language">Language</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search by ${filterType}...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 pr-4"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>
        
        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="w-full md:w-auto bg-explorer-blue hover:bg-explorer-navy"
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          <span>Search</span>
        </Button>
        
        {/* Reset Button */}
        <Button 
          variant="outline"
          onClick={handleReset}
          className="w-full md:w-auto"
        >
          <XIcon className="h-4 w-4 mr-2" />
          <span>Reset</span>
        </Button>
      </div>
      
      {/* Quick Filters Toggle (for mobile) */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={toggleQuickFilters}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center">
            <FilterIcon className="h-4 w-4 mr-2 text-explorer-blue" />
            Quick Filters
          </span>
          {showQuickFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Quick Filters */}
      <div className={`space-y-3 ${!showQuickFilters && 'hidden md:block'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center w-full md:w-auto mb-1 md:mb-0">
            <FilterIcon className="h-4 w-4 mr-1 text-explorer-blue" />
            Region:
          </span>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {regions.map(region => (
              <Button 
                key={region} 
                variant="outline" 
                size="sm"
                onClick={() => onFilterByRegion(region)}
                className="text-xs"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center w-full md:w-auto mb-1 md:mb-0">
            <FilterIcon className="h-4 w-4 mr-1 text-explorer-blue" />
            Language:
          </span>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {languages.map(lang => (
              <Button 
                key={lang} 
                variant="outline" 
                size="sm"
                onClick={() => onFilterByLanguage(lang)}
                className="text-xs"
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 flex items-center w-full md:w-auto mb-1 md:mb-0">
            <FilterIcon className="h-4 w-4 mr-1 text-explorer-blue" />
            Currency:
          </span>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {currencies.map(currency => (
              <Button 
                key={currency} 
                variant="outline" 
                size="sm"
                onClick={() => onFilterByCurrency(currency)}
                className="text-xs"
              >
                {currency}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
