import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FilterPanel = ({ filters, onFiltersChange, onClear }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    propertyType: true,
    bedsBaths: true,
    size: false,
    amenities: false
  });

  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];
  const amenitiesList = [
    'Ocean View', 'Mountain View', 'City View', 'Swimming Pool', 'Gourmet Kitchen',
    'Fireplace', 'Balcony', 'Garage', 'Garden', 'Hot Tub', 'Wine Cellar'
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('propertyTypes', newTypes);
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <Text weight="medium">{title}</Text>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Text weight="semibold" size="lg">Filters</Text>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Price
            </label>
            <Input
              type="number"
              value={filters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="No minimum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Price
            </label>
            <Input
              type="number"
              value={filters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="No maximum"
            />
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection
        title="Property Type"
        isExpanded={expandedSections.propertyType}
        onToggle={() => toggleSection('propertyType')}
      >
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.propertyTypes || []).includes(type)}
                onChange={() => handlePropertyTypeToggle(type)}
                className="rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Beds & Baths */}
      <FilterSection
        title="Beds & Baths"
        isExpanded={expandedSections.bedsBaths}
        onToggle={() => toggleSection('bedsBaths')}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bedrooms
            </label>
            <select
              value={filters.bedroomsMin || ''}
              onChange={(e) => handleFilterChange('bedroomsMin', e.target.value ? parseInt(e.target.value) : null)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Bathrooms
            </label>
            <select
              value={filters.bathroomsMin || ''}
              onChange={(e) => handleFilterChange('bathroomsMin', e.target.value ? parseFloat(e.target.value) : null)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            >
              <option value="">Any</option>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                <option key={num} value={num}>{num}+</option>
              ))}
            </select>
          </div>
        </div>
      </FilterSection>

      {/* Square Footage */}
      <FilterSection
        title="Square Footage"
        isExpanded={expandedSections.size}
        onToggle={() => toggleSection('size')}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Square Feet
          </label>
          <Input
            type="number"
            value={filters.squareFeetMin || ''}
            onChange={(e) => handleFilterChange('squareFeetMin', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="No minimum"
          />
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection
        title="Amenities"
        isExpanded={expandedSections.amenities}
        onToggle={() => toggleSection('amenities')}
      >
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.amenities || []).includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterPanel;