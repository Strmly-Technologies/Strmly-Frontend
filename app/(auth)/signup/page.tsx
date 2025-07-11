"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signupSchema } from "@/lib/schemas/authSchemas";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { ApiError } from "next/dist/server/api-utils";
import { Loader2Icon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.email)) {
        throw new Error("Invalid email format");
      }

      // Validate password strength
      if (values.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.message === "string" ? data.message : "Signup failed"
        );
      }

      toast.success("Account created successfully");
      // Update the auth store with user data and token
      useAuthStore.getState().login(data.token);
      useAuthStore.getState().setUser(data.user);

      setTimeout(() => {
        router.push("/onboarding");
      }, 510);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col mt-10 px-6 space-y-20">
      <div className="w-full max-w-sm space-y-16 rounded-lg">
        <div className="flex items-center text-white justify-center">
          <h1 className="text-xl flex flex-col text-center font-poppins">
            Create account to <span className="">Strmly</span>
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-card font-poppins bg-[#F1C40F]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2Icon className="size-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <hr className="w-full" />
          <div className="absolute -bottom-3 left-[47%] bg-[#1A1A1A] px-1 rounded-full">
            <span className="tracking-wider">OR</span>
          </div>
        </div>

        {/* Google Signup */}
        {/* <div className="flex flex-col gap-5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2"
          >
            <div className="">
              <Image src={'/google.png'} alt="google-icon" width={30} height={30} className="size-6 text-red-500" />
            </div>
            <h2 className="text-muted-foreground">Signup with Google</h2>
          </button>
        </div> */}
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#F1C40F] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
