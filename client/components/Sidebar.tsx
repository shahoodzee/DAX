import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Home, Grid3X3, Users, Settings } from "lucide-react";

export interface SidebarStats {
  totalListings: number;
  averagePrice: number;
  featuredCount: number;
}

export default function Sidebar({ stats }: { stats: SidebarStats }) {
  const navItems: { to: string; label: string; icon: React.ElementType; badge?: string }[] = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/marketplace", label: "Marketplace", icon: Grid3X3 },
    { to: "/my-listings", label: "My Listings", icon: TrendingUp },
    { to: "/community", label: "Community", icon: Users },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-valorant-dark to-gray-900 border-r border-valorant-cyan/20 z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 valorant-gradient rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-valorant-gold">DAX</h1>
            <p className="text-xs text-gray-400">Digital Assets Exchange</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-valorant-red/20 text-valorant-red border border-valorant-red/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <item.icon className="w-5 h-5 group-hover:text-valorant-cyan" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge className="ml-auto bg-valorant-gold text-black text-xs">{item.badge}</Badge>
              )}
            </NavLink>
          ))}
        </nav>

        <Card className="mt-8 bg-gradient-to-r from-valorant-purple/20 to-valorant-cyan/20 border-valorant-cyan/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-valorant-gold">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Listings:</span>
              <span className="text-white font-bold">{stats.totalListings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Price:</span>
              <span className="text-valorant-gold font-bold">${stats.averagePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Featured:</span>
              <span className="text-valorant-cyan font-bold">{stats.featuredCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
