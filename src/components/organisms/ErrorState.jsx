import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading the content.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, -5, 5, 0] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
      </motion.div>

      <Text variant="heading" weight="semibold" size="xl" className="mb-2">
        {title}
      </Text>
      
      <Text color="muted" className="mb-6 max-w-md">
        {message}
      </Text>

      {showRetry && onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onRetry} className="flex items-center space-x-2">
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;