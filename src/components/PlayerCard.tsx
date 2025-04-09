
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Shirt, Award, Star } from 'lucide-react';

interface PlayerCardProps {
  id: string;
  name: string;
  position: string;
  teamName: string;
  teamLogo?: string;
  photoUrl?: string;
  rating?: number;
  totalRatings?: number;
  sport: 'nfl' | 'nba' | 'soccer';
}

const PlayerCard = ({
  id,
  name,
  position,
  teamName,
  teamLogo,
  photoUrl,
  rating = 0,
  totalRatings = 0,
  sport,
}: PlayerCardProps) => {
  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Get sport-specific color
  const getSportColorClass = () => {
    switch(sport) {
      case 'nfl': return 'from-[hsl(var(--sport-nfl))] to-[hsl(var(--sport-nfl))/60%]';
      case 'nba': return 'from-[hsl(var(--sport-nba))] to-[hsl(var(--sport-nba))/60%]';
      case 'soccer': return 'from-[hsl(var(--sport-soccer))] to-[hsl(var(--sport-soccer))/60%]';
      default: return 'from-primary to-primary/60';
    }
  };

  // Generate a random rating number for display (this would come from real data in a real app)
  const generateSportSpecificRating = () => {
    return Math.floor(70 + Math.random() * 30);
  };

  const overallRating = generateSportSpecificRating();

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="perspective-800"
    >
      <Link to={`/player/${id}`}>
        <Card className="overflow-hidden border-0 shadow-lg bg-transparent">
          <AspectRatio ratio={2/3} className="w-full">
            <div className={`bg-gradient-to-b ${getSportColorClass()} h-full w-full relative rounded-lg overflow-hidden border border-white/20 shadow-xl`}>
              {/* Top Rating Badge */}
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white rounded-full px-3 py-1 font-bold text-lg flex items-center gap-1 border border-white/30 shadow z-20">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{overallRating}</span>
              </div>

              {/* Position Badge */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white rounded-full px-2.5 py-0.5 font-bold text-sm border border-white/30 z-20">
                {position}
              </div>

              {/* Sport Badge */}
              <div className="absolute top-12 right-2 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm text-white rounded-full w-8 h-8 flex items-center justify-center border border-white/30 z-20">
                {sport === 'nfl' && <Award className="h-4 w-4" />}
                {sport === 'nba' && <Star className="h-4 w-4" />}
                {sport === 'soccer' && <Shirt className="h-4 w-4" />}
              </div>

              {/* Player Image Area - Full Size */}
              <div className="absolute inset-0 z-10">
                {photoUrl ? (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                    <img 
                      src={photoUrl} 
                      alt={name} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="text-4xl font-bold text-white/50">
                      {getInitials(name)}
                    </div>
                  </div>
                )}
              </div>

              {/* Team Logo */}
              <div className="absolute bottom-24 right-2 bg-white rounded-full p-1 border border-gray-200 shadow-md z-20">
                {teamLogo && <img src={teamLogo} alt={teamName} className="h-8 w-8" />}
              </div>

              {/* Bottom Information Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm p-3 border-t border-white/20 z-20">
                <h3 className="font-bold text-base text-white truncate">{name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    <StarRating initialRating={rating} readonly size={12} />
                    <span className="ml-1 text-xs text-white/70">
                      ({totalRatings})
                    </span>
                  </div>
                  <span className="text-xs text-white/70">{teamName}</span>
                </div>
              </div>

              {/* Card Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 rounded-lg z-10"></div>
              
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-5 z-0">
                <div className="h-full w-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
              </div>
            </div>
          </AspectRatio>
        </Card>
      </Link>
    </motion.div>
  );
};

export default PlayerCard;
