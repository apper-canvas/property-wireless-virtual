import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ContactForm from "@/components/molecules/ContactForm";
import savedPropertyService from "@/services/api/savedPropertyService";
import propertyService from "@/services/api/propertyService";
import ApperIcon from "@/components/ApperIcon";
import ImageGallery from "@/components/molecules/ImageGallery";
import SkeletonLoader from "@/components/organisms/SkeletonLoader";
import ErrorState from "@/components/organisms/ErrorState";
import Text from "@/components/atoms/Text";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyService.getById(id);
      setProperty(result);
      
      // Check if property is saved
      const isPropertySaved = await savedPropertyService.isPropertySaved(id);
      setIsSaved(isPropertySaved);
    } catch (err) {
      setError(err.message || 'Failed to load property');
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSaveToggle = async () => {
    setSaving(true);
    
    try {
      if (isSaved) {
        const savedProps = await savedPropertyService.getAll();
        const savedProp = savedProps.find(sp => sp.propertyId === id);
        if (savedProp) {
          await savedPropertyService.delete(savedProp.Id);
          toast.success('Property removed from saved');
        }
        setIsSaved(false);
      } else {
        await savedPropertyService.create({
          propertyId: id,
          notes: ''
        });
        toast.success('Property saved successfully');
        setIsSaved(true);
      }
    } catch (error) {
      toast.error('Failed to update saved properties');
    } finally {
      setSaving(false);
    }
  };

const handleContactToggle = () => {
    setShowContactForm(prev => !prev);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <SkeletonLoader count={1} variant="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title="Property not found"
          message={error}
          onRetry={loadProperty}
        />
      </div>
    );
  }

  if (!property) {
    return null;
  }

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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-accent transition-colors duration-200 mb-6"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          <Text size="sm">Back to Properties</Text>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images - Left Column */}
          <div className="lg:col-span-2">
            <ImageGallery images={property.images} title={property.title} />
          </div>

          {/* Property Info - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Price */}
              <div className="mb-6">
                <Text variant="display" weight="bold" size="3xl" color="primary" className="mb-2">
                  {formatPrice(property.price)}
                </Text>
                <Badge variant="success" size="sm">
                  {property.status}
                </Badge>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ApperIcon name="Bed" className="w-5 h-5 text-accent" />
                  </div>
                  <Text weight="semibold" size="lg">{property.bedrooms}</Text>
                  <Text color="muted" size="sm">Bedrooms</Text>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ApperIcon name="Bath" className="w-5 h-5 text-accent" />
                  </div>
                  <Text weight="semibold" size="lg">{property.bathrooms}</Text>
                  <Text color="muted" size="sm">Bathrooms</Text>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ApperIcon name="Square" className="w-5 h-5 text-accent" />
                  </div>
                  <Text weight="semibold" size="lg">{formatSquareFeet(property.squareFeet)}</Text>
                  <Text color="muted" size="sm">Sq Ft</Text>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <div className="flex items-start space-x-2">
                  <ApperIcon name="MapPin" className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <Text weight="medium" className="mb-1">{property.address.street}</Text>
                    <Text color="muted" size="sm">
                      {property.address.city}, {property.address.state} {property.address.zipCode}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Property Type & Listed Date */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Text color="muted" size="sm">Property Type</Text>
                  <Text weight="medium">{property.propertyType}</Text>
                </div>
                <div className="flex items-center justify-between">
                  <Text color="muted" size="sm">Listed</Text>
                  <Text weight="medium">{formatDate(property.listingDate)}</Text>
                </div>
              </div>

{/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContactToggle}
                  className="w-full flex items-center justify-center space-x-2"
                  size="lg"
                >
                  <ApperIcon name="MessageCircle" className="w-5 h-5" />
                  <span>{showContactForm ? 'Hide Contact Form' : 'Contact Agent'}</span>
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={handleSaveToggle}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2"
                  size="lg"
                >
                  <ApperIcon 
                    name="Heart" 
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isSaved ? 'text-error fill-current' : ''
                    }`} 
                  />
                  <span>{isSaved ? 'Remove from Saved' : 'Save Property'}</span>
                </Button>
              </div>

              {/* Contact Form */}
              <AnimatePresence>
                {showContactForm && (
                  <ContactForm
                    propertyId={property.Id}
                    propertyTitle={property.title}
                    onClose={() => setShowContactForm(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Property Description */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <Text variant="heading" weight="semibold" size="2xl" className="mb-6">
              About This Property
            </Text>
            
            <Text size="lg" className="mb-8 leading-relaxed">
              {property.description}
            </Text>

            {/* Amenities */}
            <div className="mb-8">
              <Text variant="heading" weight="semibold" size="xl" className="mb-4">
                Amenities & Features
              </Text>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-accent/5 rounded-lg"
                  >
                    <ApperIcon name="Check" className="w-4 h-4 text-accent flex-shrink-0" />
                    <Text size="sm" className="min-w-0">{amenity}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div>
              <Text variant="heading" weight="semibold" size="xl" className="mb-4">
                Property Details
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <Text color="muted">Property Type</Text>
                    <Text weight="medium">{property.propertyType}</Text>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <Text color="muted">Bedrooms</Text>
                    <Text weight="medium">{property.bedrooms}</Text>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <Text color="muted">Bathrooms</Text>
                    <Text weight="medium">{property.bathrooms}</Text>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <Text color="muted">Square Feet</Text>
                    <Text weight="medium">{formatSquareFeet(property.squareFeet)}</Text>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <Text color="muted">Price per Sq Ft</Text>
                    <Text weight="medium">
                      {formatPrice(Math.round(property.price / property.squareFeet))}
                    </Text>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <Text color="muted">Status</Text>
                    <Badge variant="success" size="sm">{property.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetail;