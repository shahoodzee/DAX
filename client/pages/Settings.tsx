import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleAccounts } from "@/data/sampleData";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(false);

  const stats = useMemo(() => {
    const totalListings = sampleAccounts.length;
    const totalValue = sampleAccounts.reduce((s, a) => s + a.price, 0);
    const averagePrice = Math.round(totalListings ? totalValue / totalListings : 0);
    const featuredCount = sampleAccounts.filter((a) => a.featured).length;
    return { totalListings, averagePrice, featuredCount };
  }, []);

  const handleDeactivateAccount = () => {
    setIsAccountDeactivated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Sidebar stats={stats} />
      <div className="lg:ml-64">
        <Navbar />
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Settings</h2>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    Account status: <span className="font-bold">Active</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Profile Privacy</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Control who can see your profile and trading history
                  </p>
                  <Button
                    className="bg-valorant-red hover:bg-valorant-red/80 text-white w-full"
                  >
                    Manage Privacy Settings
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button
                    className="bg-valorant-red hover:bg-valorant-red/80 text-white w-full"
                  >
                    Enable 2FA
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Email Preferences</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Choose what notifications you want to receive
                  </p>
                  <Button
                    className="bg-valorant-red hover:bg-valorant-red/80 text-white w-full"
                  >
                    Update Email Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!isAccountDeactivated && (
              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Deactivate Account</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Deactivating your account will disable your access to DAX and hide your
                        profile from other users. Your listings will be removed from the marketplace.
                        This action can be undone within 30 days.
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 w-full">
                          Deactivate Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This action will deactivate your account. You can reactivate it within 30
                            days. After that, your account and all associated data will be permanently
                            deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeactivateAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Deactivate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )}

            {isAccountDeactivated && (
              <Card className="bg-yellow-900/20 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-400">Account Deactivated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Your account has been deactivated. You have 30 days to reactivate it before it's
                    permanently deleted.
                  </p>
                  <Button className="bg-valorant-red hover:bg-valorant-red/80 w-full">
                    Reactivate Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
