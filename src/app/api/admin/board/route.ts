import { NextResponse } from "next/server";
import { z } from "zod";
import { listTodayBoard, updateBookingStatus } from "@/lib/store";

function authorized(req: Request) {
  const key = process.env.ADMIN_SECRET || "smart-admin-2026";
  const header = req.headers.get("x-admin-secret");
  const cookie = req.headers.get("cookie") || "";
  return header === key || cookie.includes(`scw_admin=${key}`);
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const board = await listTodayBoard();
    return NextResponse.json({ board });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare board" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "checked_in",
    "washing",
    "ready",
    "completed",
    "cancelled",
    "no_show",
  ]),
});

export async function PATCH(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    const updated = await updateBookingStatus(parsed.data.id, parsed.data.status);
    return NextResponse.json({ booking: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare update" }, { status: 500 });
  }
}
