"use client";

import BranchSection from "@/app/_components/storeManagement/BranchSection";
import SocialMediaSection from "@/app/_components/storeManagement/SocialMediaSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/redux/hooks";
import {
  Edit,
  Files,
  Globe,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const StoreManager = () => {
  const router = useRouter();
  const { storeDetailData, branchDetailsData } = useAppSelector((s) => s.store);

  const handleStoreDetailEdit = (id: number) => {
    router.push(`/dashboard/store_setup/`);
    console.log({ id });
  };

  const handleDocumentsClick = (id: number) => {
    router.push(`/dashboard/store_management/documents`);
    console.log({ id });
  };

  useEffect(() => {
    if (branchDetailsData) {
      router.push("/dashboard/create_branch/?action=edit");
    }
  }, [branchDetailsData]);

  const storeTypeLabels: Record<string, string> = {
    DEPT: "Department Store",
    SUPER: "Supermarket",
    LOCAL: "Local Store",
    ONLINE: "Online Store",
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Store Management
        </h1>
      </div>
      {!storeDetailData && (
        <Card className="justify-center p-20 border-0  gap-4">
          <CardContent className="flex flex-col items-center text-card-foreground mx-auto gap-4 text-xl  mb-2">
            <CardTitle>No Store data found!!</CardTitle>
            <Link href="/dashboard/store_setup" className="">
              <Button variant="outline" size="lg">
                <PlusCircle className="h-4 w-4 mr-2" />
                Register Your Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {storeDetailData && (
        <Card className="w-full transition-colors border-0 shadow-none rounded-none">
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={storeDetailData.logo || undefined}
                    alt={storeDetailData.name}
                    className="object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {(storeDetailData?.name ?? "")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-card-foreground text-xl mb-2">
                    {storeDetailData.name}
                  </CardTitle>
                  <Badge variant="secondary">
                    {storeTypeLabels[storeDetailData.store_type] ||
                      storeDetailData.store_type}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-5 flex-wrap">
                <Button
                  onClick={() => handleDocumentsClick(storeDetailData.id)}
                  variant={"outline"}
                  className="flex flex-row"
                >
                  <Files />
                  <span>Documents</span>
                </Button>
                <Button
                  onClick={() => handleStoreDetailEdit(storeDetailData.id)}
                  variant={"outline"}
                  className="flex flex-row"
                >
                  <Edit />
                  <span>Details</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>
                    {storeDetailData.address}, {storeDetailData.city},{" "}
                    {storeDetailData.district}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{storeDetailData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{storeDetailData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{storeDetailData.website}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-card-foreground mb-2">
                  Description
                </h3>
                <p className="text-sm text-muted-foreground">
                  {storeDetailData.description}
                </p>
              </div>
            </div>
            <div>
              <SocialMediaSection />
            </div>

            <Separator className="my-4" />
            <div>
              <BranchSection />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreManager;
