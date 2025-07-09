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

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
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

      toast.success("Login successful");
      // router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }

  return (
    <div className="flex mt-16 justify-center">
      <div className="w-full max-w-md p-8 space-y-10 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif text-primary">Strmly</h1>
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

            <Button type="submit" className="w-full bg-[#F1C40F]">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="relative">
            <hr className="w-full"/>
            <div className="absolute -bottom-5 left-[45%] bg-white p-2 text-black rounded-full">
                <span className="tracking-wider">OR</span>
            </div>
        </div>

        <div className="flex flex-col gap-5">
            <button type="button" className="w-full flex items-center justify-center gap-2">
                <div className="p-1 rounded-full">
                    <FaGoogle className="size-4 text-red-400"/>
                </div>
                <h2 className="text-red-500">Log in with Google</h2>
            </button>

            <div className="flex justify-center w-full items-center">
                <Link href="/forgot-password" className="text-sm font-semibold hover:underline">
                    Forgot password?
                </Link>
            </div>
        </div>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-[#F1C40F] hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}