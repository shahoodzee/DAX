import { GameAccount } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ExternalLink, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface AccountCardProps {
  account: GameAccount;
  index: number;
}

const gameTypeColors = {
  Valorant: "bg-valorant-red text-white",
  CSGO: "bg-orange-500 text-white",
  Steam: "bg-blue-600 text-white",
  "League of Legends": "bg-blue-400 text-white",
  Overwatch: "bg-orange-400 text-white",
};

export default function AccountCard({ account, index }: AccountCardProps) {
  const navigate = useNavigate();
  const gameColor =
    gameTypeColors[account.accountType] || "bg-gray-500 text-white";
  const skinsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const skinsContainer = skinsScrollRef.current;
    if (!skinsContainer || account.skins.length <= 1) return;

    const scrollHeight = skinsContainer.scrollHeight;
    const clientHeight = skinsContainer.clientHeight;

    if (scrollHeight <= clientHeight) return;

    let scrollTop = 0;
    const scrollSpeed = 30; // pixels per second
    const pauseDuration = 2000; // pause at top/bottom for 2 seconds

    const autoScroll = () => {
      const maxScroll = scrollHeight - clientHeight;

      // Scroll down
      const scrollDown = () => {
        scrollTop += 1;
        skinsContainer.scrollTop = scrollTop;

        if (scrollTop >= maxScroll) {
          setTimeout(() => {
            // Scroll back to top
            const scrollUp = () => {
              scrollTop -= 1;
              skinsContainer.scrollTop = scrollTop;

              if (scrollTop <= 0) {
                setTimeout(scrollDown, pauseDuration);
              } else {
                setTimeout(scrollUp, scrollSpeed);
              }
            };
            scrollUp();
          }, pauseDuration);
        } else {
          setTimeout(scrollDown, scrollSpeed);
        }
      };

      scrollDown();
    };

    const timeoutId = setTimeout(autoScroll, 1000); // Start after 1 second

    return () => {
      clearTimeout(timeoutId);
    };
  }, [account.skins.length]);

  return (
    <Card
      className={`card-hover-effect bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white slide-in overflow-hidden relative`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-valorant-cyan">
            {account.accountName}
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={gameColor}>{account.accountType}</Badge>
          {account.rank && (
            <Badge
              variant="outline"
              className="border-valorant-purple text-valorant-purple"
            >
              {account.rank}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-1.5 text-sm">
          <div className="bg-valorant-dark/50 p-1.5 rounded border border-valorant-cyan/20">
            <p className="text-gray-400">Money Spent</p>
            <p className="font-bold text-valorant-gold">
              ${account.moneySpent}
            </p>
          </div>
          <div className="bg-valorant-dark/50 p-1.5 rounded border border-valorant-cyan/20">
            <p className="text-gray-400">Game Currency</p>
            <p className="font-bold text-valorant-cyan">
              {account.gameMoneySpent.toLocaleString()} {account.gameCurrency}
            </p>
          </div>
          <div className="bg-valorant-dark/50 p-1.5 rounded border border-valorant-cyan/20">
            <p className="text-gray-400">Total Skins</p>
            <p className="font-bold text-white">{account.numberOfSkins}</p>
          </div>
          <div className="bg-valorant-dark/50 p-1.5 rounded border border-valorant-cyan/20">
            <p className="text-gray-400">Level</p>
            <p className="font-bold text-white">{account.level || "N/A"}</p>
          </div>
        </div>

        {/* Featured Skins */}
        {account.skins.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-valorant-gold">
              Featured Skins
            </h4>
            <div
              ref={skinsScrollRef}
              className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide"
            >
              {account.skins.slice(0, 3).map((skin) => (
                <div
                  key={skin.id}
                  className="skin-card p-2 rounded text-xs hover:bg-valorant-purple/20 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-white">{skin.name}</p>
                      <p className="text-gray-400">
                        {skin.weaponType} • {skin.skinType}
                      </p>
                    </div>
                    <p className="font-bold text-valorant-gold ml-2">
                      {skin.price} {skin.currency}
                    </p>
                  </div>
                </div>
              ))}
              {account.skins.length > 3 && (
                <p className="text-xs text-gray-400 text-center">
                  +{account.skins.length - 3} more skins...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Seller Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-gray-400">
          <span>Seller: {account.sellerName}</span>
          <span>Listed {account.createdAt.toLocaleDateString()}</span>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-2 border-t border-gray-700">
          <div>
            <p className="text-sm text-gray-400">Selling Price</p>
            <p className="text-xl font-bold text-valorant-gold">
              ${account.price}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:border-valorant-cyan hover:text-white hover:bg-gray-800 flex-1 sm:flex-none"
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              className="valorant-gradient hover:opacity-90 flex-1 sm:flex-none"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Buy Now
            </Button>
          </div>
        </div>

        {/* Account Link */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => window.open(account.accountLink, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Account Profile
        </Button>
      </CardContent>
    </Card>
  );
}
