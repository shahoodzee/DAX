import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, Star } from "lucide-react";

interface UserCardProps {
  userId: string;
  fullName: string;
  joinedAt: Date;
  accountCount: number;
  rating: number;
  totalSales: number;
  index: number;
}

export default function UserCard({
  userId,
  fullName,
  joinedAt,
  accountCount,
  rating,
  totalSales,
  index,
}: UserCardProps) {
  const navigate = useNavigate();

  const handleViewListings = () => {
    navigate(`/community/${userId}`);
  };

  return (
    <Card
      className="card-hover-effect bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white slide-in overflow-hidden cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleViewListings}
    >
      <CardContent className="p-6">
        {/* Profile Photo Placeholder */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-valorant-red to-valorant-gold flex items-center justify-center border-2 border-valorant-cyan/30">
            <span className="text-3xl font-bold text-white">
              {fullName.charAt(0)}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-valorant-cyan mb-1">
            {fullName}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "fill-valorant-gold text-valorant-gold"
                      : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">({rating})</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-valorant-dark/50 p-3 rounded border border-valorant-cyan/20">
            <p className="text-xs text-gray-400">Accounts</p>
            <div className="flex items-center gap-2 mt-1">
              <Grid3X3 className="w-4 h-4 text-valorant-cyan" />
              <p className="font-bold text-white">{accountCount}</p>
            </div>
          </div>

          <div className="bg-valorant-dark/50 p-3 rounded border border-valorant-cyan/20">
            <p className="text-xs text-gray-400">Joined</p>
            <p className="text-sm font-semibold text-valorant-gold mt-1">
              {joinedAt.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Sales Info */}
        <div className="mb-4 p-3 bg-valorant-purple/10 border border-valorant-purple/20 rounded">
          <p className="text-xs text-gray-400">Total Sales</p>
          <p className="font-bold text-valorant-purple">{totalSales}</p>
        </div>

        {/* View Listings Button */}
        <Button
          onClick={handleViewListings}
          className="w-full valorant-gradient hover:opacity-90"
        >
          View Listings
        </Button>
      </CardContent>
    </Card>
  );
}
