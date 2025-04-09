
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type SportType = 'nfl' | 'nba' | 'soccer';

interface SportBadgeProps {
  sport: SportType;
  className?: string;
}

const SportBadge = ({ sport, className }: SportBadgeProps) => {
  return (
    <motion.div 
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-md",
        `sport-badge-${sport}`,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {sport.toUpperCase()}
    </motion.div>
  );
};

export default SportBadge;
