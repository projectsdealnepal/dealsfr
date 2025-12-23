"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

// Step 1: Schema for requesting OTP
const requestOtpSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required"),
});

// Step 2: Schema for verifying OTP
const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Step 3: Schema for resetting password
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step = 1 | 2 | 3;

export function ForgotPasswordDialog({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Store data between steps
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [resetToken, setResetToken] = useState("");

  const requestOtpForm = useForm<z.infer<typeof requestOtpSchema>>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { emailOrPhone: "" },
  });

  const verifyOtpForm = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleRequestOtp = async (values: z.infer<typeof requestOtpSchema>) => {
    setIsLoading(true);
    try {
      // Determine if the input is an email or a phone number
      const isEmail = values.emailOrPhone.includes('@');
      const payload = isEmail
        ? { email: values.emailOrPhone }
        : { phone_number: values.emailOrPhone };

      await api.post("accounts/forgot-password/", payload);
      toast.success("OTP has been sent to your registered email or phone.");
      setEmailOrPhone(values.emailOrPhone);
      setStep(2);
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Failed to send OTP. Please check the email/phone and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (values: z.infer<typeof verifyOtpSchema>) => {
    setIsLoading(true);
    try {
      const isEmail = emailOrPhone.includes('@');
      const payload = {
        otp: values.otp,
        ...(isEmail ? { email: emailOrPhone } : { phone_number: emailOrPhone })
      };

      const response = await api.post("accounts/verify-reset-otp/", payload);
      const { reset_token } = response.data;

      if (!reset_token) {
        throw new Error("Reset token not found in response.");
      }

      setResetToken(reset_token);
      toast.success("OTP verified successfully.");
      setStep(3);
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      await api.post("accounts/reset-password/", {
        reset_token: resetToken,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      });
      toast.success("Password has been reset successfully! Please log in.");
      resetForms();
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("Failed to reset password. The reset token may have expired. Please try again.");
      resetForms(); // Reset and go back to step 1
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    requestOtpForm.reset();
    verifyOtpForm.reset();
    resetPasswordForm.reset();
    setStep(1);
    setEmailOrPhone("");
    setResetToken("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForms();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild >{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Forgot Password</DialogTitle>
              <DialogDescription>
                Enter your email or phone number to receive a one-time password (OTP).
              </DialogDescription>
            </DialogHeader>
            <Form {...requestOtpForm}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormField
                  control={requestOtpForm.control}
                  name="emailOrPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., user@example.com or 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={requestOtpForm.handleSubmit(handleRequestOtp)} className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to {emailOrPhone}.
              </DialogDescription>
            </DialogHeader>
            <Form {...verifyOtpForm}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormField
                  control={verifyOtpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <Input placeholder="_ _ _ _ _ _" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={verifyOtpForm.handleSubmit(handleVerifyOtp)} className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </Form>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Create a new password for your account.
              </DialogDescription>
            </DialogHeader>
            <Form {...resetPasswordForm}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormField
                  control={resetPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={resetPasswordForm.handleSubmit(handleResetPassword)} className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
