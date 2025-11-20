import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AccountCard from "@/components/AccountCard";
import { sampleAccounts, sampleUsers } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Grid3X3, MapPin, Calendar, MessageCircle } from "lucide-react";

export default function SellerListings() {
  const { userId } = useParams<{ userId: string }>();
  const user = sampleUsers.find((u) => u.id === userId);
  const [displayedAccounts, setDisplayedAccounts] = useState<typeof sampleAccounts>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const INITIAL_ACCOUNTS_COUNT = 10;
  const ACCOUNTS_PER_PAGE = 20;

  if (!user) {
    return <Navigate to="/community" replace />;
  }

  // Get user's accounts
  const userAccounts = useMemo(
    () => sampleAccounts.filter((a) => a.sellerId === user.id),
    []
  );

  // Sidebar stats
  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  // Calculate user stats
  const userStats = useMemo(() => {
    const totalValue = userAccounts.reduce((sum, acc) => sum + acc.price, 0);
    const averagePrice = Math.round(
      userAccounts.length ? totalValue / userAccounts.length : 0
    );
    const listedCount = userAccounts.filter((a) => a.transactionStatus === "listed").length;
    const soldCount = userAccounts.filter((a) => a.transactionStatus === "sold").length;
    return { totalValue, averagePrice, listedCount, soldCount };
  }, [userAccounts]);

  const loadMoreAccounts = useCallback(
    (currentPage: number, isInitial = false) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setTimeout(() => {
        let startIndex, endIndex;

        if (isInitial || isFirstLoad) {
          startIndex = 0;
          endIndex = INITIAL_ACCOUNTS_COUNT;
          setIsFirstLoad(false);
        } else {
          const alreadyLoadedCount = displayedAccounts.length;
          startIndex = alreadyLoadedCount;
          endIndex = startIndex + ACCOUNTS_PER_PAGE;
        }

        const newAccounts = userAccounts.slice(startIndex, endIndex);

        if (newAccounts.length > 0) {
          setDisplayedAccounts((prev) => [...prev, ...newAccounts]);
          setPage((prev) => prev + 1);
        }

        if (endIndex >= userAccounts.length) {
          setHasMore(false);
        }

        setLoading(false);
      }, 300);
    },
    [loading, hasMore, isFirstLoad, displayedAccounts.length, userAccounts]
  );

  // Initial load
  useEffect(() => {
    setDisplayedAccounts([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
    setTimeout(() => {
      loadMoreAccounts(1, true);
    }, 0);
  }, [userId]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreAccounts(page, false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMoreAccounts, hasMore, loading, page]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-valorant-gold text-valorant-gold"
                : "text-gray-500"
            }`}
          />
        ))}
        <span className="text-sm text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Seller Header */}
        <div className="bg-gradient-to-r from-valorant-dark to-gray-900 border-b border-gray-700 px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-valorant-red to-valorant-gold flex items-center justify-center border-2 border-valorant-cyan/30 flex-shrink-0">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {user.fullName.charAt(0)}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-valorant-cyan mb-2">
                  {user.fullName}
                </h1>
                <p className="text-gray-400 mb-3">@{user.username}</p>
                <div className="mb-3">{renderStars(user.rating)}</div>
              </div>
            </div>

            {/* Contact Button */}
            <Button className="w-full sm:w-auto valorant-gradient hover:opacity-90 gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact Seller
            </Button>
          </div>

          {/* Seller Info Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Member Since</p>
                <p className="font-semibold text-white text-sm mt-1">
                  {user.joinedAt.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Total Sales</p>
                <p className="font-semibold text-valorant-gold text-sm mt-1">
                  {user.totalSales}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Avg Price</p>
                <p className="font-semibold text-valorant-cyan text-sm mt-1">
                  ${userStats.averagePrice}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-3">
                <p className="text-xs text-gray-400">Total Value</p>
                <p className="font-semibold text-white text-sm mt-1">
                  ${userStats.totalValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <main className="p-6">
          {/* Listings Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Active Listings
              <span className="text-gray-400 text-lg ml-2">
                ({userStats.listedCount})
              </span>
            </h2>
            <p className="text-gray-400">
              {userStats.listedCount} accounts available for purchase
            </p>
          </div>

          {/* Listings Grid */}
          {displayedAccounts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
                {displayedAccounts.map((account, index) => (
                  <AccountCard
                    key={`${account.id}-${index}`}
                    account={account}
                    index={index}
                  />
                ))}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-valorant-cyan border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-valorant-cyan">Loading more accounts...</span>
                  </div>
                </div>
              )}

              {/* End of List */}
              <div ref={observerRef} className="h-4" />

              {!hasMore && displayedAccounts.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    You've reached the end of the listings
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No accounts listed
              </h3>
              <p className="text-gray-400">
                This seller doesn't have any accounts currently available
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
