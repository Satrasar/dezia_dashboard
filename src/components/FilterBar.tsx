import React from 'react';
import { Filter, Search } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <Filter className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Filtreler</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Kampanya ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        {/* Platform Filter */}
        <select
          value={filters.platform}
          onChange={(e) => onFilterChange({ ...filters, platform: e.target.value })}
          className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300"
        >
          <option value="">Tüm Platformlar</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="Meta">Meta</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300"
        >
          <option value="">Tüm Durumlar</option>
          <option value="ACTIVE">Aktif</option>
          <option value="PAUSED">Durdurulmuş</option>
          <option value="DISABLED">Devre Dışı</option>
        </select>

        {/* Alert Level Filter */}
        <select
          value={filters.alert_level}
          onChange={(e) => onFilterChange({ ...filters, alert_level: e.target.value })}
          className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-300"
        >
          <option value="">Tüm Uyarı Seviyeleri</option>
          <option value="normal">Normal</option>
          <option value="warning">Uyarı</option>
          <option value="critical">Kritik</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;