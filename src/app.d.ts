// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface ValorantMap {
			uuid: string;
			displayName: string;
			displayIcon: string;
			splash: string;
		}

		interface ValorantAgent {
			uuid: string;
			displayName: string;
			displayIcon: string;
			fullPortrait: string;
			rawRole?: {
				displayName: string;
				displayIcon: string;
			};
			role?: string;
			roleIcon?: string;
		}

		//This will most likely need an update to handle more unique color options
		interface ColorPreset {
			primaryColor: string;
			secondaryColor: string;
			tertiaryColor: string;
			quadiaryColor: string;
		}

		interface APIResponse {
			status: number;
			data: Array<Object>;
		}

		interface ValorantMatch {
			metadata: Object;
			players: MatchPlayer;
			observers?: Object;
			coaches?: Object;
			teams: MatchTeam;
			rounds: Array<MatchRound>;
			kills: Array<MatchKill>;
		}

		interface MatchPlayer {
			puuid: string;
			name: string;
			tag: string;
			team: string;
			level: string;
			character: string;
			currenttier: number;
			currenttier_patched: string;
			player_card: string;
			player_title: string;
			assets: {
				agent: {
					small: string;
					full: string;
					bust: string;
					killfeed: string;
				}
			};
			ability_casts: {
				c_cast: number;
				q_cast: number;
				e_cast: number;
				x_cast: number;
			};
			stats: {
				score: number,
				kills: number,
				deaths: number,
				assists: number,
				bodyshots: number,
				headshots: number,
				legshots: number
			};
			economy: {
				spent: {
					overall: number;
					average: number;
				};
				loadout_value: {
					overall: number;
					average: number;
				};
			};
			damage_made: number;
			damage_received: number;
		}

		interface MatchTeam {

		}

		interface MatchRound {

		}

		interface MatchKill {
			
		}




		


		
	}
}

export {};
