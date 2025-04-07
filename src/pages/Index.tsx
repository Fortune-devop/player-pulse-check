
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import PlayerCard from '@/components/PlayerCard';
import { matches, players, teams, getTeamById } from '@/data/mockData';

const Index = () => {
  // Get matches to display
  const matchesToShow = [...matches].sort((a, b) => {
    // Sort by status: live first, then upcoming, then finished
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    if (a.status === 'upcoming' && b.status === 'finished') return -1;
    if (a.status === 'finished' && b.status === 'upcoming') return 1;
    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get featured players (using the ones with ratings)
  const featuredPlayers = players.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-16 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Rate Your Favorite Athletes
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join the community of passionate sports fans and share your opinions on player performances
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg">
                Browse Matches
              </button>
              <button className="bg-transparent border border-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg">
                Sign Up for Free
              </button>
            </div>
          </div>
        </section>
        
        {/* Live & Upcoming Matches */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Live & Upcoming Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchesToShow.map(match => {
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
          </div>
        </section>
        
        {/* Featured Players */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">Featured Players</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredPlayers.map(player => {
                const team = getTeamById(player.teamId);
                if (!team) return null;
                
                return (
                  <PlayerCard
                    key={player.id}
                    id={player.id}
                    name={player.name}
                    position={player.position}
                    teamName={team.name}
                    teamLogo={team.logo}
                    photoUrl={player.photoUrl}
                    rating={4}
                    totalRatings={24}
                    sport={team.sport}
                  />
                );
              })}
            </div>
          </div>
        </section>
        
        {/* How it Works */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8 text-center">How RateMyPlayer Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Browse Matches</h3>
                <p className="text-muted-foreground">
                  Find live and upcoming matches across NFL, NBA, and Soccer leagues
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Rate Players</h3>
                <p className="text-muted-foreground">
                  Give 1-5 star ratings and leave comments on player performances
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Community Insights</h3>
                <p className="text-muted-foreground">
                  See aggregated fan ratings and discover what others think
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-12 bg-primary text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Share Your Opinion?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of sports fans rating and discussing player performances
            </p>
            <button className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg">
              Sign Up Now
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
