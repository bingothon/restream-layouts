import { RunDataTeam } from './RunDataTeam';

export interface RunData {
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
	  Layout: "16_9" | "15_9" | "4_3" | "10_9" | "3_2";
  };
  id: string;
  hash?: string;
}
