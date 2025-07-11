import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

type SignupRequest = {
  email: string;
  password: string;
};

type AuthResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type ErrorResponse = {
  error: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const { email, password }: SignupRequest = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<ErrorResponse>(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Call registration endpoint
    const { data } = await axios.post<AuthResponse | ErrorResponse>(
      `${process.env.BACKEND_URL}/auth/register`,
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
        validateStatus: (status) => status < 500,
      }
    );

    // Handle error responses
    if ("error" in data) {
      return NextResponse.json<ErrorResponse>(
        { error: data.error, message: data.message },
        { status: 400 }
      );
    }

    // Set HTTP-only cookie with the token
    cookies().set({
      name: "token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json<Omit<AuthResponse, "token">>(data, {
      status: 200,
    });
    
  } catch (err) {
    console.error("❌ Signup error:", err);

    // if (axios.isAxiosError(err)) {
    //   const status = err.response?.status || 500;
    //   const errorMessage =
    //     err.response?.data?.message || err.message || "Registration failed";

    //   return NextResponse.json<ErrorResponse>(
    //     { error: errorMessage },
    //     { status }
    //   );
    // }

    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
