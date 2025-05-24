"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Schema for secondary students
const secondarySchema = z.object({
  studentType: z.literal("secondary"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Schema for primary students
const primarySchema = z.object({
  studentType: z.literal("primary"),
  pin: z.string().min(4, "PIN must be at least 4 characters").max(10, "PIN must be at most 10 characters"),
});

// Combined schema
const loginSchema = z.discriminatedUnion("studentType", [secondarySchema, primarySchema]);

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [studentType, setStudentType] = useState<"primary" | "secondary">("secondary");
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      studentType: "secondary",
    },
  });

  const handleStudentTypeChange = (value: "primary" | "secondary") => {
    setStudentType(value);
    setValue("studentType", value);
    setError(null);
    // Reset form when switching types
    if (value === "primary") {
      reset({ studentType: "primary", pin: "" });
    } else {
      reset({ studentType: "secondary", email: "", password: "" });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    console.log("Form submitted with data:", data);

    try {
      if (data.studentType === "secondary") {
        let { data: userData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });

          return;
        }

        toast({
          title: "Login Successful",
          description: `Welcome ${userData.user?.email}`,
        });

        const isPasswordChanged = userData.user?.user_metadata?.isDefaultPasswordChanged === true;
        if (!isPasswordChanged) {
          router.push("/forgot-password");
          return;
        }

        router.push("/vote");
      } else {
        console.log("Primary student login:", { pin: data.pin });
      }

      // Handle successful login here
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access the Ecole Ronsard voting portal</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="studentType">I am signing in as</Label>
            <Select value={studentType} onValueChange={handleStudentTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select student type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary Student</SelectItem>
                <SelectItem value="primary">Primary Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {studentType === "secondary" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={"email" in errors && errors.email ? "border-red-500" : ""}
                />
                {"email" in errors && errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={"password" in errors && errors.password ? "border-red-500" : ""}
                />
                {"password" in errors && errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="pin">Unique PIN</Label>
              <Input
                id="pin"
                type="text"
                placeholder="Enter your unique PIN"
                {...register("pin")}
                className={"pin" in errors && errors.pin ? "border-red-500" : ""}
              />
              {"pin" in errors && errors.pin && <p className="text-sm text-red-500">{errors.pin.message}</p>}
              <p className="text-xs text-gray-500">Enter the unique PIN provided by your teacher</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          {/* {studentType === "secondary" && (
            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 underline">
                Forgot your password?
              </Link>
            </div>
          )} */}
        </CardFooter>
      </form>
    </Card>
  );
}
