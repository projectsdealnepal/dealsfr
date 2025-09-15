"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { clearTokens } from "@/lib/auth";
import { RootState } from "@/redux/store";
import {
  BarChart3,
  Bell,
  HelpCircle,
  Home,
  Layers,
  LogOut,
  Menu,
  Package,
  Percent,
  Settings,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const navigationItems = [
  {
    title: "Overview",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Store Management",
    icon: BarChart3,
    href: "/dashboard/store_management",
  },
  {
    title: "Layout",
    icon: Store,
    href: "/dashboard/layout",
  },
  {
    title: "Discounts",
    icon: Percent,
    href: "/dashboard/discounts",
  },
  {
    title: "Banner",
    icon: Layers,
    href: "/dashboard/banner",
  },
  {
    title: "Products",
    icon: Package,
    href: "/dashboard/product",
  },
];

export function DashboardNav({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userData, userStateLoading: loading } = useSelector(
    (state: RootState) => state.userData
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/loginUser";
  };

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-1/2 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  // Don't render if no user - let layout handle this
  if (!userData) {
    return null;
  }

  const userInitials = "Avatar";

  return (
    <SidebarProvider>
      <Sidebar className="mt-2 bg-background pt-20">
        <SidebarContent className="px-2 md:px-3 py-4 bg-background ">
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary text-xs uppercase tracking-wider font-semibold mb-3 px-2 md:px-3"></SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-2 md:py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      >
                        <item.icon className="h-4 w-4 md:h-5 md:w-5 text-primary transition-colors flex-shrink-0" />
                        <span className="font-medium text-sm md:text-base truncate">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className=" p-2 md:p-4 bg-background">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-[40px] md:h-[50px] cursor-pointer justify-start space-x-2 md:space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground p-2 md:p-3 rounded-lg transition-all duration-200"
              >
                <Avatar className="h-7 w-7 md:h-9 md:w-9 flex-shrink-0">
                  <AvatarImage
                    src={userData.profile_image || "/placeholder.svg"}
                    alt={`${userData.first_name} ${userData.last_name}`}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate text-foreground">
                    {userData.first_name} {userData.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {userData.email}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 md:w-56">
              <DropdownMenuLabel className="text-foreground font-semibold text-sm md:text-base">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/settingPage">
                <DropdownMenuItem className="text-muted-foreground text-sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="text-muted-foreground text-sm">
                <HelpCircle className="mr-2 h-4 w-4" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:bg-destructive/10 text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Fixed Header */}
        {/**/}
        <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b px-3 md:px-6 py-3 md:py-4  flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile menu button (hamburger) - only on mobile */}
            <button
              className="md:hidden text-muted-foreground hover:text-foreground p-2 rounded-md focus:outline-none"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* Logo */}
            <div className="flex flex-col items-start space-y-1">
              <div className="relative h-6 w-24 md:h-8 md:w-32">
                <Link href={"/dashboard"}>
                  <Image
                    src="/images/TheDealsFr.png"
                    alt="TheDealsFr"
                    fill
                    className="object-contain"
                    priority
                  />
                </Link>
              </div>
            </div>
          </div>
          {/* Notification Bell and user dropdown (unchanged) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 bg-accent md:h-10 md:w-10"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 md:h-3 md:w-3 bg-primary rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Mobile full-screen menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span className="text-lg font-bold text-foreground">Menu</span>
              <button
                className="text-muted-foreground hover:text-foreground p-2 rounded-md"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-stretch justify-start px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
            <div className="border-t p-4 flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-[40px] cursor-pointer justify-start space-x-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground p-2 rounded-lg transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={userData.profile_image || "/placeholder.svg"}
                        alt={`${userData.first_name} ${userData.last_name}`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-foreground font-semibold truncate">
                        {userData.first_name} {userData.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {userData.email}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-foreground font-semibold">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard/settingPage">
                    <DropdownMenuItem className="text-muted-foreground">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-muted-foreground">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* Main Content with top padding to prevent overlap */}
        <main className="pt-20 md:pt-24 flex-1 bg-background text-foreground px-2 md:px-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
