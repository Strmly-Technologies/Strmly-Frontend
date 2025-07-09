export const dynamic = "force-dynamic";

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 401 }
      );
    }


    // Forward the entire FormData to your backend
    const formData = await req.formData();
    
    const backendResponse = await axios.post(`${process.env.BACKEND_URL}/videos/upload`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: {...formData},
    });

    return NextResponse.json(backendResponse.data);

  } catch (error) {
    console.error('Profile fetch error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Backend request failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}