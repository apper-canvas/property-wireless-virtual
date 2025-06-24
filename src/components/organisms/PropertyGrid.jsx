import { motion } from 'framer-motion';
import PropertyCard from '@/components/molecules/PropertyCard';

const PropertyGrid = ({ properties, savedPropertyIds = [], onSaveToggle }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {properties.map((property) => (
        <motion.div key={property.Id} variants={itemVariants}>
          <PropertyCard
            property={property}
            saved={savedPropertyIds.includes(property.Id.toString())}
            onSaveToggle={onSaveToggle}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;