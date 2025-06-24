import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import savedPropertyService from '@/services/api/savedPropertyService';
import propertyService from '@/services/api/propertyService';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const savedProps = await savedPropertyService.getAll();
      setSavedProperties(savedProps);
      
      // Load full property details for each saved property
      const propertyPromises = savedProps.map(savedProp => 
        propertyService.getById(savedProp.propertyId)
      );
      
      const propertyResults = await Promise.all(propertyPromises);
      setProperties(propertyResults);
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const handleSaveToggle = () => {
    loadSavedProperties();
  };

  const handleClearAll = async () => {
    if (savedProperties.length === 0) return;
    
    const confirmed = window.confirm('Are you sure you want to remove all saved properties?');
    if (!confirmed) return;

    try {
      const deletePromises = savedProperties.map(savedProp => 
        savedPropertyService.delete(savedProp.Id)
      );
      
      await Promise.all(deletePromises);
      toast.success('All saved properties removed');
      loadSavedProperties();
    } catch (error) {
      toast.error('Failed to clear saved properties');
    }
  };

  const getSavedPropertyIds = () => {
    return savedProperties.map(sp => sp.propertyId);
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
      className="min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <ApperIcon name="Heart" className="w-8 h-8 text-error" />
                <Text variant="display" weight="bold" size="3xl" color="primary">
                  Saved Properties
                </Text>
              </div>
              <Text color="muted" size="lg">
                Properties you've saved for later viewing
              </Text>
            </div>

            {properties.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleClearAll}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                <span>Clear All</span>
              </Button>
            )}
          </div>

          {/* Stats */}
          {!loading && properties.length > 0 && (
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="w-4 h-4 text-error" />
                <span>{properties.length} saved propert{properties.length !== 1 ? 'ies' : 'y'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>
                  Last saved: {new Date(Math.max(...savedProperties.map(sp => new Date(sp.savedDate)))).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading && (
          <SkeletonLoader count={6} variant="card" />
        )}

        {error && (
          <ErrorState
            title="Failed to load saved properties"
            message={error}
            onRetry={loadSavedProperties}
          />
        )}

        {!loading && !error && properties.length === 0 && (
          <EmptyState
            icon="Heart"
            title="No saved properties yet"
            description="Start browsing properties and save your favorites to see them here. Saved properties make it easy to compare and revisit properties you're interested in."
            actionLabel="Browse Properties"
            showAction={true}
            onAction={() => window.location.href = '/'}
          />
        )}

        {!loading && !error && properties.length > 0 && (
          <div>
            {/* Saved Properties Grid */}
            <PropertyGrid
              properties={properties}
              savedPropertyIds={getSavedPropertyIds()}
              onSaveToggle={handleSaveToggle}
            />

            {/* Additional Actions */}
            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <ApperIcon name="Lightbulb" className="w-12 h-12 text-accent mx-auto mb-4" />
                <Text variant="heading" weight="semibold" size="xl" className="mb-2">
                  Ready to Take the Next Step?
                </Text>
                <Text color="muted" size="lg" className="mb-6">
                  Contact our agents to schedule viewings or get more information about your saved properties.
                </Text>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    onClick={() => toast.success('Agent contact initiated!')}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    <span>Contact Agent</span>
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => window.location.href = '/'}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Search" className="w-4 h-4" />
                    <span>Find More Properties</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavedProperties;