
// Mock data for our application

// Types
export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: 'nfl' | 'nba' | 'soccer';
}

export interface Player {
  id: string;
  name: string;
  position: string;
  teamId: string;
  photoUrl?: string;
  number?: string;
  bio?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  venue: string;
  sport: 'nfl' | 'nba' | 'soccer';
}

export interface PlayerRating {
  id: string;
  playerId: string;
  matchId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Mock data
export const teams: Team[] = [
  {
    id: '1',
    name: 'Kansas City Chiefs',
    logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
    sport: 'nfl',
  },
  {
    id: '2',
    name: 'San Francisco 49ers',
    logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
    sport: 'nfl',
  },
  {
    id: '3',
    name: 'Los Angeles Lakers',
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
    sport: 'nba',
  },
  {
    id: '4',
    name: 'Boston Celtics',
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
    sport: 'nba',
  },
  {
    id: '5',
    name: 'Manchester United',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/985.png',
    sport: 'soccer',
  },
  {
    id: '6',
    name: 'Liverpool FC',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
    sport: 'soccer',
  },
];

export const players: Player[] = [
  {
    id: '1',
    name: 'Patrick Mahomes',
    position: 'Quarterback',
    teamId: '1',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3139477.png',
    number: '15',
    bio: 'Patrick Lavon Mahomes II is an American football quarterback for the Kansas City Chiefs of the NFL. He has won two Super Bowls and been named Super Bowl MVP twice.',
  },
  {
    id: '2',
    name: 'Travis Kelce',
    position: 'Tight End',
    teamId: '1',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/15847.png',
    number: '87',
    bio: 'Travis Michael Kelce is an American football tight end for the Kansas City Chiefs of the NFL. A eight-time Pro Bowler and four-time first-team All-Pro selection.',
  },
  {
    id: '3',
    name: 'Brock Purdy',
    position: 'Quarterback',
    teamId: '2',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4361519.png',
    number: '13',
    bio: 'Brock Purdy is an American football quarterback for the San Francisco 49ers of the NFL. He was selected with the final pick in the 2022 NFL Draft, earning the "Mr. Irrelevant" title.',
  },
  {
    id: '4',
    name: 'Christian McCaffrey',
    position: 'Running Back',
    teamId: '2',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3117251.png',
    number: '23',
    bio: 'Christian Jackson McCaffrey is an American football running back for the San Francisco 49ers of the NFL. He played college football at Stanford.',
  },
  {
    id: '5',
    name: 'LeBron James',
    position: 'Small Forward',
    teamId: '3',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png',
    number: '23',
    bio: 'LeBron Raymone James Sr. is an American professional basketball player for the Los Angeles Lakers of the NBA. Nicknamed "King James", he is considered one of the greatest players in NBA history.',
  },
  {
    id: '6',
    name: 'Anthony Davis',
    position: 'Power Forward',
    teamId: '3',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/6583.png',
    number: '3',
    bio: 'Anthony Marshon Davis Jr. is an American professional basketball player for the Los Angeles Lakers of the NBA. He is an eight-time NBA All-Star and has been named to four All-NBA First Teams.',
  },
  {
    id: '7',
    name: 'Jayson Tatum',
    position: 'Small Forward',
    teamId: '4',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4065648.png',
    number: '0',
    bio: 'Jayson Christopher Tatum is an American professional basketball player for the Boston Celtics of the NBA. A five-time NBA All-Star, he was named to the NBA All-Rookie First Team in 2018.',
  },
  {
    id: '8',
    name: 'Jaylen Brown',
    position: 'Shooting Guard',
    teamId: '4',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3917376.png',
    number: '7',
    bio: 'Jaylen Marselles Brown is an American professional basketball player for the Boston Celtics of the NBA. He played college basketball for the California Golden Bears.',
  },
  {
    id: '9',
    name: 'Marcus Rashford',
    position: 'Forward',
    teamId: '5',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/226585.png',
    number: '10',
    bio: 'Marcus Rashford MBE is an English professional footballer who plays as a forward for Premier League club Manchester United and the England national team.',
  },
  {
    id: '10',
    name: 'Bruno Fernandes',
    position: 'Midfielder',
    teamId: '5',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/177838.png',
    number: '8',
    bio: 'Bruno Miguel Borges Fernandes is a Portuguese professional footballer who plays as an attacking midfielder for Premier League club Manchester United and the Portugal national team.',
  },
  {
    id: '11',
    name: 'Mohamed Salah',
    position: 'Forward',
    teamId: '6',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/148695.png',
    number: '11',
    bio: 'Mohamed Salah Hamed Mahrous Ghaly is an Egyptian professional footballer who plays as a forward for Premier League club Liverpool and captains the Egypt national team.',
  },
  {
    id: '12',
    name: 'Virgil van Dijk',
    position: 'Defender',
    teamId: '6',
    photoUrl: 'https://a.espncdn.com/combiner/i?img=/i/headshots/soccer/players/full/146202.png',
    number: '4',
    bio: 'Virgil van Dijk is a Dutch professional footballer who plays as a centre-back for Premier League club Liverpool and captains the Netherlands national team.',
  },
];

export const matches: Match[] = [
  {
    id: '1',
    homeTeamId: '1',
    awayTeamId: '2',
    date: new Date(2025, 3, 8, 18, 0), // April 8, 2025, 6:00 PM
    status: 'upcoming',
    venue: 'Arrowhead Stadium, Kansas City',
    sport: 'nfl',
  },
  {
    id: '2',
    homeTeamId: '3',
    awayTeamId: '4',
    date: new Date(2025, 3, 7, 20, 30), // April 7, 2025, 8:30 PM
    status: 'live',
    homeScore: 89,
    awayScore: 84,
    venue: 'Crypto.com Arena, Los Angeles',
    sport: 'nba',
  },
  {
    id: '3',
    homeTeamId: '5',
    awayTeamId: '6',
    date: new Date(2025, 3, 6, 15, 0), // April 6, 2025, 3:00 PM
    status: 'finished',
    homeScore: 2,
    awayScore: 3,
    venue: 'Old Trafford, Manchester',
    sport: 'soccer',
  },
];

export const playerRatings: PlayerRating[] = [
  {
    id: '1',
    playerId: '5',
    matchId: '2',
    userId: 'user1',
    rating: 4.5,
    comment: 'LeBron was a dominant force in the game tonight!',
    createdAt: new Date(2025, 3, 7, 21, 15),
  },
  {
    id: '2',
    playerId: '6',
    matchId: '2',
    userId: 'user2',
    rating: 3.5,
    comment: 'Davis played well defensively but struggled on offense.',
    createdAt: new Date(2025, 3, 7, 21, 20),
  },
  {
    id: '3',
    playerId: '7',
    matchId: '2',
    userId: 'user1',
    rating: 4,
    comment: 'Great shooting performance by Tatum.',
    createdAt: new Date(2025, 3, 7, 21, 25),
  },
  {
    id: '4',
    playerId: '9',
    matchId: '3',
    userId: 'user3',
    rating: 2.5,
    comment: 'Rashford missed too many chances today.',
    createdAt: new Date(2025, 3, 6, 16, 45),
  },
  {
    id: '5',
    playerId: '11',
    matchId: '3',
    userId: 'user4',
    rating: 5,
    comment: 'Salah was phenomenal with his hat-trick!',
    createdAt: new Date(2025, 3, 6, 16, 50),
  },
];

// Helper functions
export const getTeamById = (id: string) => {
  return teams.find(team => team.id === id);
};

export const getPlayerById = (id: string) => {
  return players.find(player => player.id === id);
};

export const getPlayersByTeamId = (teamId: string) => {
  return players.filter(player => player.teamId === teamId);
};

export const getMatchById = (id: string) => {
  return matches.find(match => match.id === id);
};

export const getPlayerRatingsByPlayerId = (playerId: string) => {
  return playerRatings.filter(rating => rating.playerId === playerId);
};

export const getPlayerRatingsByMatchId = (matchId: string) => {
  return playerRatings.filter(rating => rating.matchId === matchId);
};

export const calculateAverageRating = (playerId: string) => {
  const ratings = getPlayerRatingsByPlayerId(playerId);
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
  return sum / ratings.length;
};
