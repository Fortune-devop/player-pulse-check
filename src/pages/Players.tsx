
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlayerCard from '@/components/PlayerCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { players, teams, getTeamById, calculateAverageRating } from '@/data/mockData';

const Players = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const filteredPlayers = players.filter(player => {
    const team = getTeamById(player.teamId);
    if (!team) return false;
    
    if (selectedSport !== 'all' && team.sport !== selectedSport) {
      return false;
    }
    
    if (searchTerm && !player.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group players by sport
  const playersByTeam = filteredPlayers.reduce((acc, player) => {
    const team = getTeamById(player.teamId);
    if (!team) return acc;
    
    if (!acc[team.id]) {
      acc[team.id] = {
        team,
        players: []
      };
    }
    
    acc[team.id].players.push(player);
    return acc;
  }, {} as Record<string, { team: typeof teams[0], players: typeof players }> );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-primary py-8 text-white">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-2">Browse Players</h1>
            <p className="text-lg opacity-90">
              Discover and rate your favorite athletes
            </p>
          </div>
        </section>
        
        {/* Search & Filters */}
        <section className="py-6 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end">
              <div className="flex-1 md:mr-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search players..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:w-auto">
                <Tabs value={selectedSport} onValueChange={setSelectedSport}>
                  <TabsList>
                    <TabsTrigger value="all">All Sports</TabsTrigger>
                    <TabsTrigger value="nfl">NFL</TabsTrigger>
                    <TabsTrigger value="nba">NBA</TabsTrigger>
                    <TabsTrigger value="soccer">Soccer</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
        
        {/* Players List */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            {Object.values(playersByTeam).length > 0 ? (
              <div className="space-y-12">
                {Object.values(playersByTeam).map(({ team, players }) => (
                  <div key={team.id}>
                    <div className="flex items-center mb-6">
                      <img src={team.logo} alt={team.name} className="w-8 h-8 mr-3" />
                      <h2 className="text-2xl font-bold">{team.name}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {players.map(player => (
                        <PlayerCard
                          key={player.id}
                          id={player.id}
                          name={player.name}
                          position={player.position}
                          teamName={team.name}
                          teamLogo={team.logo}
                          photoUrl={player.photoUrl}
                          rating={calculateAverageRating(player.id)}
                          totalRatings={5} // Mock value
                          sport={team.sport}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">No players found</p>
                <p className="text-muted-foreground">
                  Try changing your search or filters
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Players;
