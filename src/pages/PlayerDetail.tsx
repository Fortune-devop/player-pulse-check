
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
  getPlayerById,
  getTeamById,
  getPlayerRatingsByPlayerId,
  calculateAverageRating
} from '@/data/mockData';

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Player not found</div>;
  }

  const player = getPlayerById(id);
  
  if (!player) {
    return <div>Player not found</div>;
  }

  const team = getTeamById(player.teamId);
  
  if (!team) {
    return <div>Team data not found</div>;
  }

  const playerRatings = getPlayerRatingsByPlayerId(player.id);
  const averageRating = calculateAverageRating(player.id);
  
  // Create a mock trend indicator (in a real app, this would compare ratings over time)
  const getRatingTrend = () => {
    const randomValue = Math.random();
    if (randomValue > 0.7) return "up";
    if (randomValue > 0.4) return "stable";
    return "down";
  };
  
  const ratingTrend = getRatingTrend();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Player Profile Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <Avatar className="h-32 w-32 border-4 border-white">
                  <AvatarImage src={player.photoUrl} />
                  <AvatarFallback className="text-4xl">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                  <div className="flex items-center justify-center md:justify-start">
                    <img src={team.logo} alt={team.name} className="w-6 h-6 mr-2" />
                    <span>{team.name}</span>
                  </div>
                  <div className="hidden md:block text-white/60">•</div>
                  <div>{player.position}</div>
                  {player.number && (
                    <>
                      <div className="hidden md:block text-white/60">•</div>
                      <div>#{player.number}</div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-center md:justify-start">
                  <div className="bg-white/20 rounded-lg py-1.5 px-3 flex items-center">
                    <StarRating initialRating={averageRating} readonly size={16} />
                    <span className="ml-2 font-medium">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-white/70 ml-1">
                      ({playerRatings.length} {playerRatings.length === 1 ? 'rating' : 'ratings'})
                    </span>
                    
                    {ratingTrend === "up" && (
                      <TrendingUp className="w-4 h-4 ml-2 text-green-300" />
                    )}
                    {ratingTrend === "down" && (
                      <TrendingDown className="w-4 h-4 ml-2 text-red-300" />
                    )}
                    {ratingTrend === "stable" && (
                      <Minus className="w-4 h-4 ml-2 text-white/70" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Player Bio & Stats */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Bio */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Player Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Bio</h3>
                        <p className="text-muted-foreground">
                          {player.bio || "No bio information available."}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Team</h3>
                        <div className="flex items-center">
                          <img src={team.logo} alt={team.name} className="w-8 h-8 mr-2" />
                          <span>{team.name}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Position</h3>
                        <p>{player.position}</p>
                      </div>
                      
                      {player.number && (
                        <>
                          <Separator />
                          <div>
                            <h3 className="font-medium mb-2">Jersey Number</h3>
                            <p>#{player.number}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column: Ratings & Reviews */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Fan Ratings & Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {playerRatings.length > 0 ? (
                      <div className="space-y-4">
                        {playerRatings.map(rating => (
                          <div key={rating.id} className="bg-muted/40 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <StarRating initialRating={rating.rating} readonly size={16} />
                              <span className="text-xs text-muted-foreground">
                                {new Date(rating.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {rating.comment && (
                              <div className="flex items-start mt-2 space-x-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <p className="text-sm">{rating.comment}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-medium mb-1">No Ratings Yet</h3>
                        <p className="text-muted-foreground">
                          Be the first to rate this player's performance.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlayerDetail;
