import { NextResponse } from "next/server";
import { generateSlotsForDay } from "@/lib/booking";
import { getActiveForSlots } from "@/lib/store";
import type { PackageId } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day");
  const serviceId = (searchParams.get("serviceId") || "complet") as PackageId;

  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ error: "Parametru day invalid" }, { status: 400 });
  }

  try {
    const existing = await getActiveForSlots(day);
    const slots = generateSlotsForDay(day, existing, serviceId);
    return NextResponse.json({ slots });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Nu pot încărca sloturile" }, { status: 500 });
  }
}
