import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import MapComponent from '@/components/organisms/MapComponent';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import propertyService from '@/services/api/propertyService';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

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

  useEffect(() => {
    loadProperties();
  }, [filters, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

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
      className="h-screen bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Text variant="display" weight="bold" size="2xl" color="primary" className="mb-1">
                Property Map
              </Text>
              <Text color="muted">
                Explore properties by location
              </Text>
            </div>

            {/* Search */}
            <div className="w-full sm:w-96">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search by location or property name..."
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <Text size="sm" color="muted">
                  {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} shown
                </Text>
              </div>
              
              {searchQuery && (
                <div className="flex items-center space-x-2">
                  <Text size="sm" color="muted">
                    Results for "{searchQuery}"
                  </Text>
                  <button
                    onClick={handleClearSearch}
                    className="text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="flex-1 overflow-hidden">
        {loading && (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <Text color="muted">Loading map...</Text>
            </div>
          </div>
        )}

        {error && (
          <div className="h-full flex items-center justify-center">
            <ErrorState
              title="Failed to load map"
              message={error}
              onRetry={loadProperties}
            />
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              icon="MapPin"
              title="No properties to display"
              description={searchQuery 
                ? `No properties found for "${searchQuery}". Try a different search term.`
                : "No properties available to show on the map."
              }
            />
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="h-full">
            <MapComponent properties={properties} />
          </div>
        )}
      </div>

      {/* Map Legend - Floating */}
      {!loading && !error && properties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-10"
        >
          <Text weight="medium" size="sm" className="mb-3">Map Legend</Text>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-accent rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <ApperIcon name="Home" className="w-3 h-3 text-white" />
              </div>
              <Text size="sm" color="muted">Available Property</Text>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <Text size="sm" color="muted">Price Label</Text>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MapView;