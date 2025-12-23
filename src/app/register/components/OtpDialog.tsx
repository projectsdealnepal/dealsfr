"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { toast } from "sonner";

interface OtpDialogProps {
  open: boolean;
  onSuccess: () => void;
  email: string;
  onOpenChange: (open: boolean) => void;
}

const OtpDialog = ({
  open,
  onSuccess,
  onOpenChange,
  email,
}: OtpDialogProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(120);

  const Timer = () => {

    useEffect(() => {
      if (seconds > 0) {
        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [seconds]);

    return (
      <span className="text-sm text-muted-foreground">
        {seconds > 0
          ? `Resend OTP in ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
          : "You can now resend the OTP"}
      </span>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      const url = process.env.NEXT_PUBLIC_API_BASE_URL;
      await api.post(`${url}accounts/verify-account/`, {
        email,
        otp,
      });

      toast.success("OTP verified successfully");
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || "Failed to verify OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      const url = process.env.NEXT_PUBLIC_API_BASE_URL;

      await api.post(`${url}accounts/resend-otp/`, { email });
      toast.success("OTP resent successfully");
      setSeconds(120)
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Account Verification</DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit OTP sent to <b>{email}</b>
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One Time Password</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full"
                disabled={loading || seconds > 0}
                onClick={resendOtp}
              >
                <Timer />
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
