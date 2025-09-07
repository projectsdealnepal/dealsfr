"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BannerItem } from "@/redux/features/banner/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BannerCardProps {
  banner: BannerItem;
  onDelete: (id: number) => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({ banner, onDelete }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/banner/create?id=${banner.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{banner.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full">
          <Image src={banner.web_image} alt={banner.name} layout="fill" objectFit="cover" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleEdit}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(banner.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};
