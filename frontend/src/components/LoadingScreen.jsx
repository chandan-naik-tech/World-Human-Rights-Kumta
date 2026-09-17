import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy-royal dark:bg-navy-dark text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* Scale symbol */}
        <div className="text-6xl mb-4 animate-bounce">⚖️</div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-center px-4 font-serif">
          WORLD HUMAN RIGHTS
        </h1>
        <p className="text-gold text-sm tracking-widest mt-2 uppercase font-medium">
          WHR RK Foundations Kumta
        </p>

        {/* Linear Loading Indicator */}
        <div className="w-48 h-1 bg-navy-deep rounded-full overflow-hidden mt-8">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
            className="relative h-full w-full bg-gold"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
