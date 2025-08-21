import { GameAccount } from "@shared/types";
import { FilterState } from "../components/AdvancedFilter";

export const applyAdvancedFilters = (
  accounts: GameAccount[], 
  filters: FilterState,
  searchTerm: string = ""
): GameAccount[] => {
  return accounts.filter(account => {
    // Search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        account.accountName.toLowerCase().includes(searchLower) ||
        account.accountType.toLowerCase().includes(searchLower) ||
        account.sellerName.toLowerCase().includes(searchLower) ||
        account.skins.some(skin => 
          skin.name.toLowerCase().includes(searchLower) ||
          skin.skinType.toLowerCase().includes(searchLower) ||
          skin.weaponType.toLowerCase().includes(searchLower)
        );
      
      if (!matchesSearch) return false;
    }

    // Game type filter
    if (filters.gameType !== "all" && account.accountType !== filters.gameType) {
      return false;
    }

    // Weapon types filter - account must have skins for ALL selected weapon types
    if (filters.weaponTypes.length > 0) {
      const accountWeaponTypes = new Set(account.skins.map(skin => skin.weaponType));
      const hasAllRequiredWeapons = filters.weaponTypes.every(weaponType =>
        accountWeaponTypes.has(weaponType)
      );
      
      if (!hasAllRequiredWeapons) return false;
    }

    // Skin types filter - account must have skins from ALL selected skin collections
    if (filters.skinTypes.length > 0) {
      const accountSkinTypes = new Set(account.skins.map(skin => skin.skinType));
      const hasAllRequiredSkinTypes = filters.skinTypes.every(skinType =>
        accountSkinTypes.has(skinType)
      );
      
      if (!hasAllRequiredSkinTypes) return false;
    }

    // Specific combinations filter - account must have ALL specified skin+weapon combinations
    if (filters.specificCombinations.length > 0) {
      const hasAllSpecificCombinations = filters.specificCombinations.every(combo => {
        return account.skins.some(skin => 
          skin.skinType.toLowerCase().includes(combo.skinType.toLowerCase()) &&
          skin.weaponType.toLowerCase().includes(combo.weaponType.toLowerCase())
        );
      });
      
      if (!hasAllSpecificCombinations) return false;
    }

    return true;
  });
};

export const getFilterSummary = (filters: FilterState): string[] => {
  const summary: string[] = [];
  
  if (filters.gameType !== "all") {
    summary.push(`Game: ${filters.gameType}`);
  }
  
  if (filters.weaponTypes.length > 0) {
    summary.push(`Weapons: ${filters.weaponTypes.join(", ")}`);
  }
  
  if (filters.skinTypes.length > 0) {
    summary.push(`Collections: ${filters.skinTypes.join(", ")}`);
  }
  
  if (filters.specificCombinations.length > 0) {
    const combos = filters.specificCombinations.map(
      combo => `${combo.skinType} ${combo.weaponType}`
    );
    summary.push(`Specific: ${combos.join(", ")}`);
  }
  
  return summary;
};

export const hasActiveFilters = (filters: FilterState): boolean => {
  return (
    filters.gameType !== "all" ||
    filters.weaponTypes.length > 0 ||
    filters.skinTypes.length > 0 ||
    filters.specificCombinations.length > 0
  );
};
