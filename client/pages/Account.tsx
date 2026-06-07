import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleAccounts } from "@/data/sampleData";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react";

export default function Account() {
  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  const accountStats = useMemo(() => {
    const gameAccountsSold = 24;
    const gameAccountsBought = 18;
    const totalSpent = 2450;
    const totalEarned = 5800;
    const mostExpensiveSold = 890;
    const mostExpensiveBought = 745;

    return {
      gameAccountsSold,
      gameAccountsBought,
      totalSpent,
      totalEarned,
      mostExpensiveSold,
      mostExpensiveBought,
      netEarnings: totalEarned - totalSpent,
    };
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: "up" | "down";
    subtitle?: string;
  }) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-valorant-red/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div
            className={`p-3 rounded-lg ${
              trend === "up"
                ? "bg-green-500/20"
                : trend === "down"
                  ? "bg-red-500/20"
                  : "bg-valorant-red/20"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-6 h-6 text-green-400" />
            ) : trend === "down" ? (
              <TrendingDown className="w-6 h-6 text-red-400" />
            ) : (
              <Icon className="w-6 h-6 text-valorant-red" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar />
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Account Statistics</h2>
            <p className="text-gray-400">Overview of your trading activity and performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Game Accounts Sold"
              value={accountStats.gameAccountsSold}
              icon={TrendingUp}
              trend="up"
            />

            <StatCard
              title="Game Accounts Bought"
              value={accountStats.gameAccountsBought}
              icon={ShoppingCart}
              trend="up"
            />

            <StatCard
              title="Total Spent"
              value={`$${accountStats.totalSpent}`}
              icon={DollarSign}
              trend="down"
              subtitle="on purchases"
            />

            <StatCard
              title="Total Earned"
              value={`$${accountStats.totalEarned}`}
              icon={DollarSign}
              trend="up"
              subtitle="from sales"
            />

            <StatCard
              title="Most Expensive Account Sold"
              value={`$${accountStats.mostExpensiveSold}`}
              icon={TrendingUp}
            />

            <StatCard
              title="Most Expensive Account Bought"
              value={`$${accountStats.mostExpensiveBought}`}
              icon={ShoppingCart}
            />
          </div>

          <Card className="bg-gradient-to-r from-valorant-purple/20 to-valorant-cyan/20 border-valorant-cyan/30 mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Spent</p>
                  <p className="text-2xl font-bold text-red-400">${accountStats.totalSpent}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Earned</p>
                  <p className="text-2xl font-bold text-green-400">${accountStats.totalEarned}</p>
                </div>
                <div className="border-l border-gray-700 pl-8">
                  <p className="text-gray-400 text-sm mb-2">Net Earnings</p>
                  <p className="text-2xl font-bold text-valorant-cyan">
                    ${accountStats.netEarnings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
