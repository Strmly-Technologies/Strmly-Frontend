export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import axios from 'axios';

interface Follower {
  _id: string;
  username: string;
  profile_photo: string;
}

interface FollowersResponse {
  message: string;
  followers: Follower[];
  count: number;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    console.log("na",token)

    if (!token) {
      return NextResponse.json({ message: 'Token required' }, { status: 401 });
    }

    const backendRes = await axios.get<FollowersResponse>(
      `${process.env.BACKEND_URL}/user/followers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("backend",backendRes)

    return NextResponse.json({
      status: 'success',
      data: backendRes.data?.followers,
    });
  } catch (error) {
    console.error('Followers fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch followers' },
      { status: 500 }
    );
  }
}
