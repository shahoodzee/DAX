import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, Menu, Settings, LogOut, UserCircle } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Navbar({
  onMenuClick,
  showMenuButton = true,
}: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden border-valorant-cyan text-valorant-cyan hover:bg-valorant-cyan hover:text-black"
                onClick={onMenuClick}
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-500 bg-transparent text-white-700 hover:bg-gray-400 hover:text-white"
            >
              <Bell className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-500 bg-transparent text-white-700 hover:bg-gray-400 hover:text-white"
                >
                  <User className="w-4 h-4" />
                  Jhon Doe 
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-gray-800 border-gray-700 text-white"
              >
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/account")}
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer text-red-400 hover:text-red-300">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
