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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import useWebSocket from "@/hooks/use-websocket";
import { clearTokens } from "@/lib/auth";
import { RootState } from "@/redux/store";
import {
  Bell,
  Brackets,
  HelpCircle,
  Home,
  Layers,
  LayoutPanelTop,
  LogOut,
  Menu,
  Package,
  Percent,
  Settings,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    icon: Store,
    href: "/dashboard/store_management",
  },
  {
    title: "Layout",
    icon: LayoutPanelTop,
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
  {
    title: "Orders",
    icon: Brackets,
    href: "/dashboard/orders",
  },
  // {
  //   title: "Featured Products",
  //   icon: Package,
  //   href: "/dashboard/featured",
  // },
  // {
  //   title: "Virtual Try on",
  //   icon: Sparkles,
  //   href: "/dashboard/vto",
  // },
];

function DashboardSidebar() {
  const { userData } = useSelector((state: RootState) => state.userData);
  const { state } = useSidebar();
  console.log("Sidebar state:", state);
  useWebSocket();

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/";
  };

  const userInitials = `${userData?.first_name?.[0] || ""}${userData?.last_name?.[0] || ""
    }`;

  return (
    <Sidebar collapsible="icon" className="pt-16">
      <SidebarContent className=" mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-2 md:py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                    >
                      <item.icon />
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

      <SidebarFooter className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userData?.profile_image || "/placeholder.svg"}
                  alt={`${userData?.first_name} ${userData?.last_name}`}
                />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userData?.first_name} {userData?.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userData?.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userData?.profile_image || "/placeholder.svg"}
                    alt={`${userData?.first_name} ${userData?.last_name}`}
                  />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {userData?.first_name} {userData?.last_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userData?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/settingPage">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DashboardNav({ children }: { children: React.ReactNode }) {
  const { userData, userStateLoading: loading } = useSelector(
    (state: RootState) => state.userData
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/";
  };

  const userInitials = `${userData.first_name?.[0] || ""}${userData.last_name?.[0] || ""
    }`;

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Sidebar trigger for desktop */}
            <div className="hidden md:block">
              <SidebarTrigger className="-ml-1" />
            </div>

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

          {/* Notification Bell */}
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
          <div className="fixed inset-0 z-50 bg-background/95 flex flex-col md:hidden">
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
        <main className="pt-24 text-foreground px-2 md:px-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
