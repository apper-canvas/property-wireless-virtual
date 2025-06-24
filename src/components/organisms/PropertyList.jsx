import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import savedPropertyService from '@/services/api/savedPropertyService';

const PropertyList = ({ properties, savedPropertyIds = [], onSaveToggle }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const PropertyListItem = ({ property, saved }) => {
    const [isSaved, setIsSaved] = useState(saved);
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveToggle = async (e) => {
      e.stopPropagation();
      setIsLoading(true);

      try {
        if (isSaved) {
          const savedProps = await savedPropertyService.getAll();
          const savedProp = savedProps.find(sp => sp.propertyId === property.Id.toString());
          if (savedProp) {
            await savedPropertyService.delete(savedProp.Id);
            toast.success('Property removed from saved');
          }
          setIsSaved(false);
        } else {
          await savedPropertyService.create({
            propertyId: property.Id.toString(),
            notes: ''
          });
          toast.success('Property saved successfully');
          setIsSaved(true);
        }
        
        if (onSaveToggle) {
          onSaveToggle();
        }
      } catch (error) {
        toast.error('Failed to update saved properties');
      } finally {
        setIsLoading(false);
      }
    };

    const handleClick = () => {
      navigate(`/property/${property.Id}`);
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4, transition: { duration: 0.2 } }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-64 h-48 flex-shrink-0 overflow-hidden">
            <motion.img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Price Badge */}
            <div className="absolute top-3 left-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
                <Text variant="display" weight="bold" size="sm" color="primary">
                  {formatPrice(property.price)}
                </Text>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveToggle}
              disabled={isLoading}
              className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 disabled:opacity-50"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isSaved ? 'text-error fill-current' : 'text-gray-600'
                  }`} 
                />
              </motion.div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 min-w-0">
            <div className="mb-3">
              <Text variant="display" weight="semibold" size="lg" className="mb-1 line-clamp-1">
                {property.title}
              </Text>
              <Text color="muted" size="sm" className="line-clamp-1">
                {property.address.fullAddress}
              </Text>
            </div>

            {/* Property Details */}
            <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bed" className="w-4 h-4" />
                <span>{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Bath" className="w-4 h-4" />
                <span>{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Square" className="w-4 h-4" />
                <span>{formatSquareFeet(property.squareFeet)} sqft</span>
              </div>
            </div>

            {/* Description */}
            <Text color="muted" size="sm" className="line-clamp-2 mb-4">
              {property.description}
            </Text>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {property.amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{property.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {properties.map((property) => (
        <motion.div key={property.Id} variants={itemVariants}>
          <PropertyListItem
            property={property}
            saved={savedPropertyIds.includes(property.Id.toString())}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyList;