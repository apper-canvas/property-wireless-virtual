import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFound = () => {
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const iconAnimation = {
    y: [0, -10, 0],
    rotate: [0, -5, 5, 0],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex items-center justify-center"
    >
      <div className="text-center px-4">
        <motion.div
          animate={iconAnimation}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Home" className="w-12 h-12 text-accent" />
          </div>
        </motion.div>

        <Text variant="display" weight="bold" size="4xl" color="primary" className="mb-4">
          404
        </Text>
        
        <Text variant="heading" weight="semibold" size="2xl" className="mb-4">
          Property Not Found
        </Text>
        
        <Text color="muted" size="lg" className="mb-8 max-w-md mx-auto">
          The property you're looking for seems to have moved or doesn't exist. 
          Let's help you find your dream home instead.
        </Text>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Home" className="w-5 h-5" />
              <span>Browse Properties</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              size="lg"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              <span>Go Back</span>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex items-center justify-center space-x-8 opacity-50">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
            className="w-4 h-4 bg-accent/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
            className="w-4 h-4 bg-accent/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
            className="w-4 h-4 bg-accent/20 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;