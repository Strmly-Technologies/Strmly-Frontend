export const dynamic = "force-dynamic";

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication token is required' },
        { status: 401 }
      );
    }

    // Get the FormData from the request
    const formData = await req.formData();

    // Make the request to your backend
    const backendResponse = await axios.put(
      `${process.env.BACKEND_URL}/user/profile`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      }
    );

    return NextResponse.json(backendResponse.data);

  } catch (error) {
    console.error('Onboarding error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          message: error.response?.data?.message || 'Backend request failed',
          details: error.response?.data 
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}