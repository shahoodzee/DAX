import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, X, Search } from "lucide-react";
import { GameAccount } from "@shared/types";

// Weapon lists for different games
const VALORANT_WEAPONS = [
  "Vandal", "Phantom", "Ghost", "Classic", "Judge", "Spectre", 
  "Sheriff", "Operator", "Guardian", "Bulldog", "Stinger", 
  "Ares", "Odin", "Bucky", "Shorty", "Frenzy", "Marshal"
];

const CSGO_WEAPONS = [
  "AK-47", "AWP", "M4A4", "M4A1-S", "Desert Eagle", "Glock-18",
  "USP-S", "P250", "FAMAS", "Galil AR", "AUG", "SG 553",
  "MP9", "MP7", "UMP-45", "P90", "PP-Bizon", "MAC-10",
  "Nova", "XM1014", "MAG-7", "Sawed-Off", "SSG 08", "Karambit"
];

export interface FilterState {
  gameType: string;
  weaponTypes: string[];
  skinTypes: string[];
  specificCombinations: Array<{
    skinType: string;
    weaponType: string;
  }>;
  searchTerm: string;
}

interface AdvancedFilterProps {
  accounts: GameAccount[];
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export default function AdvancedFilter({ accounts, onFiltersChange, currentFilters }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [newCombination, setNewCombination] = useState({ skinType: "", weaponType: "" });

  // Get available weapons based on selected game type
  const getAvailableWeapons = () => {
    switch (localFilters.gameType) {
      case "Valorant":
        return VALORANT_WEAPONS;
      case "CSGO":
        return CSGO_WEAPONS;
      default:
        return [...VALORANT_WEAPONS, ...CSGO_WEAPONS];
    }
  };

  // Get available skin types from accounts
  const getAvailableSkinTypes = () => {
    const skinTypes = new Set<string>();
    accounts.forEach(account => {
      if (localFilters.gameType === "all" || account.accountType === localFilters.gameType) {
        account.skins.forEach(skin => {
          skinTypes.add(skin.skinType);
        });
      }
    });
    return Array.from(skinTypes).sort();
  };

  const handleGameTypeChange = (gameType: string) => {
    setLocalFilters(prev => ({
      ...prev,
      gameType,
      weaponTypes: [], // Reset weapon types when game changes
    }));
  };

  const handleWeaponTypeChange = (weaponType: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      weaponTypes: checked 
        ? [...prev.weaponTypes, weaponType]
        : prev.weaponTypes.filter(w => w !== weaponType)
    }));
  };

  const handleSkinTypeChange = (skinType: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      skinTypes: checked 
        ? [...prev.skinTypes, skinType]
        : prev.skinTypes.filter(s => s !== skinType)
    }));
  };

  const addSpecificCombination = () => {
    if (newCombination.skinType && newCombination.weaponType) {
      setLocalFilters(prev => ({
        ...prev,
        specificCombinations: [...prev.specificCombinations, newCombination]
      }));
      setNewCombination({ skinType: "", weaponType: "" });
    }
  };

  const removeSpecificCombination = (index: number) => {
    setLocalFilters(prev => ({
      ...prev,
      specificCombinations: prev.specificCombinations.filter((_, i) => i !== index)
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      gameType: "all",
      weaponTypes: [],
      skinTypes: [],
      specificCombinations: [],
      searchTerm: localFilters.searchTerm,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.gameType !== "all") count++;
    if (localFilters.weaponTypes.length > 0) count++;
    if (localFilters.skinTypes.length > 0) count++;
    if (localFilters.specificCombinations.length > 0) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white relative">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-2 bg-valorant-red text-white text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] bg-gray-900 border-gray-700 text-white flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-valorant-gold">Advanced Filters</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Game Type Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-valorant-cyan">Game Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {["all", "Valorant", "CSGO", "Steam"].map(gameType => (
                    <Badge
                      key={gameType}
                      variant={localFilters.gameType === gameType ? "default" : "outline"}
                      className={`cursor-pointer ${
                        localFilters.gameType === gameType 
                          ? "bg-valorant-red text-white" 
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => handleGameTypeChange(gameType)}
                    >
                      {gameType === "all" ? "All Games" : gameType}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weapon Types */}
            {localFilters.gameType !== "all" && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-valorant-cyan">
                    Required Weapon Types
                    <span className="text-xs text-gray-400 ml-2">
                      (Account must have skins for these weapons)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {getAvailableWeapons().map(weapon => (
                      <div key={weapon} className="flex items-center space-x-2">
                        <Checkbox
                          id={`weapon-${weapon}`}
                          checked={localFilters.weaponTypes.includes(weapon)}
                          onCheckedChange={(checked) => 
                            handleWeaponTypeChange(weapon, checked as boolean)
                          }
                          className="border-gray-600"
                        />
                        <Label 
                          htmlFor={`weapon-${weapon}`}
                          className="text-sm text-gray-300 cursor-pointer"
                        >
                          {weapon}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skin Types */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-valorant-cyan">
                  Required Skin Collections
                  <span className="text-xs text-gray-400 ml-2">
                    (Account must have skins from these collections)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getAvailableSkinTypes().map(skinType => (
                    <div key={skinType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skin-${skinType}`}
                        checked={localFilters.skinTypes.includes(skinType)}
                        onCheckedChange={(checked) => 
                          handleSkinTypeChange(skinType, checked as boolean)
                        }
                        className="border-gray-600"
                      />
                      <Label 
                        htmlFor={`skin-${skinType}`}
                        className="text-sm text-gray-300 cursor-pointer"
                      >
                        {skinType}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specific Combinations */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-valorant-cyan">
                  Specific Skin Requirements
                  <span className="text-xs text-gray-400 ml-2">
                    (e.g., "Kuronami Vandal" - specific skin + weapon combo)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new combination */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Skin type (e.g., Kuronami)"
                    value={newCombination.skinType}
                    onChange={(e) => setNewCombination(prev => ({ 
                      ...prev, 
                      skinType: e.target.value 
                    }))}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Input
                    placeholder="Weapon (e.g., Vandal)"
                    value={newCombination.weaponType}
                    onChange={(e) => setNewCombination(prev => ({ 
                      ...prev, 
                      weaponType: e.target.value 
                    }))}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button 
                    onClick={addSpecificCombination}
                    size="sm"
                    className="bg-valorant-cyan text-black hover:bg-valorant-cyan/80"
                  >
                    Add
                  </Button>
                </div>

                {/* Show current combinations */}
                {localFilters.specificCombinations.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">Required combinations:</Label>
                    <div className="flex flex-wrap gap-2">
                      {localFilters.specificCombinations.map((combo, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-valorant-gold text-valorant-gold flex items-center gap-1"
                        >
                          {combo.skinType} {combo.weaponType}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-400"
                            onClick={() => removeSpecificCombination(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <Separator className="bg-gray-700 flex-shrink-0" />
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-4 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={applyFilters}
              className="bg-valorant-red hover:bg-valorant-red/80 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
