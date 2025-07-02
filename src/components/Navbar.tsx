import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthModal } from "@/components/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  FileText,
  User,
  LogOut,
  Download,
  Settings,
  Sparkles,
  Crown,
} from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "See you soon! 👋",
      description: "You have been successfully signed out.",
    });
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Templates", path: "/templates", icon: FileText },
    { name: "Pricing", path: "/pricing", icon: Crown },
    ...(user
      ? [
          { name: "My Resumes", path: "/my-resumes", icon: FileText },
          { name: "Downloaded", path: "/downloaded", icon: Download },
        ]
      : []),
  ];

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email;
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                    ResumeForge
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    AI-Powered
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.name === "Templates" && (
                      <Badge
                        variant="secondary"
                        className="ml-1 text-xs bg-green-100 text-green-700"
                      >
                        10
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span>ResumeForge</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive(item.path)
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}

                    <div className="pt-4 border-t">
                      {user ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 px-4 py-2">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {getUserInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.user_metadata?.full_name || "User"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={handleSignOut}
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={handleSignInClick}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Get Started Free
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex items-center space-x-3 p-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-resumes" className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        My Resumes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/downloaded" className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Downloads
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleSignInClick}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleSignInClick}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started Free
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navbar;
