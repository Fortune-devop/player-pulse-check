
import React from 'react';
import { cn } from '@/lib/utils';

type SportType = 'nfl' | 'nba' | 'soccer';

interface SportBadgeProps {
  sport: SportType;
  className?: string;
}

const SportBadge = ({ sport, className }: SportBadgeProps) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-md",
        `sport-badge-${sport}`,
        className
      )}
    >
      {sport.toUpperCase()}
    </div>
  );
};

export default SportBadge;
