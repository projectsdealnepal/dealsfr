"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBanner, getBanner, updateBanner } from "@/redux/features/banner/banner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const CreateBannerPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams.get("id");

  const { bannerStateLoading, bannerCreateError, bannerData } = useAppSelector((state) => state.banner);
  const { storeDetailData } = useAppSelector(s => s.store)

  const [bannerName, setBannerName] = useState<string>("");
  const [webBannerImage, setWebBannerImage] = useState<File | null>(null);
  const [mobBannerImage, setMobBannerImage] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [webPreview, setWebPreview] = useState<string | null>(null);

  useEffect(() => {
    if (bannerId && bannerData) {
      const banner = bannerData.find((b) => b.id === parseInt(bannerId));
      if (banner) {
        setBannerName(banner.name);
        setWebPreview(banner.web_image);
        setMobilePreview(banner.mobile_image);
      }
    }
  }, [bannerId, bannerData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, mode: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mode === 'mobile') {
        setMobBannerImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setMobilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      if (mode === 'web') {
        setWebBannerImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setWebPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bannerName || (!webBannerImage && !webPreview) || (!mobBannerImage && !mobilePreview) || !storeDetailData) {
      toast.warning("Please fill all fields.", { richColors: true })
      return;
    }

    const formData = new FormData();
    formData.append("name", bannerName);
    if (webBannerImage) {
      formData.append("web_image", webBannerImage);
    }
    if (mobBannerImage) {
      formData.append("mobile_image", mobBannerImage);
    }

    try {
      if (bannerId) {
        // @ts-ignore
        await dispatch(updateBanner({ payload: formData, s_id: storeDetailData.id, b_id: bannerId }));
        toast.success("Banner updated successfully!", { richColors: true });
      } else {
        await dispatch(createBanner({ payload: formData, s_id: storeDetailData.id }));
        toast.success("Banner created successfully!", { richColors: true });
      }
      router.push("/dashboard/banner");
    } catch (err) {
      toast.error(bannerCreateError || "Something went wrong.", { richColors: true })
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
        <CardHeader>
          <CardTitle>{bannerId ? "Edit Banner" : "Create New Banner"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bannerName" className="text-[var(--muted-foreground)]">
                Banner Name
              </Label>
              <Input
                id="bannerName"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="Enter banner name"
                className="bg-[var(--input)] text-[var(--foreground)] border-[var(--border)] focus:ring-[var(--ring)]"
              />
            </div>
            <div>
              <Label htmlFor="mobBannerImage" className="text-[var(--muted-foreground)]">
                Mobile Banner Image
              </Label>
              <Input
                id="mobBannerImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'mobile')}
                className="bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]"
              />
            </div>
            {mobilePreview && (
              <div className="mt-4">
                <img src={mobilePreview} alt="Banner Preview" className="max-w-xs rounded-md" />
              </div>
            )}

            <div>
              <Label htmlFor="webBannerImage" className="text-[var(--muted-foreground)]">
                Website Banner Image
              </Label>
              <Input
                id="webBannerImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'web')}
                className="bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]"
              />
            </div>
            {webPreview && (
              <div className="mt-4">
                <img src={webPreview} alt="Banner Preview" className="max-w-xs rounded-md" />
              </div>
            )}
            <Button
              type="submit"
              disabled={bannerStateLoading}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)]"
            >
              {bannerStateLoading ? "Saving..." : (bannerId ? "Update Banner" : "Save Banner")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBannerPage;
