import React, { useState } from "react";
import { Gift, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PreviewRewardProduct } from "@/redux/features/discount/types";
import { capitalizeName } from "./utils";


export const RewardBadge: React.FC<{ rewards: PreviewRewardProduct[] }> = ({ rewards }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!rewards || rewards.length === 0) return null;

  return (
    <div
      className="flex flex-col items-end"
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }}
    >
      <div
        className={`
          flex items-center gap-2 justify-between border py-2 px-4 rounded-full w-full
          backdrop-blur-md transition-all duration-300 cursor-pointer
          ${isOpen
            ? "bg-background text-secondary-foreground"
            : "bg-background text-primary-foreground"
          }
        `}
      >
        <div className="flex gap-2 ">
          <div className="relative flex items-center justify-center">
            <Gift
              size={16}
              className={isOpen ? "text-sonic-red" : "text-primary/70"}
            />

            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive/70"></span>
            </span>
          </div>

          <span className="text-xs font-semibold opacity-70">
            {isOpen ? "Free Rewards Included" : "Rewards"}
          </span>
        </div>

        {!isOpen && (
          <div className="flex -space-x-2 ml-1">
            {rewards.slice(0, 3).map((reward, id) => (
              <img
                key={id}
                src={reward.store_product.image}
                alt={reward.store_product.name}
                className="w-6 h-6 rounded-full border border-white/50 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={`
          absolute top-full  right-0 mt-2 w-full bg-white rounded-xl shadow-xl z-30
          border border-gray-100 overflow-hidden transform transition-all duration-300 origin-top-right
          ${isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        <div className="bg-gradient-to-r from-red-50 to-white px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-bold text-destructive uppercase tracking-wider">
            Bundle Contents
          </span>
          <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm border">
            Value: Free
          </span>
        </div>

        <div className="p-2 space-y-1">
          {rewards.map((reward, id) => (
            <div
              key={id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <img
                  src={reward.store_product?.image}
                  alt={reward.store_product?.name}
                  className="w-full h-full object-cover rounded-md shadow-sm border border-gray-200 group-hover:border-red-200 transition-colors"
                />
              </div>

              <span className="text-xs font-semibold text-gray-800 truncate">
                {capitalizeName(reward.store_product?.name || " ")}
              </span>

              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-gray-50 text-[10px] text-gray-500 text-center border-t border-gray-100">
          Automatically get applied
        </div>
      </div>
    </div>
  );
};
