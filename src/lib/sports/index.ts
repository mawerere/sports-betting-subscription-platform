import { SportsDataProvider, SportsTeam, SportsMatch } from './SportsDataService';
import { ApiFootballProvider } from './ApiFootballProvider';

export class SportsDataService {
  private provider: SportsDataProvider = new ApiFootballProvider();

  async searchTeams(query: string): Promise<SportsTeam[]> {
    return this.provider.searchTeams(query);
  }

  async searchMatches(query: string): Promise<SportsMatch[]> {
    return this.provider.searchMatches(query);
  }
}

export const sportsDataService = new SportsDataService();
