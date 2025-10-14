import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useMemo } from "react";
import { sampleAccounts } from "@/data/sampleData";

export default function Settings() {
  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-2">Settings</h2>
          <p className="text-gray-400 mb-6">This feature has not been developed yet.</p>
        </main>
      </div>
    </div>
  );
}
