
import React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import SportBadge from './SportBadge';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MatchCardProps {
  id: string;
  homeTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  date: Date;
  status: 'upcoming' | 'live' | 'finished';
  sport: 'nfl' | 'nba' | 'soccer';
}

const MatchCard = ({
  id,
  homeTeam,
  awayTeam,
  date,
  status,
  sport
}: MatchCardProps) => {
  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const isUpcoming = status === 'upcoming';

  // Get sport-specific color
  const getSportColorClass = () => {
    switch(sport) {
      case 'nfl': return 'from-[hsl(var(--sport-nfl))/90%] to-[hsl(var(--sport-nfl))/30%]';
      case 'nba': return 'from-[hsl(var(--sport-nba))/90%] to-[hsl(var(--sport-nba))/30%]';
      case 'soccer': return 'from-[hsl(var(--sport-soccer))/90%] to-[hsl(var(--sport-soccer))/30%]';
      default: return 'from-primary to-primary/30';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/match/${id}`} className="block h-full">
        <Card className="overflow-hidden h-full flex flex-col border-0 shadow-md">
          <div className={`bg-gradient-to-b ${getSportColorClass()} p-3 flex flex-col space-y-2 flex-grow relative`}>
            {/* Status Badges */}
            <div className="flex items-center justify-between mb-1">
              <SportBadge sport={sport} className="bg-black/30 backdrop-blur-sm border border-white/20 text-xs" />
              {isLive && (
                <Badge variant="destructive" className="animate-pulse bg-black/30 backdrop-blur-sm border border-white/20 text-xs">
                  LIVE
                </Badge>
              )}
              {isFinished && (
                <Badge variant="secondary" className="bg-black/30 backdrop-blur-sm border border-white/20 text-white text-xs">
                  FINAL
                </Badge>
              )}
              {isUpcoming && (
                <div className="flex items-center text-[10px] text-white bg-black/30 backdrop-blur-sm py-0.5 px-2 rounded-full border border-white/20">
                  <CalendarIcon className="h-2.5 w-2.5 mr-1" />
                  {new Date(date).toLocaleDateString()}
                </div>
              )}
            </div>

            <AspectRatio ratio={16/9} className="mt-1 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="grid grid-cols-7 items-center h-full">
                <motion.div 
                  className="col-span-3 flex flex-col items-center"
                  whileHover={{ y: -3 }}
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-1 border border-white/30">
                    <img 
                      src={homeTeam.logo || '/placeholder.svg'} 
                      alt={homeTeam.name} 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs truncate max-w-[80px] text-white">{homeTeam.name}</div>
                    {(isLive || isFinished) && (
                      <motion.div 
                        className="text-xl font-bold text-white"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {homeTeam.score}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <div className="col-span-1 flex justify-center">
                  <div className="text-sm font-bold text-white">vs</div>
                </div>

                <motion.div 
                  className="col-span-3 flex flex-col items-center"
                  whileHover={{ y: -3 }}
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-1 border border-white/30">
                    <img 
                      src={awayTeam.logo || '/placeholder.svg'} 
                      alt={awayTeam.name} 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs truncate max-w-[80px] text-white">{awayTeam.name}</div>
                    {(isLive || isFinished) && (
                      <motion.div 
                        className="text-xl font-bold text-white"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {awayTeam.score}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </AspectRatio>

            {/* Card Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"></div>
          </div>

          <div className="bg-black text-white p-2 flex justify-between mt-auto border-t border-white/10 text-xs">
            {isLive ? (
              <div className="flex items-center text-xs font-medium text-red-400">
                <Clock className="h-3 w-3 mr-1" />
                LIVE
              </div>
            ) : (
              <div className="text-xs text-white/70">
                {isUpcoming ? 'Upcoming' : 'View Details'}
              </div>
            )}
            <div className="text-xs font-medium text-white/90">
              Rate →
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default MatchCard;
