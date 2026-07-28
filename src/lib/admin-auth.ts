import { NextResponse } from "next/server";

export function getAdminSecret() {
  return process.env.ADMIN_SECRET || "smart-admin-2026";
}

export function isAdminAuthorized(req: Request) {
  const key = getAdminSecret();
  const header = req.headers.get("x-admin-secret");
  const cookie = req.headers.get("cookie") || "";
  return (
    header === key ||
    cookie.includes(`scw_admin=${encodeURIComponent(key)}`) ||
    cookie.includes(`scw_admin=${key}`)
  );
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
