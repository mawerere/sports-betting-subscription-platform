import { NextResponse } from 'next/server';
import { sportsDataService } from '@/lib/sports';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'Arsenal';
  const type = searchParams.get('type') || 'teams';

  // If a real SPORTS_API_KEY is configured, hit the actual sports data API.
  if (process.env.SPORTS_API_KEY) {
    try {
      if (type === 'matches') {
        const data = await sportsDataService.searchMatches(query);
        return NextResponse.json({ source: 'API_FOOTBALL', data });
      }
      const data = await sportsDataService.searchTeams(query);
      return NextResponse.json({ source: 'API_FOOTBALL', data });
    } catch (err: any) {
      return NextResponse.json(
        { source: 'API_FOOTBALL', error: err.message, data: [] },
        { status: 200 }
      );
    }
  }

  // Fallback to a free mock sports API simulating live football data.
  const teams = ['Arsenal', 'Chelsea', 'Man City', 'Man Utd', 'Liverpool', 'Spurs', 'Newcastle', 'Aston Villa'];
  
  const matches = [];
  
  // Generate 5 random matches for today/tomorrow
  for (let i = 0; i < 5; i++) {
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam = teams[Math.floor(Math.random() * teams.length)];
    while (awayTeam === homeTeam) {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    }

    const matchDate = new Date();
    matchDate.setHours(matchDate.getHours() + Math.floor(Math.random() * 48));

    const chances = (1.5 + Math.random() * 2).toFixed(2);
    const predictionTypes = ['Home Win', 'Away Win', 'Draw', 'Over 2.5 Goals', 'Under 2.5 Goals'];
    const predictionText = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];

    matches.push({
      league: 'Premier League',
      homeTeam,
      awayTeam,
      matchDate: matchDate.toISOString(),
      predictionText,
      chances,
      status: 'PENDING'
    });
  }

  // Generate 3 past matches to resolve
  for (let i = 0; i < 3; i++) {
    const homeTeam = teams[Math.floor(Math.random() * teams.length)];
    let awayTeam = teams[Math.floor(Math.random() * teams.length)];
    while (awayTeam === homeTeam) {
      awayTeam = teams[Math.floor(Math.random() * teams.length)];
    }

    const matchDate = new Date();
    matchDate.setHours(matchDate.getHours() - (12 + Math.floor(Math.random() * 48)));

    const chances = (1.5 + Math.random() * 2).toFixed(2);
    const predictionTypes = ['Home Win', 'Away Win', 'Draw', 'Over 2.5 Goals', 'Under 2.5 Goals'];
    const predictionText = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];

    matches.push({
      league: 'Premier League',
      homeTeam,
      awayTeam,
      matchDate: matchDate.toISOString(),
      predictionText,
      chances,
      status: Math.random() > 0.5 ? 'WON' : 'LOST'
    });
  }

  return NextResponse.json({
    success: true,
    source: 'Free Live Preview Sports API Mock',
    data: matches
  });
}
