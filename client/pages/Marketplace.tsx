import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AccountCard from "@/components/AccountCard";
import AdvancedFilter, { FilterState } from "@/components/AdvancedFilter";
import { applyAdvancedFilters, getFilterSummary, hasActiveFilters } from "@/utils/filterUtils";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGameAccounts } from "@/lib/api";
import type { ApiGameAccount } from "@/lib/api";
import type { GameAccount } from "@shared/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2, X } from "lucide-react";

function toGameAccount(a: ApiGameAccount): GameAccount {
  return {
    id: String(a.id),
    accountName: a.accountName,
    accountType: a.accountType as GameAccount["accountType"],
    moneySpent: a.moneySpent,
    gameMoneySpent: a.gameMoneySpent,
    gameCurrency: a.gameCurrency,
    numberOfSkins: a.numberOfSkins,
    accountLink: a.accountLink,
    skins: a.skins.map((s) => ({
      id: String(s.id),
      name: s.name,
      weaponType: s.weaponType,
      skinType: s.skinType,
      price: s.price,
      currency: s.currency,
      imageUrl: s.imageUrl,
      rarity: s.rarity,
    })),
    rank: a.rank,
    level: a.level,
    sellerId: String(a.sellerId),
    sellerName: a.sellerName,
    price: a.price,
    featured: a.featured,
    images: a.images,
    description: a.description,
    verificationStatus: a.verificationStatus as GameAccount["verificationStatus"],
    transactionStatus: a.transactionStatus as GameAccount["transactionStatus"],
    buyerId: a.buyerId ? String(a.buyerId) : undefined,
    buyerName: a.buyerName,
    createdAt: new Date(a.createdDate),
    lastUpdated: new Date(a.lastUpdated),
  };
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    gameType: "all",
    weaponTypes: [],
    skinTypes: [],
    specificCombinations: [],
    searchTerm: "",
  });

  const effectiveGameType = advancedFilters.gameType !== "all" ? advancedFilters.gameType : selectedGameType;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gameAccounts", searchQuery, effectiveGameType],
    queryFn: () =>
      fetchGameAccounts({
        searchTerm: searchQuery || undefined,
        accountType: effectiveGameType || undefined,
        transactionStatus: "Available",
      }),
  });

  const allAccounts = useMemo(
    () => (data?.data?.items ?? []).map(toGameAccount),
    [data],
  );
  const totalCount = data?.data?.totalCount ?? 0;

  const accounts = useMemo(
    () => hasActiveFilters(advancedFilters)
      ? applyAdvancedFilters(allAccounts, advancedFilters)
      : allAccounts,
    [allAccounts, advancedFilters],
  );

  const stats = useMemo(() => {
    const totalListings = totalCount;
    const totalValue = accounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = accounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, [accounts, totalCount]);

  const handleAdvancedFiltersChange = (filters: FilterState) => {
    setAdvancedFilters(filters);
    if (filters.gameType !== "all") {
      setSelectedGameType(filters.gameType);
    }
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      gameType: "all",
      weaponTypes: [],
      skinTypes: [],
      specificCombinations: [],
      searchTerm: "",
    });
  };

  const gameTypes = [
    { label: "Valorant", value: "Valorant" },
    { label: "CS2", value: "CS2" },
    { label: "Fortnite", value: "Fortnite" },
    { label: "Steam", value: "Steam" },
    { label: "League of Legends", value: "LeagueOfLegends" },
    { label: "Overwatch", value: "Overwatch" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-valorant-cyan">Marketplace</h1>
            <p className="text-gray-400">Browse and purchase game accounts</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search accounts by name or seller..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <AdvancedFilter
                accounts={accounts}
                onFiltersChange={handleAdvancedFiltersChange}
                currentFilters={advancedFilters}
              />
            </div>

            {/* Game Type Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGameType === null ? "default" : "outline"}
                onClick={() => { setSelectedGameType(null); setAdvancedFilters(f => ({ ...f, gameType: "all" })); }}
                className={
                  selectedGameType === null
                    ? "valorant-gradient"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                All Games
              </Button>
              {gameTypes.map((gt) => (
                <Button
                  key={gt.value}
                  variant={selectedGameType === gt.value ? "default" : "outline"}
                  onClick={() => { setSelectedGameType(gt.value); setAdvancedFilters(f => ({ ...f, gameType: gt.value })); }}
                  className={
                    selectedGameType === gt.value
                      ? "valorant-gradient"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {gt.label}
                </Button>
              ))}
            </div>

            {/* Active Filter Summary */}
            {hasActiveFilters(advancedFilters) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-400">Active filters:</span>
                {getFilterSummary(advancedFilters).map((summary) => (
                  <Badge key={summary} variant="outline" className="border-valorant-cyan text-valorant-cyan">
                    {summary}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAdvancedFilters}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {accounts.length} of {totalCount} available accounts
              {hasActiveFilters(advancedFilters) && accounts.length !== allAccounts.length && (
                <span> ({allAccounts.length} matched API, {accounts.length} after filters)</span>
              )}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-valorant-cyan mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading accounts...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-2">Failed to load accounts</p>
              <p className="text-gray-500 text-sm">Make sure the API server is running</p>
            </div>
          )}

          {/* Accounts Grid */}
          {!isLoading && !isError && accounts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account, index) => (
                <AccountCard key={account.id} account={account} index={index} />
              ))}
            </div>
          )}

          {!isLoading && !isError && accounts.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No accounts found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
