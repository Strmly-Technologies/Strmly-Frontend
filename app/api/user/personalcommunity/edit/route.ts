import { NextResponse } from "next/server";
import axios from "axios";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { communityId, name, bio } = await req.json();

    if (!communityId) {
      return NextResponse.json(
        { message: "Community ID is required" },
        { status: 400 }
      );
    }

    const requests = [];

    if (name) {
      requests.push(
        axios.put(
          `${process.env.BACKEND_URL}/community/rename`,
          {
            communityId,
            newName: name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
    }

    if (bio) {
      requests.push(
        axios.put(
          `${process.env.BACKEND_URL}/community/add-bio`,
          {
            communityId,
            bio,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
    }

    if (requests.length === 0) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    const results = await Promise.all(requests);
    const allSuccess = results.every((res) => res.status === 200);

    return NextResponse.json({
      message: allSuccess ? "Update successful" : "Partial success",
      updates: results.map((r) => r.data),
    });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
