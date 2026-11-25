import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleAccounts } from "@/data/sampleData";
import { Save } from "lucide-react";
import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  country: string;
  bio: string;
}

export default function Profile() {
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    country: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) return;
    const m = user.user_metadata ?? {};
    setProfile({
      firstName: m.first_name ?? "",
      lastName: m.last_name ?? "",
      email: user.email ?? "",
      username: m.username ?? "",
      phone: m.phone ?? user.phone ?? "",
      country: m.country ?? "",
      bio: m.bio ?? "",
    });
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    if (!isEditing) setTempProfile(profile);
  }, [profile]);

  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: tempProfile.firstName,
        last_name: tempProfile.lastName,
        username: tempProfile.username,
        phone: tempProfile.phone,
        country: tempProfile.country,
        bio: tempProfile.bio,
        full_name: `${tempProfile.firstName} ${tempProfile.lastName}`.trim(),
      },
    });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const displayProfile = isEditing ? tempProfile : profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar />
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Profile</h2>
            <p className="text-gray-400">Manage your personal information</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl">User Information</CardTitle>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-valorant-red hover:bg-valorant-red/80"
                >
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={displayProfile.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={displayProfile.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={displayProfile.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={displayProfile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={displayProfile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={displayProfile.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={displayProfile.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-valorant-red focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-valorant-red hover:bg-valorant-red/80 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
