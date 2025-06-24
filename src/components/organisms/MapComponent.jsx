import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const MapComponent = ({ properties }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Simulate map regions for demonstration
  const mapRegions = [
    { id: 'malibu', name: 'Malibu', x: '15%', y: '60%', properties: properties.filter(p => p.address.city === 'Malibu') },
    { id: 'la', name: 'Los Angeles', x: '25%', y: '65%', properties: properties.filter(p => p.address.city === 'Los Angeles') },
    { id: 'sf', name: 'San Francisco', x: '20%', y: '25%', properties: properties.filter(p => p.address.city === 'San Francisco') },
    { id: 'aspen', name: 'Aspen', x: '60%', y: '40%', properties: properties.filter(p => p.address.city === 'Aspen') },
    { id: 'greenwich', name: 'Greenwich', x: '80%', y: '35%', properties: properties.filter(p => p.address.city === 'Greenwich') }
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
      {/* Simulated Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
        {/* Decorative Map Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-blue-200/30 rounded-full blur-sm" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-200/30 rounded-full blur-sm" />
        <div className="absolute bottom-1/3 left-1/2 w-20 h-40 bg-blue-300/20 rounded-full blur-md" />
      </div>

      {/* Property Markers */}
      {mapRegions.map((region) => 
        region.properties.map((property, index) => (
          <motion.button
            key={property.Id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMarkerClick(property)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ 
              left: `calc(${region.x} + ${index * 15}px)`, 
              top: `calc(${region.y} + ${index * 10}px)` 
            }}
          >
            <div className="relative">
              {/* Marker Pin */}
              <div className="w-8 h-8 bg-accent rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <ApperIcon name="Home" className="w-4 h-4 text-white" />
              </div>
              
              {/* Price Label */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-accent whitespace-nowrap shadow-sm">
                {formatPrice(property.price)}
              </div>
            </div>
          </motion.button>
        ))
      )}

      {/* Region Labels */}
      {mapRegions.filter(region => region.properties.length > 0).map((region) => (
        <div
          key={region.id}
          className="absolute transform -translate-x-1/2 text-gray-600 font-medium text-sm"
          style={{ left: region.x, top: `calc(${region.y} + 60px)` }}
        >
          {region.name}
        </div>
      ))}

      {/* Property Info Card */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 z-20"
        >
          <div className="flex items-start space-x-4">
            {/* Property Image */}
            <div className="w-24 h-18 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Text variant="display" weight="semibold" size="lg" className="line-clamp-1 mb-1">
                    {selectedProperty.title}
                  </Text>
                  <Text color="muted" size="sm" className="line-clamp-1 mb-2">
                    {selectedProperty.address.fullAddress}
                  </Text>
                  
                  {/* Property Details */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Bed" className="w-3 h-3" />
                      <span>{selectedProperty.bedrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Bath" className="w-3 h-3" />
                      <span>{selectedProperty.bathrooms}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Square" className="w-3 h-3" />
                      <span>{new Intl.NumberFormat('en-US').format(selectedProperty.squareFeet)} sqft</span>
                    </div>
                  </div>

                  <Text variant="display" weight="bold" size="lg" color="primary">
                    {formatPrice(selectedProperty.price)}
                  </Text>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => handlePropertyClick(selectedProperty.Id)}
                >
                  View Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="p-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
          <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
          <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
        <Text weight="medium" size="sm" className="mb-2">Property Locations</Text>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-accent rounded-full border border-white"></div>
          <Text size="xs" color="muted">Available Properties</Text>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;