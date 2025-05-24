"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";

const forgotPasswordSchema = z
  .object({
    newPassword: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordFormProps = {
  user: User | null;
};

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const { user } = props;

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const supabase = createClient();
  const { toast } = useToast();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);

    try {
      const { data: userData, error } = await supabase.auth.updateUser({
        password: data.newPassword,
        data: {
          isDefaultPasswordChanged: true, // Mark that the default password has been changed
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Try a different password",
          variant: "destructive",
        });
        return;
      }

      // router.push("/login");
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please check your current password and try again.");
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Password Updated Successfully!</h3>
            <p className="text-sm text-gray-600">
              Your Ecole Ronsard account password has been updated successfully. You can now use your new password to
              sign in.
            </p>
            <Link href="/login">
              <Button className="w-full mt-4">Return to Login</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>
          Update your Ecole Ronsard password for <span className="font-bold">{user?.email}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword")}
              className={errors.newPassword ? "border-red-500" : ""}
            />
            {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
