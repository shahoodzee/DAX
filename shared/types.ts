export interface Skin {
  id: string;
  name: string;
  weaponType: string;
  skinType: string; // e.g., "Kuronami", "Gaia", "Magepunk"
  price: number;
  currency: string; // e.g., "VP", "Keys", "$"
  imageUrl?: string;
  rarity?: string; // e.g., "Legendary", "Epic", "Rare"
}

export interface GameAccount {
  id: string;
  accountName: string;
  accountType: 'Valorant' | 'CSGO' | 'Steam' | 'League of Legends' | 'Overwatch';
  moneySpent: number; // USD
  gameMoneySpent: number;
  gameCurrency: string; // e.g., "VP", "Keys", "RP"
  numberOfSkins: number;
  accountLink: string;
  skins: Skin[];
  rank?: string;
  level?: number;
  sellerId: string;
  sellerName: string;
  price: number; // Selling price in USD
  featured: boolean;
  images: string[];
  description?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  createdAt: Date;
  lastUpdated: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  rating: number;
  totalSales: number;
  joinedAt: Date;
}

export interface GameStats {
  totalAccounts: number;
  totalValue: number;
  averagePrice: number;
  popularGames: string[];
}
