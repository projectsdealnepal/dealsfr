"use client";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import {
  createBanner,
  getBanner,
  updateBanner,
} from "@/redux/features/banner/banner";
import {
  clearBannerCreateState,
  clearBannerUpdateState,
} from "@/redux/features/banner/bannerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Check,
  Eye,
  FileImage,
  Image,
  Monitor,
  Smartphone,
  Upload,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const CreateBannerPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams.get("id");
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const webFileInputRef = useRef<HTMLInputElement>(null);

  const {
    bannerStateLoading,
    bannerCreateData,
    bannerCreateError,
    bannerData,
    bannerUpdateData,
    bannerUpdateError,
  } = useAppSelector((state) => state.banner);
  const { storeDetailData } = useAppSelector((s) => s.store);

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

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    mode: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mode === "mobile") {
        setMobBannerImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setMobilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      if (mode === "web") {
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
    if (
      !bannerName ||
      (!webBannerImage && !webPreview) ||
      (!mobBannerImage && !mobilePreview) ||
      !storeDetailData
    ) {
      toast.warning("Please fill all fields.", { richColors: true });
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
        await dispatch(
          updateBanner({
            payload: formData,
            s_id: storeDetailData.id,
            b_id: bannerId,
          })
        );
      } else {
        await dispatch(
          createBanner({ payload: formData, s_id: storeDetailData.id })
        );
      }
      router.replace("/dashboard/banner");
    } catch (err) {
      toast.error(bannerCreateError || "Something went wrong.", {
        richColors: true,
      });
    }
  };

  useEffect(() => {
    if (bannerCreateData) {
      toast.success("Banner created successfully!", { richColors: true });
    }
    if (bannerCreateError) {
      toast.error(bannerCreateError || "Something went wrong.", {
        richColors: true,
      });
    }

    if (bannerUpdateData) {
      toast.success("Banner updated successfully!", { richColors: true });
    }
    if (bannerUpdateError) {
      toast.error(bannerUpdateError || "Something went wrong.", {
        richColors: true,
      });
    }

    return () => {
      dispatch(clearBannerCreateState());
      dispatch(clearBannerUpdateState());
    };
  }, [
    bannerCreateError,
    bannerCreateData,
    bannerUpdateData,
    bannerUpdateError,
  ]);

  const clearImage = (type: "mobile" | "web") => {
    if (type === "mobile") {
      setMobBannerImage(null);
      setMobilePreview(null);
    } else {
      setWebBannerImage(null);
      setWebPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {bannerId ? "Edit Banner" : "Create New Banner"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              {bannerId
                ? "Update your promotional banner"
                : "Design promotional banners for web and mobile platforms"}
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">
                    Banner Configuration
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Upload images optimized for different devices and platforms
                  </CardDescription>
                </div>
              </div>
              <Separator />
            </CardHeader>

            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Banner Name Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="w-1 h-4 bg-primary rounded-full" />
                    BANNER DETAILS
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bannerName"
                      className="text-base font-medium"
                    >
                      Banner Name
                    </Label>
                    <Input
                      id="bannerName"
                      value={bannerName}
                      onChange={(e) => setBannerName(e.target.value)}
                      placeholder="Enter a descriptive banner name"
                      className="h-12 bg-background/50"
                    />
                  </div>
                </div>

                <Separator />

                {/* Image Upload Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileImage className="w-4 h-4" />
                    IMAGE UPLOADS
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mobile Banner */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-orange-500" />
                        <Label className="text-base font-medium">
                          Mobile Banner
                        </Label>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                        >
                          Mobile
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            id="mobBannerImage"
                            type="file"
                            accept="image/*"
                            ref={mobileFileInputRef}
                            onChange={(e) => handleImageChange(e, "mobile")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />

                          <div className="flex items-center justify-center rounded-md bg-background text-sm text-muted-foreground">
                            {mobBannerImage?.name}
                          </div>
                        </div>

                        {mobilePreview && (
                          <div className="relative group">
                            <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Preview
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => clearImage("mobile")}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <img
                                src={mobilePreview}
                                alt="Mobile Banner Preview"
                                className="w-full max-w-[250px] rounded-md shadow-sm border"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Uploaded
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {!mobilePreview && (
                          <div
                            onClick={() => mobileFileInputRef.current?.click()}
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-8 h-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Upload mobile banner image
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                PNG, JPG up to 5MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Web Banner */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-500" />
                        <Label className="text-base font-medium">
                          Website Banner
                        </Label>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        >
                          Desktop
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            id="webBannerImage"
                            type="file"
                            accept="image/*"
                            ref={webFileInputRef}
                            onChange={(e) => handleImageChange(e, "web")}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="flex items-center justify-center rounded-md bg-background text-sm text-muted-foreground">
                            {webBannerImage?.name}
                          </div>
                        </div>

                        {webPreview && (
                          <div className="relative group">
                            <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    Preview
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => clearImage("web")}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <img
                                src={webPreview}
                                alt="Web Banner Preview"
                                className="w-full max-w-[350px] rounded-md shadow-sm border"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Uploaded
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        {!webPreview && (
                          <div
                            onClick={() => webFileInputRef.current?.click()}
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="w-8 h-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Upload website banner image
                              </p>
                              <p className="text-xs text-muted-foreground/70">
                                PNG, JPG up to 5MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={bannerStateLoading}
                    size="lg"
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bannerStateLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {bannerId ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>
                          {bannerId ? "Update Banner" : "Create Banner"}
                        </span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBannerPage;
