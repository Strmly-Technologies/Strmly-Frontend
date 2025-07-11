export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';

interface VideoData {
  type: 'video' | 'series';
  duration: number;
  [key: string]: any;
}

interface BackendResponse {
  results: {
    videos?: VideoData[];
    all?: VideoData[];
  };
}

export async function GET(req: Request) {
  try {
        const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    console.log("sb",token)

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 401 }
      );
    }

    // Fetch from backend
    const backendRes = await axios.get<BackendResponse>(
      `${process.env.BACKEND_URL}/search/personalized?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const backendData = backendRes.data || {};
    // const personalized = backendData.videos || [];
    // const all = backendData.all || [];
    console.log("resb",backendData)

    // console.log("res",personalized)

    // Split long/short videos from personalized
    // const personalizedVideo = personalized.filter(
    //   (item) => item.type === 'video' && item.duration > 300
    // );
    // const personalizedSeries = personalized.filter(
    //   (item) => item.type === 'video' && item.duration <= 300
    // );

    // Split all videos into long and series
    // const long = all.filter(
    //   (item) => item.type === 'video' && item.duration > 300
    // );
    // const series = all.filter((item) => item.type === 'series');

    return NextResponse.json({
      status: 'success',
      data: {
        personalized: {
          // video: personalizedVideo,
          // series: personalizedSeries,
          backendData
        },
      },
    });
  } catch (error) {
    console.error('Search fetch error:', error);

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
