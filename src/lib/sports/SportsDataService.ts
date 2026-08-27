/**
 * SportsDataService.ts
 * ----------------------------------------------------------------
 * Abstract interface for a sports data API provider.
 * Allows us to plug in API-Football, football-data.org, Sportmonks, etc.
 */

export interface SportsTeam {
  id: number | string;
  name: string;
  logo?: string;
}

export interface SportsMatch {
  id: number | string;
  league: string;
  homeTeam: SportsTeam;
  awayTeam: SportsTeam;
  matchDate: string;
  status: string;
  score?: string;
  minute?: string;
}

export interface SportsDataProvider {
  readonly name: string;
  searchTeams(query: string): Promise<SportsTeam[]>;
  searchMatches(query: string): Promise<SportsMatch[]>;
}
