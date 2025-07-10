export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 401 }
      );
    }

    // Calling backend API with the token
    const backendResponse = await axios.get(
      `${process.env.BACKEND_URL}/user/interactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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