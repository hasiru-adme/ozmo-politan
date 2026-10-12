import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isFormSubmit = req.headers.get("content-type")?.includes("form");

  const response = isFormSubmit
    ? NextResponse.redirect(new URL("/login", req.url))
    : NextResponse.json({ success: true });

  response.cookies.delete("session");
  return response;
}