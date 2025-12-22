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
import { getUser, loginUser } from "@/redux/features/user/user";
import { resetLoginState } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
