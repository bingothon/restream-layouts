import { RunDataTeam } from './RunDataTeam';

export interface RunData {
  when?: number;
  game?: string;
  gameTwitch?: string;
  system?: string;
  region?: string;
  release?: string;
  category?: string;
  estimate?: string;
  estimateS?: number;
  setupTime?: string;
  setupTimeS?: number;
  scheduled?: string;
  scheduledS?: number;
  teams: RunDataTeam[];
  customData: {
    [key: string]: string;
    Bingotype: string;
	  Layout: "16:9" | "15:9" | "4:3" | "10:9" | "3:2" | "4:3 co-op";
  };
  id: string;
  hash?: string;
}
