"use client";
import { DiscountCard } from "@/app/_components/discount/DiscountCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/hooks";
import { ChevronDown, Plus } from "lucide-react";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const StoreManager = () => {
  const router = useRouter();
  const { discountData, discountStateLoading: discountLoading } =
    useAppSelector((s) => s.discount);

  useEffect(() => {}, []);

  console.log("discount", discountData);

  return (
    <>
      <Head>
        <title>Dashboard - Discounts</title>
        <meta name="description" content="Manage your store discounts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center  text-foreground mb-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold mb-2">Discounts</h1>
            <h3 className="text-xs md:text-sm text-muted-foreground">
              Discount will be shown to the user along with the banner layout
              and products on it.
            </h3>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Discount{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/discounts/create")}
                >
                  Campaign Discount
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Store Discount")}>
                  Store Discount
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {discountData && !discountLoading
            ? discountData?.map((item, index) => {
                return (
                  <div className="my-8" key={index.toString()}>
                    <DiscountCard item={item} />
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </>
  );
};

export default StoreManager;
