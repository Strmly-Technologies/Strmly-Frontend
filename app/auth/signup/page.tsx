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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { signupSchema } from "@/lib/authSchemas";
import { FaGoogle } from "react-icons/fa";

export default function SignupPage() {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profilePhoto", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (values.profilePhoto) {
        formData.append("profilePhoto", values.profilePhoto);
      }

      //   const response = await fetch("/api/auth/signup", {
      //     method: "POST",
      //     body: formData,
      //   });

      //   const data = await response.json();

      //   if (!response.ok) {
      //     throw new Error(data.message || "Signup failed");
      //   }

      toast.success("Account created successfully");
      //   router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif text-primary">Strmly</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                {previewImage ? (
                  <AvatarImage src={previewImage} alt="Preview" />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {form.watch("username")?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <FormField
                control={form.control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cursor-pointer">
                      <Button variant="outline" type="button">
                        Upload Photo
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </Form>

        <div className="relative">
          <hr className="w-72 ml-8" />
          <div className="absolute -bottom-5 left-[45%] bg-white p-2 text-black rounded-full">
            <span className="tracking-wider">OR</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2"
          >
            <div className="p-1 rounded-full">
              <FaGoogle className="size-4 text-red-400" />
            </div>
            <h2 className="text-red-500">Log in with Google</h2>
          </button>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
