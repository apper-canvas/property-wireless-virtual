import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const EmptyState = ({ 
  icon = "Home",
  title = "No properties found", 
  description = "Try adjusting your search criteria or filters to find properties.", 
  actionLabel,
  onAction,
  showAction = false 
}) => {
  const iconAnimation = {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "easeInOut"
    }
  };

  const buttonAnimation = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={iconAnimation}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-accent" />
        </div>
      </motion.div>

      <Text variant="heading" weight="semibold" size="2xl" className="mb-2">
        {title}
      </Text>
      
      <Text color="muted" size="lg" className="mb-8 max-w-lg">
        {description}
      </Text>

      {showAction && actionLabel && onAction && (
        <motion.div
          variants={buttonAnimation}
          whileHover="hover"
          whileTap="tap"
        >
          <Button onClick={onAction} size="lg" className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>{actionLabel}</span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;