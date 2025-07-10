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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.message === 'string' ? data.message : "Signup failed"
        );
      }

      toast.success("Account created successfully");
      // Update the auth store with user data and token
      useAuthStore.getState().login(data.token);
      useAuthStore.getState().setUser(data.user);

      toast.success("Signup Successful successful");

      setTimeout(()=> {
        router.push("/onboarding");
      }, 500);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "An unknown error occurred during signup"
      );
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex mt-32 justify-center">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg">
      <div className="flex items-center justify-center">
        <h1 className="text-3xl text-[#F1C40F] font-bold font-serif [text-shadow:_0_5px_8px_var(--tw-shadow-color)] shadow-[#F1C40F]">
          Strmly
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

            <Button type="submit" disabled={isLoading} className="w-full text-black hover:shadow-md hover:shadow-[#F1C40F] bg-[#F1C40F]">
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
          <div className="absolute -bottom-5 left-[45%] p-2 rounded-full">
            <span className="tracking-wider">OR</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2"
          >
            <div className="">
              <Image src={'/google.png'} alt="google-icon" width={30} height={30} className="size-6 text-red-500" />
            </div>
            <h2 className="text-muted-foreground">Signup with Google</h2>
          </button>
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
    </div>
  );
}
