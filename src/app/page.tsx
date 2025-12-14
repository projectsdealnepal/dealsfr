// "use client"

// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { MapPin, Zap, TrendingUp, Building2, User, Download } from "lucide-react"
// import Link from "next/link"
// import Image from "next/image"

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
//         <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
//           {/* Logo */}
//           <Image
//             src="/images/TheDealsFr.png"
//             alt="TheDealsFr"
//             width={120}
//             height={40}
//             className="h-8 md:h-10 w-auto"
//           />
//           {/* Nav */}
//           <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
//             <Link href="#features" className="hover:text-primary transition-colors">How It Works</Link>
//             <Link href="#for-stores" className="hover:text-primary transition-colors">For Stores</Link>
//             <Link href="#customers" className="hover:text-primary transition-colors">For Customers</Link>
//             <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
//           </nav>
//           {/* Actions */}
//           <div className="flex items-center space-x-2">
//             <Button variant="outline" size="sm">
//               <Download className="w-4 h-4 mr-2" />
//               Download App
//             </Button>
//             <Button size="sm">
//               <Building2 className="w-4 h-4 mr-2" />
//               Register Store
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="py-16 md:py-24 lg:py-32 text-center">
//         <div className="container mx-auto px-4">
//           <Badge variant="secondary" className="mb-6">
//             🎯 Connecting Local Communities
//           </Badge>

//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
//             Discover{" "}
//             <span className="text-primary">Local Deals</span>, Effortlessly.
//           </h1>

//           <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
//             TheDealsFr connects you with exclusive discounts from nearby stores. Save smarter, support local.
//           </p>

//           {/* CTA */}
//           <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
//             <Link href="/register/registerCustomer">
//               <Button size="lg">
//                 <User className="w-5 h-5 mr-2" />
//                 Join as Customer
//               </Button>
//             </Link>
//             <Link href="/register/registerStoreAdmin">
//               <Button size="lg" variant="outline">
//                 <Building2 className="w-5 h-5 mr-2" />
//                 Register Store
//               </Button>
//             </Link>
//           </div>

//           {/* Features */}
//           <div className="flex flex-wrap justify-center gap-4 mb-12">
//             <div className="flex items-center space-x-2 border rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
//               <MapPin className="w-4 h-4" />
//               <span>HyperLocal</span>
//             </div>
//             <div className="flex items-center space-x-2 border rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
//               <Zap className="w-4 h-4" />
//               <span>Exclusive Offers</span>
//             </div>
//             <div className="flex items-center space-x-2 border rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
//               <TrendingUp className="w-4 h-4" />
//               <span>Real-Time Updates</span>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">10K+</div>
//               <div className="text-muted-foreground">Happy Users</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">500+</div>
//               <div className="text-muted-foreground">Partnered Stores</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">98%</div>
//               <div className="text-muted-foreground">Deal Satisfaction</div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser, loginUser } from "@/redux/features/user/user";
import { resetLoginState } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Eye, EyeOff, Loader2, Store, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LoginFormType {
  email: string;
  phone_number: string;
  password: string;
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"store" | "customer">("store");
  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    phone_number: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userStateLoading, isAuthenticated, userLoginError, userLoginData } =
    useAppSelector((state) => state.userData);

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(userLoginError);
  }, [userLoginError]);

  useEffect(() => {
    if (userLoginData != null) {
      router.push("/dashboard");
      setIsAuthenticating(false);
    }
    if (userLoginError) {
      router.push("/loginUser");
      setIsAuthenticating(false);
    }

    return () => {
      dispatch(resetLoginState());
    };
  }, [isAuthenticated, userLoginData, userLoginError]);

  useEffect(() => {
    if (isAuthenticated && !userLoginData && !userStateLoading) {
      dispatch(getUser());
    }
  }, [isAuthenticated, userLoginData, userStateLoading, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLocalError(null);

    const payload = {
      password: formData.password,
      email: formData.email,
    };
    dispatch(loginUser(payload));
  };

  // Loading state
  if (
    isAuthenticating ||
    (isAuthenticated && !userLoginData) ||
    userStateLoading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <Image
                src="/images/TheDealsFr.png"
                alt="TheDealsFr"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-medium">
                    {isAuthenticated && !userLoginData
                      ? "Loading dashboard..."
                      : "Signing in..."}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Please wait a moment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <Image
              src="/images/TheDealsFr.png"
              alt="TheDealsFr"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground">Deals For Real</p>
        </div>

        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {localError && (
              <Alert variant="destructive">
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            )}

            {/* Login Type Tabs */}
            {/* <Tabs
              value={loginType}
              onValueChange={(value) =>
                setLoginType(value as "store" | "customer")
              }
            >
              <TabsList className="grid  w-full grid-cols-2 gap-5">
                <TabsTrigger value="store" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Store
                </TabsTrigger>
                <TabsTrigger
                  value="customer"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Customer
                </TabsTrigger>
              </TabsList>
            </Tabs> */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === "store" ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="store@example.com"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+9779800000000"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isAuthenticating}
                className="w-full"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {` Don't have an account?`}{" "}
              </span>
              <Link
                href={"/register"}
                className="text-primary hover:underline font-medium"
              >
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
