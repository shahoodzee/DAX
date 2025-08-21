export const VALORANT_WEAPONS = {
  Vandal: "Vandal",
  Phantom: "Phantom",
  Ghost: "Ghost",
  Classic: "Classic",
  Judge: "Judge",
  Spectre: "Spectre",
  Sheriff: "Sheriff",
  Operator: "Operator",
  Guardian: "Guardian",
  Bulldog: "Bulldog",
  Stinger: "Stinger",
  Ares: "Ares",
  Odin: "Odin",
  Bucky: "Bucky",
  Shorty: "Shorty",
  Frenzy: "Frenzy",
  Marshal: "Marshal",
} as const;

export type ValorantWeapon = (typeof VALORANT_WEAPONS)[keyof typeof VALORANT_WEAPONS];


