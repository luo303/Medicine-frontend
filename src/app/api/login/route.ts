import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.username === "admin" && body.password === "123456") {
    const cookiesStore = await cookies();
    cookiesStore.set("token", "123456", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.json({ code: 1 }, { status: 200 });
  } else {
    return NextResponse.json({ code: 0 }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token");
  if (token && token.value === "123456") {
    return NextResponse.json({ code: 1 }, { status: 200 });
  } else {
    return NextResponse.json({ code: 0 }, { status: 401 });
  }
}
