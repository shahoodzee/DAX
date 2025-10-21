import { useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { sampleAccounts, mockComments, mockNotifications } from "@/data/sampleData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Send, MessageCircle, Bell, Calendar, DollarSign, MapPin, Zap, User } from "lucide-react";

export default function AccountDetails() {
  const { id } = useParams<{ id: string }>();
  const account = sampleAccounts.find((a) => a.id === id);
  const [newComment, setNewComment] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = {
    totalListings: sampleAccounts.length,
    averagePrice: Math.round(
      sampleAccounts.reduce((s, a) => s + a.price, 0) /
        sampleAccounts.length
    ),
    featuredCount: sampleAccounts.filter((a) => a.featured).length,
  };

  if (!account) {
    return <Navigate to="/marketplace" replace />;
  }

  const comments = mockComments[account.id] || [];
  const notifications = mockNotifications[account.id] || [];

  const gameTypeColors: Record<string, string> = {
    Valorant: "bg-valorant-red text-white",
    CSGO: "bg-orange-500 text-white",
    Steam: "bg-blue-600 text-white",
    "League of Legends": "bg-blue-400 text-white",
    Overwatch: "bg-orange-400 text-white",
  };

  const gameColor = gameTypeColors[account.accountType] || "bg-gray-500 text-white";

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // Mock comment submission - in real app, would save to backend
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-valorant-cyan mb-2">
                  {account.accountName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={gameColor}>{account.accountType}</Badge>
                  {account.rank && (
                    <Badge variant="outline" className="border-valorant-purple text-valorant-purple">
                      {account.rank}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`${
                      account.verificationStatus === "verified"
                        ? "border-green-500 text-green-400"
                        : account.verificationStatus === "pending"
                          ? "border-yellow-500 text-yellow-400"
                          : "border-red-500 text-red-400"
                    }`}
                  >
                    {account.verificationStatus.charAt(0).toUpperCase() +
                      account.verificationStatus.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-valorant-cyan text-valorant-cyan hover:bg-valorant-cyan hover:text-black"
                  onClick={() => window.open(account.accountLink, "_blank")}
                >
                  View Profile
                </Button>
                <Button className="valorant-gradient hover:opacity-90">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Details and Comments */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments" className="relative">
                    Comments
                    {comments.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-valorant-red rounded-full">
                        {comments.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4 mt-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-valorant-gold">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-valorant-cyan mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-400">Account Name</p>
                            <p className="font-semibold text-white">{account.accountName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-valorant-cyan mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-400">Date Created</p>
                            <p className="font-semibold text-white">
                              {account.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-valorant-cyan mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-400">Created By</p>
                            <p className="font-semibold text-white">{account.sellerName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-valorant-cyan mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-400">Account Region</p>
                            <p className="font-semibold text-white">North America</p>
                          </div>
                        </div>
                      </div>

                      {account.description && (
                        <div className="pt-4 border-t border-gray-700">
                          <p className="text-sm text-gray-400 mb-2">Description</p>
                          <p className="text-white">{account.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-valorant-gold">Game Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-valorant-dark/50 p-4 rounded-lg border border-valorant-cyan/20">
                          <p className="text-sm text-gray-400">Money Spent (USD)</p>
                          <p className="text-2xl font-bold text-valorant-gold">
                            ${account.moneySpent}
                          </p>
                        </div>

                        <div className="bg-valorant-dark/50 p-4 rounded-lg border border-valorant-cyan/20">
                          <p className="text-sm text-gray-400">Game Currency Spent</p>
                          <p className="text-2xl font-bold text-valorant-cyan">
                            {account.gameMoneySpent.toLocaleString()} {account.gameCurrency}
                          </p>
                        </div>

                        <div className="bg-valorant-dark/50 p-4 rounded-lg border border-valorant-cyan/20">
                          <p className="text-sm text-gray-400">Total Skins</p>
                          <p className="text-2xl font-bold text-white">{account.numberOfSkins}</p>
                        </div>

                        <div className="bg-valorant-dark/50 p-4 rounded-lg border border-valorant-cyan/20">
                          <p className="text-sm text-gray-400">Account Level</p>
                          <p className="text-2xl font-bold text-white">
                            {account.level || "N/A"}
                          </p>
                        </div>
                      </div>

                      {account.skins.length > 0 && (
                        <div className="pt-4 border-t border-gray-700">
                          <h4 className="font-semibold text-valorant-gold mb-3">Account Skins</h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {account.skins.map((skin) => (
                              <div
                                key={skin.id}
                                className="skin-card p-3 rounded flex justify-between items-center hover:bg-valorant-purple/20 transition-colors"
                              >
                                <div>
                                  <p className="font-medium text-white">{skin.name}</p>
                                  <p className="text-xs text-gray-400">
                                    {skin.weaponType} • {skin.skinType}
                                  </p>
                                </div>
                                <p className="font-bold text-valorant-gold">
                                  {skin.price} {skin.currency}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-valorant-gold flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Selling Price
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-valorant-gold/20 to-valorant-red/20 border border-valorant-gold/30 rounded-lg p-4">
                        <p className="text-sm text-gray-300 mb-1">Account Selling Price</p>
                        <p className="text-4xl font-bold text-valorant-gold">${account.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-4 mt-4">
                  {/* Comment Form */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <Input
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleCommentSubmit();
                            }
                          }}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Button
                          onClick={handleCommentSubmit}
                          className="valorant-gradient hover:opacity-90"
                          disabled={!newComment.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comments List */}
                  {comments.length > 0 ? (
                    <div className="space-y-3">
                      {comments.map((comment) => (
                        <Card
                          key={comment.id}
                          className="bg-gray-800 border-gray-700 hover:border-valorant-cyan/30 transition-colors"
                        >
                          <CardContent className="pt-6">
                            <div className="flex gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-valorant-red to-valorant-gold flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-sm text-white">
                                  {comment.authorName.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-white">{comment.authorName}</p>
                                  <p className="text-xs text-gray-400">
                                    {comment.createdAt.toLocaleDateString()}
                                  </p>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-valorant-cyan hover:text-valorant-gold hover:bg-transparent text-xs"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <MessageCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Notification Trail Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-valorant-gold flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notifications
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                        )
                        .map((notification) => (
                          <div
                            key={notification.id}
                            className="border-l-2 border-valorant-cyan/50 pl-3 py-2 hover:border-valorant-cyan transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-valorant-cyan mt-1.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-white font-medium">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.timestamp.toLocaleDateString()}{" "}
                                  {notification.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No notifications yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card className="bg-gray-800 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-valorant-gold">Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Seller Name</p>
                    <p className="font-semibold text-white">{account.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <Badge
                      variant="outline"
                      className={`${
                        account.transactionStatus === "listed"
                          ? "border-green-500 text-green-400"
                          : account.transactionStatus === "pending"
                            ? "border-yellow-500 text-yellow-400"
                            : "border-gray-500 text-gray-300"
                      }`}
                    >
                      {account.transactionStatus.charAt(0).toUpperCase() +
                        account.transactionStatus.slice(1)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-valorant-cyan text-valorant-cyan hover:bg-valorant-cyan hover:text-black mt-4"
                  >
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
