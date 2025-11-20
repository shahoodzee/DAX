import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import UserCard from "@/components/UserCard";
import { sampleAccounts, sampleUsers } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedUsers, setDisplayedUsers] = useState<typeof sampleUsers>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const INITIAL_USERS_COUNT = 8;
  const USERS_PER_PAGE = 12;

  // Calculate user data with account counts
  const usersWithAccounts = useMemo(() => {
    return sampleUsers.map((user) => {
      const userAccounts = sampleAccounts.filter((a) => a.sellerId === user.id);
      return {
        ...user,
        accountCount: userAccounts.length,
      };
    });
  }, []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return usersWithAccounts.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, usersWithAccounts]);

  // Sidebar stats
  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  const loadMoreUsers = useCallback(
    (currentPage: number, currentFiltered: typeof usersWithAccounts, isInitial = false) => {
      if (loading || !hasMore) return;

      setLoading(true);
      setTimeout(() => {
        let startIndex, endIndex;

        if (isInitial || isFirstLoad) {
          startIndex = 0;
          endIndex = INITIAL_USERS_COUNT;
          setIsFirstLoad(false);
        } else {
          const alreadyLoadedCount = displayedUsers.length;
          startIndex = alreadyLoadedCount;
          endIndex = startIndex + USERS_PER_PAGE;
        }

        const newUsers = currentFiltered.slice(startIndex, endIndex);

        if (newUsers.length > 0) {
          setDisplayedUsers((prev) => [...prev, ...newUsers]);
          setPage((prev) => prev + 1);
        }

        if (endIndex >= currentFiltered.length) {
          setHasMore(false);
        }

        setLoading(false);
      }, 300);
    },
    [loading, hasMore, isFirstLoad, displayedUsers.length]
  );

  // Reset and load on filter change
  useEffect(() => {
    setDisplayedUsers([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
    setTimeout(() => {
      loadMoreUsers(1, filteredUsers, true);
    }, 0);
  }, [searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreUsers(page, filteredUsers, false);
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
  }, [loadMoreUsers, hasMore, loading, page, filteredUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-valorant-cyan">Community</h1>
            <p className="text-gray-400">
              Discover and connect with sellers who have listed game accounts
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {displayedUsers.length} of {filteredUsers.length} sellers
            </p>
          </div>

          {/* Users Grid */}
          {filteredUsers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedUsers.map((user, index) => (
                  <UserCard
                    key={user.id}
                    userId={user.id}
                    fullName={user.fullName}
                    joinedAt={user.joinedAt}
                    accountCount={user.accountCount}
                    rating={user.rating}
                    totalSales={user.totalSales}
                    index={index}
                  />
                ))}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-valorant-cyan border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-valorant-cyan">Loading more sellers...</span>
                  </div>
                </div>
              )}

              {/* End of List */}
              <div ref={observerRef} className="h-4" />

              {!hasMore && displayedUsers.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    You've reached the end of the sellers list
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No sellers found</h3>
              <p className="text-gray-400">
                Try adjusting your search query
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
