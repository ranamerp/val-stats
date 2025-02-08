import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

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
			role?: string | {
				displayName: string;
				displayIcon: string;
			};
			roleIcon?: string;
		}

		interface ColorPreset {
			preset_id: number;
			leftbgcolor: string;
			leftbigtextcolor: string;
			leftsmalltextcolor: string;
			
			rightbgcolor: string;
			rightbigtextcolor: string;
			rightsmalltextcolor:  string;
	
			mvpbannerbgcolor: string;
			mvpbannertextcolor:  string;
			mvpagentcolor:  string;
			mvptextcolor: string;
			globaltextcolor: string;
			font: string;
		}

		interface APIResponse {
			status: number;
			data: ValorantMatch[] | LocalMatch[];
			errors?: {
				message: string;
				details: string;
			}
		}

		interface ValorantMatch {
			metadata: {
				match_id:          string;
				map:               {
					id: string;
					name: string;
				};
				queue: {
					id: string;
					name: string;
					mode_type: string;
				}
				game_version:      string;
				game_length_in_ms: number;
				started_at:        Date;
				is_completed:      boolean;
				queue:             {
					id: string;
					name: string;
					mode_type: string;
				};
				season:            {
					id: string;
					short: string;
				};
				platform:          string;
				party_rr_penaltys: {
					party_id: string;
				}[];
				region:            string;
				cluster:           string;
			};
			players: MatchPlayer[];
			observers?: {
				puuid:    string;
				name:     string;
				tag:      string;
				card_id:  string;
				title_id: string;
				party_id: string;
			}[];
			coaches?: {
				puuid: string;
				team_id: string;
			}[];
			teams: MatchTeam[];
			rounds: MatchRound[];
			kills: MatchKill[];
		}

		interface MatchPlayer {
			puuid: string;
			name: string;
			tag: string;
			team_id: string;
			platform: string;
			party_id: string;
			agent: {
				id: string;
				name: string;
			};
			stats: {
				score: number;
				kills: number;
				deaths: number;
				assists: number;
				headshots: number;
				bodyshots: number;
				legshots: number;
				damage: {
					dealt: number;
					recieved: numbber;
				}
			};
			ability_casts: {
				grenade: number;
				ability1: number;
				ability2: number;
				ultimate: number;
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
			team_id: string;
			rounds: {
				won: number;
				lost: number;
			};
			won: boolean;
		};

		interface MatchRound {
			id: number;
			result: string;
			ceremony: string;
			winning_team: string;
			//Doing bare minimum for this, it is not needed
			stats: {
				player: PlayerBasic;
			}

		}

		interface MatchKill {
			time_in_round_in_ms: number;
			time_in_match_in_ms: number;
			round: number;
			killer: PlayerBasic;
			victim: PlayerBasic;
			assistants: PlayerBasic[];
		}

		interface PlayerBasic {
			puuid: string;
			name: string;
			tag: string;
			team: string;
		}

		interface LocalMatch {
			index: number;
			match_id: string;
			mapName: string;
			startTime: Date;
			red_team: LocalTeam;
			blue_team: LocalTeam;

		}

		interface LocalTeam{
			team_id: string;
			team_name: string;
			won_bool: boolean;
			won: string;
			rounds_won: number;
			players: LocalPlayer[]
		}

		interface LocalPlayer {
			puuid: string;
			name: string;
			team: string;
			agent: string;
			kd: number;
			kills: number;
			deaths: number;
			acs: number;
			firstkills: number;
		}

		interface Locals {
			supabase: SupabaseClient
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
			session: Session | null
			user: User | null
		  }

		  interface PageData {
			session: Session | null
		  }




		


		
	}
}

export {};
