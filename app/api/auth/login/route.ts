// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

// Type definitions
type LoginRequest = {
  identifier: string; // Can be email or username
  password: string;
};

type LoginSuccessResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type BackendErrorResponse = {
  message: string;
  error?: string;
  statusCode?: number;
};

type NextApiError = Error & {
  statusCode?: number;
};

export async function POST(req: Request) {
  try {
    const { identifier, password }: LoginRequest = await req.json();

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json<BackendErrorResponse>(
        { message: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Determine if identifier is email or username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(identifier);
    const loginPayload = isEmail
      ? { email: identifier, password }
      : { username: identifier, password };

    // Call your Node.js backend
    const { data } = await axios.post<LoginSuccessResponse | BackendErrorResponse>(
      `${process.env.BACKEND_URL}/auth/login/${isEmail ? 'email' : 'username'}`,
      {...loginPayload},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      }
    );

    // Check for error in response
    if ('error' in data || !('token' in data)) {
      return NextResponse.json<BackendErrorResponse>(
        {
          message: data.message || 'Authentication failed',
          error: 'error' in data ? data.error : undefined,
        },
        { status: 400 }
      );
    }

    // Successful response
    // Store token in HttpOnly cookie
    cookies().set({
      name: 'token',
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days token expiration
    });

    // Return user data without the token in the response body
    //const { token, ...userData } = data;
    return NextResponse.json<Omit<LoginSuccessResponse, 'token'>>(
      data,
      { status: 200 }
    );

  } catch (err: unknown) {
    console.error('❌ Login error:', err);
    
    // Handle Axios errors (connection to backend)
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<BackendErrorResponse>;
      const status = axiosError.response?.status || 500;
      const errorMessage = axiosError.response?.data?.message || 
                         axiosError.message || 
                         'Backend request failed';
      
      return NextResponse.json<BackendErrorResponse>(
        { message: errorMessage },
        { status }
      );
    }
    
    // Handle generic errors
    if (err instanceof Error) {
      const error = err as NextApiError;
      return NextResponse.json<BackendErrorResponse>(
        { message: error.message },
        { status: error.statusCode || 500 }
      );
    }

    // Fallback for unknown errors
    return NextResponse.json<BackendErrorResponse>(
      { message: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}