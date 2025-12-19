import Image from "next/image";
import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { IoTimeOutline } from "react-icons/io5";
import Timer from "./Timer";
import { GetStoreDetailResponse } from "@/redux/features/store/types";
import { capitalizeName } from "./utils";


interface DealsBannerProps {
  store: GetStoreDetailResponse,
  name: string,
  endDate: string,
}


const DealsBanner: React.FC<DealsBannerProps> = ({ store, name, endDate }) => {
  return (
    <>
      <div className="p-4 shadow-sm rounded-md bg-card">
        <div className=" space-y-4 md:flex items-center gap-4">
          <div className="flex gap-4">
            <Image
              src={store.logo}
              alt={store.name}
              className="h-14  w-14 rounded-full object-cover border"
              height={48}
              width={48}
            />
            <div className="md:hidden">
              <h2 className="text-xl font-semibold">
                {capitalizeName(store.name)}
              </h2>
              <p className="flex items-center gap-1">
                <MapPin height={14} width={14} />
                {capitalizeName(store.address)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold hidden md:flex">
              {capitalizeName(store.name)}
            </h2>
            <div className="flex flex-wrap gap-2  items-center md:gap-4 text-sm opacity-70">
              <p className="items-center gap-1 hidden md:flex">
                <MapPin height={14} width={14} className="text-primary" />
                {capitalizeName(store.address)}
              </p>
              <p className="flex items-center gap-1">
                <Phone height={14} width={14} className="text-primary" />
                {store.phone}
              </p>
              <p className="flex items-center gap-1">
                <Mail height={14} width={14} className="text-primary" />
                {store.email}
              </p>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="space-y-3 md:flex items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
            {capitalizeName(name)}
          </h2>
          {endDate ? (
            <div className="flex items-center justify-between">
              <Timer key={endDate} date={endDate} />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-100 w-fit rounded-sm py-1 px-2">
              <IoTimeOutline className="text-lg" />
              <p>Expired</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DealsBanner;
