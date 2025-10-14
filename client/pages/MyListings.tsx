import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Search, TrendingUp, Grid3X3, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountCard from "@/components/AccountCard";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AdvancedFilter, { FilterState } from "@/components/AdvancedFilter";
import { sampleAccounts } from "@/data/sampleData";
import { GameAccount } from "@shared/types";
import {
  applyAdvancedFilters,
  getFilterSummary,
  hasActiveFilters,
} from "@/utils/filterUtils";
import { getCurrentUser } from "@/lib/auth";

export default function MyListings() {
  const user = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts] = useState<GameAccount[]>(
    sampleAccounts.filter((a) => a.sellerId === user.id),
  );
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

  const sidebarStats = useMemo(() => {
    const totalListings = filteredAccounts.length;
    const totalValue = filteredAccounts.reduce((sum, acc) => sum + acc.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = filteredAccounts.filter((acc) => acc.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, [filteredAccounts]);

  const statusStats = useMemo(() => {
    const listed = filteredAccounts.filter(
      (a) => a.transactionStatus === "listed",
    ).length;
    const pending = filteredAccounts.filter(
      (a) => a.transactionStatus === "pending",
    ).length;
    const sold = filteredAccounts.filter(
      (a) => a.transactionStatus === "sold",
    ).length;
    const totalValue = filteredAccounts.reduce(
      (sum, acc) => sum + acc.price,
      0,
    );
    return { listed, pending, sold, totalValue };
  }, [filteredAccounts]);

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
          startIndex = 0;
          endIndex = INITIAL_ACCOUNTS_COUNT;
          setIsFirstLoad(false);
        } else {
          const alreadyLoadedCount = currentIds.size;
          startIndex = alreadyLoadedCount;
          endIndex = startIndex + ACCOUNTS_PER_PAGE;
        }

        const newAccounts = currentFiltered.slice(startIndex, endIndex);

        if (newAccounts.length > 0) {
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
      }, 300);
    },
    [loading, hasMore, isFirstLoad],
  );

  useEffect(() => {
    setDisplayedAccounts([]);
    setDisplayedAccountIds(new Set());
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
    setTimeout(() => {
      loadMoreAccounts(1, new Set(), filteredAccounts, true);
    }, 0);
  }, [searchTerm, filters]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={sidebarStats} />
      <div className="lg:ml-64">
        <Navbar />

        <div className="px-4 sm:px-6 py-4 bg-gray-900/30 border-b border-gray-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              My Listings
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Accounts you own and manage
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search my accounts..."
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
            </div>
          </div>

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

        <main className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-valorant-cyan/20 to-valorant-cyan/10 border-valorant-cyan/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Listed</p>
                    <p className="text-2xl font-bold text-white">
                      {statusStats.listed}
                    </p>
                  </div>
                  <Grid3X3 className="w-8 h-8 text-valorant-cyan floating" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-gold/20 to-valorant-gold/10 border-valorant-gold/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      {statusStats.pending}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-valorant-gold floating" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-purple/20 to-valorant-purple/10 border-valorant-purple/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Sold</p>
                    <p className="text-2xl font-bold text-white">
                      {statusStats.sold}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-valorant-purple floating" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-red/20 to-valorant-red/10 border-valorant-red/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Value</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      ${statusStats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-valorant-red floating" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              My Game Accounts
              <span className="text-gray-400 ml-2">
                ({filteredAccounts.length} total, {displayedAccounts.length}{" "}
                loaded)
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {displayedAccounts.map((account, index) => (
              <AccountCard
                key={`${account.id}-${index}`}
                account={account}
                index={index}
              />
            ))}
          </div>

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

          <div ref={observerRef} className="h-4" />

          {!hasMore && displayedAccounts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">
                You've reached the end of the list
              </p>
            </div>
          )}

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No accounts found
              </h3>
              <p className="text-gray-400">
                You haven't listed any accounts yet
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
