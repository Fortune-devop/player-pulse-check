
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { matches, getTeamById } from '@/data/mockData';

const Matches = () => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredMatches = matches.filter(match => {
    if (selectedSport !== 'all' && match.sport !== selectedSport) {
      return false;
    }
    if (selectedStatus !== 'all' && match.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // Sort matches: live first, then upcoming, then finished
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    if (a.status === 'upcoming' && b.status === 'finished') return -1;
    if (a.status === 'finished' && b.status === 'upcoming') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-primary py-8 text-white">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-2">Browse Matches</h1>
            <p className="text-lg opacity-90">
              Find and rate players from recent and upcoming matches
            </p>
          </div>
        </section>
        
        {/* Filters */}
        <section className="py-6 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sport</h3>
                <Tabs value={selectedSport} onValueChange={setSelectedSport}>
                  <TabsList>
                    <TabsTrigger value="all">All Sports</TabsTrigger>
                    <TabsTrigger value="nfl">NFL</TabsTrigger>
                    <TabsTrigger value="nba">NBA</TabsTrigger>
                    <TabsTrigger value="soccer">Soccer</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="live">Live</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="finished">Finished</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
        
        {/* Matches List */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            {sortedMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMatches.map(match => {
                  const homeTeam = getTeamById(match.homeTeamId);
                  const awayTeam = getTeamById(match.awayTeamId);
                  
                  if (!homeTeam || !awayTeam) return null;
                  
                  return (
                    <MatchCard
                      key={match.id}
                      id={match.id}
                      homeTeam={{
                        name: homeTeam.name,
                        logo: homeTeam.logo,
                        score: match.homeScore
                      }}
                      awayTeam={{
                        name: awayTeam.name,
                        logo: awayTeam.logo,
                        score: match.awayScore
                      }}
                      date={match.date}
                      status={match.status}
                      sport={match.sport}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl font-medium mb-2">No matches found</p>
                <p className="text-muted-foreground">
                  Try changing your filters to see more results
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

export default Matches;
