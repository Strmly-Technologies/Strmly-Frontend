import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

// Type definitions
type Community = {
  _id: string;
  name: string;
  bio?: string;
  profile_photo: string;
  creators?: any[];
  followers?: any[]
};

type CommunityResponse = {
  message: string;
  communities: Community[];
};

type BackendErrorResponse = {
  message: string;
  error?: string;
  statusCode?: number;
};

type NextApiError = Error & {
  statusCode?: number;
};

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    console.log('toe',token)

    if (!token) {
      return NextResponse.json<BackendErrorResponse>(
        { message: 'Unauthorized: No token found' },
        { status: 401 }
      );
    }

    const response = await axios.get<CommunityResponse>(
      'http://localhost:5000/api/v1/community/all',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
        validateStatus: (status) => status < 500,
      }
    );

    console.log('Full backend response:', response.data); // Log complete data

    if (!response.data || !Array.isArray(response.data.communities)) {
      return NextResponse.json<BackendErrorResponse>(
        { message: 'Invalid response structure from backend' },
        { status: 400 }
      );
    }

    return NextResponse.json<CommunityResponse>(response.data, { status: 200 });

  } catch (err: unknown) {
    console.error(' Error during community fetch:', err);

    // if (axios.isAxiosError(err)) {
    //   const axiosErr = err as AxiosError<BackendErrorResponse>;
    //   const status = axiosErr.response?.status || 500;
    //   const backendMsg = axiosErr.response?.data?.message;
    //   const fallbackMsg = axiosErr.message || 'Unexpected Axios error';

    //   console.error(' Axios error response:', axiosErr.response?.data);

    //   return NextResponse.json<BackendErrorResponse>(
    //     { message: backendMsg || fallbackMsg },
    //     { status }
    //   );
    // }

    if (err instanceof Error) {
      return NextResponse.json<BackendErrorResponse>(
        { message: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json<BackendErrorResponse>(
      { message: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
