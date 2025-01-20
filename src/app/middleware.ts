import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any): Promise<NextResponse<unknown>> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/page/signin", req.url));
  }

  // ตัวอย่างการตรวจสอบ role
  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}
