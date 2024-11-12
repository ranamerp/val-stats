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
		


		
	}
}

export {};
