import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, variant = 'card' }) => {
  const shimmer = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  };

  const CardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmer}
          animate="animate"
        />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title and Address */}
        <div className="space-y-2">
          <div className="relative h-6 bg-gray-200 rounded overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmer}
              animate="animate"
            />
          </div>
          <div className="relative h-4 bg-gray-200 rounded w-3/4 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmer}
              animate="animate"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="flex space-x-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative h-4 bg-gray-200 rounded w-16 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                animate="animate"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmer}
              animate="animate"
            />
          </div>
          <div className="relative h-4 bg-gray-200 rounded w-2/3 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmer}
              animate="animate"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative h-6 bg-gray-200 rounded-full w-20 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                animate="animate"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex">
        {/* Image Skeleton */}
        <div className="relative w-64 h-48 bg-gray-200 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmer}
            animate="animate"
          />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6 space-y-4">
          <div className="space-y-2">
            <div className="relative h-6 bg-gray-200 rounded overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                animate="animate"
              />
            </div>
            <div className="relative h-4 bg-gray-200 rounded w-3/4 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                animate="animate"
              />
            </div>
          </div>

          <div className="flex space-x-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative h-4 bg-gray-200 rounded w-20 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmer}
                  animate="animate"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="relative h-4 bg-gray-200 rounded overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                animate="animate"
              />
            </div>
            <div className="relative h-4 bg-gray-200 rounded w-2/3 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmer}
                animate="animate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="animate-pulse"
    >
      {variant === 'card' ? <CardSkeleton /> : <ListSkeleton />}
    </motion.div>
  ));

  return variant === 'card' ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {skeletons}
    </div>
  ) : (
    <div className="space-y-4">
      {skeletons}
    </div>
  );
};

export default SkeletonLoader;