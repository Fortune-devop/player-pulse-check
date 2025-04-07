
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getMatchById, 
  getTeamById, 
  getPlayersByTeamId,
  getPlayerRatingsByMatchId,
  PlayerRating
} from '@/data/mockData';

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('homeTeam');
  const [playerComments, setPlayerComments] = useState<Record<string, string>>({});
  const [playerRatings, setPlayerRatings] = useState<Record<string, number>>({});

  if (!id) {
    return <div>Match not found</div>;
  }

  const match = getMatchById(id);
  
  if (!match) {
    return <div>Match not found</div>;
  }

  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);
  
  if (!homeTeam || !awayTeam) {
    return <div>Team data not found</div>;
  }

  const homeTeamPlayers = getPlayersByTeamId(match.homeTeamId);
  const awayTeamPlayers = getPlayersByTeamId(match.awayTeamId);
  const existingRatings = getPlayerRatingsByMatchId(match.id);

  const handleRatingChange = (playerId: string, rating: number) => {
    setPlayerRatings({
      ...playerRatings,
      [playerId]: rating
    });
  };

  const handleCommentChange = (playerId: string, comment: string) => {
    setPlayerComments({
      ...playerComments,
      [playerId]: comment
    });
  };

  const handleSubmitRating = (playerId: string) => {
    const rating = playerRatings[playerId];
    const comment = playerComments[playerId] || '';

    // In a real app, this would be an API call
    toast({
      title: "Rating submitted!",
      description: `You rated the player ${rating} stars.`,
    });

    // Clear the input fields
    setPlayerComments({
      ...playerComments,
      [playerId]: ''
    });
  };

  const getPlayerRatings = (playerId: string): PlayerRating[] => {
    return existingRatings.filter(rating => rating.playerId === playerId);
  };

  const calculateAverageRating = (playerId: string): number => {
    const ratings = getPlayerRatings(playerId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
    return parseFloat((sum / ratings.length).toFixed(1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Match Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-8">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                <Badge className="mb-2 bg-white/20">
                  {match.sport.toUpperCase()}
                </Badge>
                <h1 className="text-xl md:text-2xl font-bold mb-1">
                  {homeTeam.name} vs {awayTeam.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {match.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {match.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {match.venue}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 md:space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-1 mx-auto">
                    <img 
                      src={homeTeam.logo} 
                      alt={homeTeam.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="font-semibold">{homeTeam.name}</div>
                  {match.status !== 'upcoming' && (
                    <div className="text-2xl font-bold">{match.homeScore}</div>
                  )}
                </div>
                
                <div className="text-xl font-bold">vs</div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-1 mx-auto">
                    <img 
                      src={awayTeam.logo} 
                      alt={awayTeam.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="font-semibold">{awayTeam.name}</div>
                  {match.status !== 'upcoming' && (
                    <div className="text-2xl font-bold">{match.awayScore}</div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 flex justify-end">
                <div className={`
                  ${match.status === 'upcoming' ? 'bg-blue-500' : ''}
                  ${match.status === 'live' ? 'bg-red-500 animate-pulse' : ''}
                  ${match.status === 'finished' ? 'bg-gray-500' : ''}
                  px-4 py-1 rounded-full text-white text-sm font-medium
                `}>
                  {match.status === 'upcoming' && 'UPCOMING'}
                  {match.status === 'live' && 'LIVE'}
                  {match.status === 'finished' && 'FINAL'}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Player Ratings Section */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">Player Ratings</h2>
            
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="homeTeam">{homeTeam.name}</TabsTrigger>
                <TabsTrigger value="awayTeam">{awayTeam.name}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="homeTeam" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {homeTeamPlayers.map(player => {
                    const playerAvgRating = calculateAverageRating(player.id);
                    const numRatings = getPlayerRatings(player.id).length;
                    
                    return (
                      <Card key={player.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={player.photoUrl} />
                              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              {player.name}
                              <div className="text-sm text-muted-foreground font-normal">
                                {player.position} {player.number ? `#${player.number}` : ''}
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          {match.status !== 'upcoming' && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm text-muted-foreground">Community Rating</div>
                                <div className="flex items-center">
                                  <StarRating initialRating={playerAvgRating} readonly size={16} />
                                  <span className="text-sm ml-2">
                                    {playerAvgRating > 0 ? playerAvgRating : 'No ratings'} 
                                    {numRatings > 0 ? ` (${numRatings})` : ''}
                                  </span>
                                </div>
                              </div>
                              
                              {numRatings > 0 && getPlayerRatings(player.id).slice(0, 1).map(rating => (
                                <div key={rating.id} className="bg-muted/40 p-3 rounded-md text-sm flex items-start space-x-2">
                                  <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <div>
                                    <div className="text-muted-foreground mb-1">
                                      Fan said:
                                    </div>
                                    <p>{rating.comment}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Rate this player</h4>
                            <div className="mb-2">
                              <StarRating
                                initialRating={playerRatings[player.id] || 0}
                                onRatingChange={(rating) => handleRatingChange(player.id, rating)}
                              />
                            </div>
                            <Textarea
                              placeholder="Leave a comment about this player's performance..."
                              className="mb-3 resize-none h-20"
                              value={playerComments[player.id] || ''}
                              onChange={(e) => handleCommentChange(player.id, e.target.value)}
                            />
                            <Button
                              onClick={() => handleSubmitRating(player.id)}
                              disabled={!playerRatings[player.id]}
                              className="w-full"
                            >
                              Submit Rating
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="awayTeam" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {awayTeamPlayers.map(player => {
                    const playerAvgRating = calculateAverageRating(player.id);
                    const numRatings = getPlayerRatings(player.id).length;
                    
                    return (
                      <Card key={player.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={player.photoUrl} />
                              <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              {player.name}
                              <div className="text-sm text-muted-foreground font-normal">
                                {player.position} {player.number ? `#${player.number}` : ''}
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          {match.status !== 'upcoming' && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm text-muted-foreground">Community Rating</div>
                                <div className="flex items-center">
                                  <StarRating initialRating={playerAvgRating} readonly size={16} />
                                  <span className="text-sm ml-2">
                                    {playerAvgRating > 0 ? playerAvgRating : 'No ratings'} 
                                    {numRatings > 0 ? ` (${numRatings})` : ''}
                                  </span>
                                </div>
                              </div>
                              
                              {numRatings > 0 && getPlayerRatings(player.id).slice(0, 1).map(rating => (
                                <div key={rating.id} className="bg-muted/40 p-3 rounded-md text-sm flex items-start space-x-2">
                                  <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <div>
                                    <div className="text-muted-foreground mb-1">
                                      Fan said:
                                    </div>
                                    <p>{rating.comment}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium text-sm mb-2">Rate this player</h4>
                            <div className="mb-2">
                              <StarRating
                                initialRating={playerRatings[player.id] || 0}
                                onRatingChange={(rating) => handleRatingChange(player.id, rating)}
                              />
                            </div>
                            <Textarea
                              placeholder="Leave a comment about this player's performance..."
                              className="mb-3 resize-none h-20"
                              value={playerComments[player.id] || ''}
                              onChange={(e) => handleCommentChange(player.id, e.target.value)}
                            />
                            <Button
                              onClick={() => handleSubmitRating(player.id)}
                              disabled={!playerRatings[player.id]}
                              className="w-full"
                            >
                              Submit Rating
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchDetail;
