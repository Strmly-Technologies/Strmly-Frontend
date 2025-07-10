export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ message: "Community ID is required" }, { status: 400 });
    }

    const backendUrl = `${process.env.BACKEND_URL}/community/${id}/videos`;
    const urlWithQuery = type ? `${backendUrl}?type=${type}` : backendUrl;

    const backendResponse = await axios.get(urlWithQuery, {
      headers: { Authorization: `Bearer ${token}` },
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

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

