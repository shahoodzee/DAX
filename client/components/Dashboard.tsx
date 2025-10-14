import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Plus,
  Settings,
  TrendingUp,
  Grid3X3,
  Users,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountCard from "./AccountCard";
import Navbar from "./Navbar";
import AdvancedFilter, { FilterState } from "./AdvancedFilter";
import CreateAccountModal from "./CreateAccountModal";
import Sidebar from "./Sidebar";
import { sampleAccounts } from "../data/sampleData";
import { GameAccount } from "@shared/types";
import {
  applyAdvancedFilters,
  getFilterSummary,
  hasActiveFilters,
} from "../utils/filterUtils";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts] = useState<GameAccount[]>(sampleAccounts);
  const [displayedAccounts, setDisplayedAccounts] = useState<GameAccount[]>([]);
  const [displayedAccountIds, setDisplayedAccountIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    gameType: "all",
    weaponTypes: [],
    skinTypes: [],
    specificCombinations: [],
    searchTerm: "",
  });

  const INITIAL_ACCOUNTS_COUNT = 10;
  const ACCOUNTS_PER_PAGE = 20;

  const filteredAccounts = applyAdvancedFilters(accounts, filters, searchTerm);

  // Load more accounts function
  const loadMoreAccounts = useCallback(
    (
      currentPage: number,
      currentIds: Set<string>,
      currentFiltered: GameAccount[],
      isInitial = false,
    ) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setTimeout(() => {
        let startIndex, endIndex;

        if (isInitial || isFirstLoad) {
          // First load: load initial amount
          startIndex = 0;
          endIndex = INITIAL_ACCOUNTS_COUNT;
          setIsFirstLoad(false);
        } else {
          // Subsequent loads: load more accounts
          const alreadyLoadedCount = currentIds.size;
          startIndex = alreadyLoadedCount;
          endIndex = startIndex + ACCOUNTS_PER_PAGE;
        }

        const newAccounts = currentFiltered.slice(startIndex, endIndex);

        if (newAccounts.length > 0) {
          // Ensure no duplicates using Set for better performance
          const uniqueNewAccounts = newAccounts.filter(
            (newAccount) => !currentIds.has(newAccount.id),
          );

          if (uniqueNewAccounts.length > 0) {
            setDisplayedAccounts((prev) => [...prev, ...uniqueNewAccounts]);
            setDisplayedAccountIds((prev) => {
              const newSet = new Set(prev);
              uniqueNewAccounts.forEach((account) => newSet.add(account.id));
              return newSet;
            });
            setPage((prev) => prev + 1);
          }
        }

        if (endIndex >= currentFiltered.length) {
          setHasMore(false);
        }

        setLoading(false);
      }, 500); // Simulate loading delay
    },
    [loading, hasMore, isFirstLoad],
  );

  // Reset when filters change
  useEffect(() => {
    setDisplayedAccounts([]);
    setDisplayedAccountIds(new Set());
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
    // Load initial accounts after reset
    setTimeout(() => {
      loadMoreAccounts(1, new Set(), filteredAccounts, true);
    }, 0);
  }, [searchTerm, filters]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreAccounts(page, displayedAccountIds, filteredAccounts, false);
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [
    loadMoreAccounts,
    hasMore,
    loading,
    page,
    displayedAccountIds,
    filteredAccounts,
  ]);


  const stats = {
    totalListings: filteredAccounts.length,
    totalValue: filteredAccounts.reduce((sum, acc) => sum + acc.price, 0),
    averagePrice: Math.round(
      filteredAccounts.reduce((sum, acc) => sum + acc.price, 0) /
        filteredAccounts.length || 0,
    ),
    featuredCount: filteredAccounts.filter((acc) => acc.featured).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      {/* Sidebar */}
      <Sidebar stats={stats} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Page Header */}
        <div className="px-4 sm:px-6 py-4 bg-gray-900/30 border-b border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Dashboard
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Browse and manage your game accounts
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex gap-3 sm:gap-4">
              <AdvancedFilter
                accounts={accounts}
                onFiltersChange={setFilters}
                currentFilters={filters}
              />

              <CreateAccountModal />
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters(filters) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {getFilterSummary(filters).map((summary, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-valorant-cyan text-valorant-cyan text-xs"
                >
                  {summary}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters({
                    gameType: "all",
                    weaponTypes: [],
                    skinTypes: [],
                    specificCombinations: [],
                    searchTerm: "",
                  })
                }
                className="text-xs text-gray-400 hover:text-white h-6 px-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <main className="p-4 sm:p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-valorant-red/20 to-valorant-red/10 border-valorant-red/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Value</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      ${stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-valorant-red floating" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-cyan/20 to-valorant-cyan/10 border-valorant-cyan/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Listings</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalListings}
                    </p>
                  </div>
                  <Grid3X3
                    className="w-8 h-8 text-valorant-cyan floating"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-gold/20 to-valorant-gold/10 border-valorant-gold/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Average Price</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      ${stats.averagePrice}
                    </p>
                  </div>
                  <TrendingUp
                    className="w-8 h-8 text-valorant-gold floating"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-purple/20 to-valorant-purple/10 border-valorant-purple/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Featured</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.featuredCount}
                    </p>
                  </div>
                  <Users
                    className="w-8 h-8 text-valorant-purple floating"
                    style={{ animationDelay: "1.5s" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              Game Accounts
              <span className="text-gray-400 ml-2">
                ({filteredAccounts.length} total, {displayedAccounts.length}{" "}
                loaded)
              </span>
            </h3>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {displayedAccounts.map((account, index) => (
              <AccountCard
                key={`${account.id}-${index}`}
                account={account}
                index={index}
              />
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-valorant-cyan border-t-transparent rounded-full animate-spin"></div>
                <span className="text-valorant-cyan">
                  Loading more accounts...
                </span>
              </div>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div ref={observerRef} className="h-4" />

          {/* No More Results */}
          {!hasMore && displayedAccounts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                You've reached the end of the list
              </p>
            </div>
          )}

          {/* No Results */}
          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No accounts found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
