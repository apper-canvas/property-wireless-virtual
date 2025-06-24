import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import savedPropertyService from '@/services/api/savedPropertyService';

const PropertyCard = ({ property, saved = false, onSaveToggle }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(saved);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (isSaved) {
        // Find and remove from saved properties
        const savedProps = await savedPropertyService.getAll();
        const savedProp = savedProps.find(sp => sp.propertyId === property.Id.toString());
        if (savedProp) {
          await savedPropertyService.delete(savedProp.Id);
          toast.success('Property removed from saved');
        }
        setIsSaved(false);
      } else {
        // Add to saved properties
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

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <Text variant="display" weight="bold" size="lg" color="primary">
              {formatPrice(property.price)}
            </Text>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 disabled:opacity-50"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon 
              name="Heart" 
              className={`w-5 h-5 transition-colors duration-200 ${
                isSaved ? 'text-error fill-current' : 'text-gray-600'
              }`} 
            />
          </motion.div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <Text variant="display" weight="semibold" size="xl" className="mb-1 line-clamp-1">
            {property.title}
          </Text>
          <Text color="muted" size="sm" className="line-clamp-1">
            {property.address.fullAddress}
          </Text>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Bed" className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Bath" className="w-4 h-4" />
            <span>{property.bathrooms}</span>
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
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;