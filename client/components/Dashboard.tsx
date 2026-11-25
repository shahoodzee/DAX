import { useState } from "react";
import { Search, TrendingUp, Grid3X3, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "./Navbar";
import AdvancedFilter, { FilterState } from "./AdvancedFilter";
import CreateAccountModal from "./CreateAccountModal";
import Sidebar from "./Sidebar";
import { GameAccount } from "@shared/types";
import { useAuth } from "@/context/AuthContext";
import { fetchMyListings, toGameAccount } from "@/lib/api";
import {
  getFilterSummary,
  hasActiveFilters,
} from "../utils/filterUtils";

export default function Dashboard() {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    gameType: "all",
    weaponTypes: [],
    skinTypes: [],
    specificCombinations: [],
    searchTerm: "",
  });

  const { data: apiData } = useQuery({
    queryKey: ["my-listings", session?.access_token],
    queryFn: () => fetchMyListings(session!.access_token),
    enabled: !!session?.access_token,
  });

  const accounts: GameAccount[] = (apiData?.data?.items ?? []).map(toGameAccount);

  const stats = {
    totalListings: accounts.filter((a) => a.transactionStatus === "Available").length,
    totalValue: accounts.reduce((sum, a) => sum + a.price, 0),
    averagePrice: accounts.length
      ? Math.round(accounts.reduce((sum, a) => sum + a.price, 0) / accounts.length)
      : 0,
    featuredCount: accounts.filter((a) => a.featured).length,
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
            <Card className="bg-gradient-to-r from-valorant-red/10 to-transparent border border-valorant-red/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      ${stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-valorant-red/60 floating" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-cyan/10 to-transparent border border-valorant-cyan/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Listings</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      {stats.totalListings}
                    </p>
                  </div>
                  <Grid3X3
                    className="w-8 h-8 text-valorant-cyan/60 floating"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-gold/10 to-transparent border border-valorant-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Price</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      ${stats.averagePrice}
                    </p>
                  </div>
                  <TrendingUp
                    className="w-8 h-8 text-valorant-gold/60 floating"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-valorant-purple/10 to-transparent border border-valorant-purple/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Featured</p>
                    <p className="text-2xl font-bold text-valorant-gold">
                      {stats.featuredCount}
                    </p>
                  </div>
                  <Users
                    className="w-8 h-8 text-valorant-purple/60 floating"
                    style={{ animationDelay: "1.5s" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

        </main>
      </div>
    </div>
  );
}
