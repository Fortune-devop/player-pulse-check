
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MatchCard from '@/components/MatchCard';
import PlayerCard from '@/components/PlayerCard';
import { matches, players, teams, getTeamById } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';
import MotionWrapper, { scaleIn } from '@/components/animations/MotionWrapper';
import SignUp from '@/components/auth/SignUp';
import Waitlist from '@/components/auth/Waitlist';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Index = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const isMobile = useIsMobile();
  
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

  // Add a test match at the end to verify horizontal scrolling
  const testMatch = {
    ...matchesToShow[0],
    id: 'test-match',
    homeTeamId: teams[0].id,
    awayTeamId: teams[1].id,
    date: new Date(),
    status: 'upcoming' as const, // Fix: Explicitly typing as a literal type
    homeScore: 0,
    awayScore: 0,
  };
  
  const matchesWithTestMatch = [...matchesToShow, testMatch];

  // Get featured players (using the ones with ratings)
  const featuredPlayers = players.slice(0, 4);

  const openSignUp = () => {
    setShowSignUp(true);
  };

  const openWaitlist = () => {
    setShowWaitlist(true);
  };

  return (
    <>
      {/* Mobile-optimized Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=2000" 
            alt="Sports technology background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container relative z-20 px-4 md:px-6 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <MotionWrapper 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'} font-bold mb-4 leading-tight`}>
                Rate Your Favorite <span className="text-warning">Athletes</span> Like Never Before
              </h1>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-6 md:mb-8 text-white/90 max-w-lg`}>
                Join thousands of passionate sports fans sharing opinions and insights on player performances
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/matches">
                  <button className={`bg-white text-primary hover:bg-gray-100 font-semibold ${isMobile ? 'py-2 px-4 text-sm' : 'py-3 px-6'} rounded-lg flex items-center gap-2 transition-all duration-300`}>
                    Browse Matches
                    <ArrowRight className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </button>
                </Link>
                <button 
                  onClick={openWaitlist} 
                  className={`bg-transparent border border-white hover:bg-white/10 font-semibold ${isMobile ? 'py-2 px-4 text-sm' : 'py-3 px-6'} rounded-lg transition-all duration-300`}
                >
                  Join Waitlist
                </button>
              </div>
            </MotionWrapper>
          </div>
          
          {!isMobile && (
            <div className="md:w-1/2">
              <MotionWrapper variants={scaleIn}>
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-warning/20 absolute -top-6 -left-6 rounded-full blur-2xl"></div>
                  <div className="bg-white p-4 rounded-2xl shadow-xl rotate-3 relative z-10">
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800" 
                        alt="Player ratings dashboard" 
                        className="rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="mt-3 p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 h-3 w-3 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Live Ratings</span>
                      </div>
                      <div className="text-sm font-bold text-primary">RateMyPlayer.com</div>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            </div>
          )}
        </div>
      </section>
      
      {/* Live & Upcoming Matches - Mobile Optimized */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Live & Upcoming Matches</h2>
          
          {isMobile ? (
            // Mobile view - horizontal scroll with snap
            <div className="overflow-x-auto snap-x snap-mandatory flex gap-3 pb-6 -mx-4 px-4">
              {matchesToShow.map(match => {
                const homeTeam = getTeamById(match.homeTeamId);
                const awayTeam = getTeamById(match.awayTeamId);
                
                if (!homeTeam || !awayTeam) return null;
                
                return (
                  <div key={match.id} className="snap-start flex-shrink-0 w-[85%]">
                    <MatchCard
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
                  </div>
                );
              })}
            </div>
          ) : (
            // Desktop view - horizontal carousel
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {matchesWithTestMatch.map((match) => {
                    const homeTeam = getTeamById(match.homeTeamId);
                    const awayTeam = getTeamById(match.awayTeamId);
                    
                    if (!homeTeam || !awayTeam) return null;
                    
                    return (
                      <CarouselItem key={match.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 h-full">
                        <MatchCard
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
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
                </div>
              </Carousel>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Players - Mobile Optimized */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">Featured Players</h2>
          
          {isMobile ? (
            // Mobile view - horizontal scroll with snap
            <div className="overflow-x-auto snap-x snap-mandatory flex gap-3 pb-6 -mx-4 px-4">
              {featuredPlayers.map(player => {
                const team = getTeamById(player.teamId);
                if (!team) return null;
                
                return (
                  <div key={player.id} className="snap-start flex-shrink-0 w-[85%]">
                    <PlayerCard
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
                  </div>
                );
              })}
            </div>
          ) : (
            // Desktop view - grid
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
          )}
        </div>
      </section>
      
      {/* How it Works - Mobile Optimized */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-center">How RateMyPlayer Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold">1</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Join the Waitlist</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Sign up to join our exclusive community of sports fans
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold">2</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Get Approved Access</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Once approved, you'll have full access to rate players
              </p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-bold">3</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Rate & Engage</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Rate players and connect with other passionate fans
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA - Mobile Optimized */}
      <section className="py-8 md:py-12 bg-primary text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            Join Our Exclusive Community
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-6 md:mb-8 max-w-2xl mx-auto`}>
            We're carefully growing our community of dedicated sports fans. Request access today!
          </p>
          <button 
            onClick={openWaitlist} 
            className={`bg-white text-primary hover:bg-gray-100 font-semibold ${isMobile ? 'py-2 px-6' : 'py-3 px-8'} rounded-lg`}
          >
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* SignUp Dialog */}
      <SignUp 
        isOpen={showSignUp} 
        onClose={() => setShowSignUp(false)} 
        onOpenSignIn={() => setShowSignUp(false)} 
      />

      {/* Waitlist Dialog */}
      <Waitlist
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onOpenSignIn={() => {
          setShowWaitlist(false);
          // You might want to open SignIn here if needed
        }}
      />
    </>
  );
};

export default Index;
