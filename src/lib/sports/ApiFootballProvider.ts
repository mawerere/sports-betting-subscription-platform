import { SportsDataProvider, SportsTeam, SportsMatch } from './SportsDataService';

/**
 * ApiFootballProvider.ts
 * ----------------------------------------------------------------
 * Live implementation of the SportsDataProvider using API-Football.
 * https://www.api-football.com/
 */
export class ApiFootballProvider implements SportsDataProvider {
  readonly name = 'API_FOOTBALL';

  private apiUrl = process.env.SPORTS_API_URL || 'https://v3.football.api-sports.io';
  private apiKey = process.env.SPORTS_API_KEY || '';

  // We use the current/upcoming season for fixture lookups
  private getCurrentSeason(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    // Football season starts in August. So if it's July or earlier, use previous year.
    return month >= 8 ? year : year - 1;
  }

  private async fetchApi(endpoint: string, params: Record<string, string | number> = {}) {
    const url = new URL(`${this.apiUrl}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-apisports-key': this.apiKey,
      },
      // Cache for 10 minutes to respect rate limits
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error('API-Football returned errors:', data.errors);
    }
    return data.response || [];
  }

  async searchTeams(query: string): Promise<SportsTeam[]> {
    if (!this.apiKey) return [];
    if (query.length < 3) return [];

    try {
      const response = await this.fetchApi('teams', { search: query });
      return response.slice(0, 10).map((t: any) => ({
        id: t.team.id,
        name: t.team.name,
        logo: t.team.logo,
        country: t.team.country,
      }));
    } catch (e) {
      console.error('API-Football searchTeams error:', e);
      return [];
    }
  }

  async searchMatches(query: string): Promise<SportsMatch[]> {
    if (!this.apiKey) return [];

    try {
      // First find the team by name
      const teams = await this.searchTeams(query);
      if (teams.length === 0) return [];

      const teamId = teams[0].id;
      // Get current season fixtures for this team
      const season = this.getCurrentSeason();
      const response = await this.fetchApi('fixtures', { team: teamId, season });

      // Sort by date (newest first) and take the most recent 10
      const sorted = response
        .sort((a: any, b: any) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime())
        .slice(0, 10);

      return sorted.map((m: any) => ({
        id: m.fixture.id,
        league: m.league.name,
        homeTeam: {
          id: m.teams.home.id,
          name: m.teams.home.name,
          logo: m.teams.home.logo,
        },
        awayTeam: {
          id: m.teams.away.id,
          name: m.teams.away.name,
          logo: m.teams.away.logo,
        },
        matchDate: m.fixture.date,
        status: m.fixture.status.short,
        score: `${m.goals.home ?? 0} - ${m.goals.away ?? 0}`,
        minute: m.fixture.status.elapsed ? `${m.fixture.status.elapsed}'` : '0\'',
      }));
    } catch (e) {
      console.error('API-Football searchMatches error:', e);
      return [];
    }
  }
}
