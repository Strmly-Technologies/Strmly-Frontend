"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema } from "@/lib/schemas/authSchemas";
import { FaGoogle } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      // Login API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Update the auth store with user data and token
      useAuthStore.getState().login(data.token);
      useAuthStore.getState().setUser(data.user);

      toast.success("Login successful", {duration: 700});
      setTimeout(()=>{
          if(data?.user?.isOnboarded){
          router.push("/");
        }
        router.push("/onboarding");
      }, 700)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-20 mt-10 px-6">
      <div className="w-full max-w-md space-y-16 rounded-lg">
        <div className="flex items-center text-white justify-center">
          <h1 className="text-xl text-center font-poppins">
            Login to Strmly
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input className="h-12 rounded-lg" placeholder="username or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input className="h-12 rounded-lg" type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="flex gap-2 items-center w-full text-card bg-primary"
            >
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </Form>

        <div className="relative">
            <hr className="w-full"/>
            <div className="absolute -bottom-3 left-[47%] bg-[#1A1A1A] px-1 rounded-full">
                <span className="tracking-wider">OR</span>
            </div>
        </div>

        {/* Sign in with Google */}
        {/* <div className="flex flex-col gap-5">
            <button type="button" className="w-full flex items-center justify-center gap-2">
                <div className="">
                    <Image src={'/google.png'} alt="google-icon" width={30} height={30} className="size-6"/>
                </div>
                <h2 className="text-muted-foreground">Log in with Google</h2>
            </button>

            <div className="flex justify-center w-full items-center">
                <Link href="/forgot-password" className="text-sm font-semibold hover:underline">
                    Forgot password?
                </Link>
            </div>
        </div> */}

      </div>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-[#F1C40F] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}