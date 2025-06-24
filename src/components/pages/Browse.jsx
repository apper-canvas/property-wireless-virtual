import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import SearchBar from '@/components/molecules/SearchBar';
import FilterPanel from '@/components/molecules/FilterPanel';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import PropertyList from '@/components/organisms/PropertyList';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import propertyService from '@/services/api/propertyService';
import savedPropertyService from '@/services/api/savedPropertyService';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'newest'
  });

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (searchQuery) {
        result = await propertyService.search(searchQuery);
      } else {
        result = await propertyService.getAll(filters);
      }
      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProperties = async () => {
    try {
      const savedProps = await savedPropertyService.getAll();
      setSavedPropertyIds(savedProps.map(sp => sp.propertyId));
    } catch (err) {
      console.error('Failed to load saved properties:', err);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, searchQuery]);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ sortBy: 'newest' });
    setSearchQuery('');
  };

  const handleSaveToggle = () => {
    loadSavedProperties();
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'size-large', label: 'Size: Large to Small' },
    { value: 'size-small', label: 'Size: Small to Large' }
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <Text variant="display" weight="bold" size="3xl" color="primary" className="mb-2">
                Discover Your Dream Home
              </Text>
              <Text color="muted" size="lg">
                Explore premium properties in the most desirable locations
              </Text>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block lg:w-96">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="lg:hidden mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>Filters</span>
                {Object.keys(filters).length > 1 && (
                  <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                    {Object.keys(filters).length - 1}
                  </span>
                )}
              </Button>

              {/* Sort */}
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              {/* Results Count */}
              {!loading && (
                <Text color="muted" size="sm">
                  {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} found
                </Text>
              )}

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-accent shadow-sm' 
                      : 'text-gray-500 hover:text-accent'
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-accent shadow-sm' 
                      : 'text-gray-500 hover:text-accent'
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:w-80"
            >
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClear={handleClearFilters}
              />
            </motion.div>
          )}

          {/* Properties Content */}
          <div className={`flex-1 ${showFilters ? 'lg:pl-0' : ''}`}>
            {loading && (
              <SkeletonLoader count={6} variant={viewMode} />
            )}

            {error && (
              <ErrorState
                title="Failed to load properties"
                message={error}
                onRetry={loadProperties}
              />
            )}

            {!loading && !error && properties.length === 0 && (
              <EmptyState
                icon="Search"
                title="No properties found"
                description={searchQuery 
                  ? `No properties match "${searchQuery}". Try adjusting your search or filters.`
                  : "No properties match your current filters. Try adjusting your criteria."
                }
              />
            )}

            {!loading && !error && properties.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <PropertyGrid
                    properties={properties}
                    savedPropertyIds={savedPropertyIds}
                    onSaveToggle={handleSaveToggle}
                  />
                ) : (
                  <PropertyList
                    properties={properties}
                    savedPropertyIds={savedPropertyIds}
                    onSaveToggle={handleSaveToggle}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Browse;