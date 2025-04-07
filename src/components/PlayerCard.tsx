
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from './StarRating';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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

  return (
    <Link to={`/player/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={photoUrl} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="text-sm text-muted-foreground mb-2">
              {position}
            </div>

            <div className="mt-2 flex items-center space-x-1">
              <StarRating initialRating={rating} readonly size={16} />
              <span className="text-xs text-muted-foreground">
                ({totalRatings})
              </span>
            </div>
            
            <div className="mt-3 flex items-center">
              {teamLogo ? (
                <img src={teamLogo} alt={teamName} className="h-6 w-6 mr-2" />
              ) : null}
              <span className="text-sm">{teamName}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-3 flex justify-between">
          <Badge variant="outline" className="text-xs">
            {sport.toUpperCase()}
          </Badge>
          <span className="text-xs text-primary font-medium">View Profile</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PlayerCard;
