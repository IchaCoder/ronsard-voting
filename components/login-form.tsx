"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Schema for PIN-based login
const loginSchema = z.object({
  pin: z.string().min(5, "PIN must be at least 5 characters").max(10, "PIN must be at most 10 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      // Here you would implement the PIN authentication logic
      console.log("Student login with PIN:", { pin: data.pin });
      // search for user by PIN
      const { data: user, error } = await supabase.from("users").select("*").eq("pin", data.pin).single();
      console.log("User data:", user);

      if (error) {
        toast({
          title: "Login Failed",
          description: "Invalid PIN. Please try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Login Successful",
        description: "Welcome to the voting portal",
      });

      // Redirect to voting page
      router.push("/vote?pin=" + data.pin);
    } catch (err) {
      setError("Login failed. Please check your PIN and try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Enter your PIN to access the Ecole Ronsard voting portal</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="pin">Unique PIN</Label>
            <Input
              id="pin"
              type="text"
              placeholder="Enter your unique PIN"
              {...register("pin")}
              className={errors.pin ? "border-red-500" : ""}
            />
            {errors.pin && <p className="text-sm text-red-500">{errors.pin.message}</p>}
            <p className="text-xs text-gray-500">Enter the unique PIN provided by your teacher</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
