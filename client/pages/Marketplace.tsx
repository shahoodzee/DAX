import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AccountCard from "@/components/AccountCard";
import { useMemo, useState } from "react";
import { sampleAccounts } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  const filteredAccounts = useMemo(() => {
    return sampleAccounts.filter((account) => {
      const matchesSearch =
        account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGameType = !selectedGameType || account.accountType === selectedGameType;
      const isListed = account.transactionStatus === "listed";
      return matchesSearch && matchesGameType && isListed;
    });
  }, [searchQuery, selectedGameType]);

  const gameTypes = Array.from(new Set(sampleAccounts.map((a) => a.accountType)));

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
            </div>

            {/* Game Type Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGameType === null ? "default" : "outline"}
                onClick={() => setSelectedGameType(null)}
                className={
                  selectedGameType === null
                    ? "valorant-gradient"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                All Games
              </Button>
              {gameTypes.map((gameType) => (
                <Button
                  key={gameType}
                  variant={selectedGameType === gameType ? "default" : "outline"}
                  onClick={() => setSelectedGameType(gameType)}
                  className={
                    selectedGameType === gameType
                      ? "valorant-gradient"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {gameType}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {filteredAccounts.length} of {sampleAccounts.filter((a) => a.transactionStatus === "listed").length} available accounts
            </p>
          </div>

          {/* Accounts Grid */}
          {filteredAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((account, index) => (
                <AccountCard key={account.id} account={account} index={index} />
              ))}
            </div>
          ) : (
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
