
import React from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import SportBadge from './SportBadge';

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
    <Link to={`/match/${id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="p-4 flex flex-col space-y-4">
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

          <div className="grid grid-cols-7 items-center">
            <div className="col-span-3 flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                <img 
                  src={homeTeam.logo || '/placeholder.svg'} 
                  alt={homeTeam.name} 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{homeTeam.name}</div>
                {(isLive || isFinished) && (
                  <div className="text-2xl font-bold">{homeTeam.score}</div>
                )}
              </div>
            </div>

            <div className="col-span-1 flex justify-center">
              <div className="text-xl font-bold text-muted-foreground">vs</div>
            </div>

            <div className="col-span-3 flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                <img 
                  src={awayTeam.logo || '/placeholder.svg'} 
                  alt={awayTeam.name} 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{awayTeam.name}</div>
                {(isLive || isFinished) && (
                  <div className="text-2xl font-bold">{awayTeam.score}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CardFooter className="bg-muted/50 p-3 flex justify-between">
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
  );
};

export default MatchCard;
