
import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AgentsSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AgentsSearchBar: React.FC<AgentsSearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          className="pl-10" 
          placeholder="Search marketplace..." 
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" className="text-ey-darkGray">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="text-ey-darkGray">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
      </div>
    </div>
  );
};

export default AgentsSearchBar;
