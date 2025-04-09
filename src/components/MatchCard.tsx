
import React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link to={`/match/${id}`} className="block h-full">
        <Card className="overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
          <div className="p-4 flex flex-col space-y-4 flex-grow">
            <div className="flex items-center justify-between">
              <SportBadge sport={sport} />
              {isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              )}
              {isFinished && (
                <Badge variant="secondary">FINAL</Badge>
              )}
              {isUpcoming && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {new Date(date).toLocaleDateString()}
                </div>
              )}
            </div>

            <AspectRatio ratio={16/9} className="mt-2">
              <div className="grid grid-cols-7 items-center h-full">
                <motion.div 
                  className="col-span-3 flex flex-col items-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                    <img 
                      src={homeTeam.logo || '/placeholder.svg'} 
                      alt={homeTeam.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm truncate max-w-[100px]">{homeTeam.name}</div>
                    {(isLive || isFinished) && (
                      <motion.div 
                        className="text-2xl font-bold"
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
                  <div className="text-xl font-bold text-muted-foreground">vs</div>
                </div>

                <motion.div 
                  className="col-span-3 flex flex-col items-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                    <img 
                      src={awayTeam.logo || '/placeholder.svg'} 
                      alt={awayTeam.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm truncate max-w-[100px]">{awayTeam.name}</div>
                    {(isLive || isFinished) && (
                      <motion.div 
                        className="text-2xl font-bold"
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
          </div>

          <CardFooter className="bg-muted/50 p-3 flex justify-between mt-auto">
            {isLive ? (
              <div className="flex items-center text-xs font-medium text-destructive">
                <Clock className="h-3 w-3 mr-1" />
                LIVE NOW
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {isUpcoming ? 'Upcoming Match' : 'View Match Details'}
              </div>
            )}
            <div className="text-xs font-medium text-primary">
              Rate Players →
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default MatchCard;
