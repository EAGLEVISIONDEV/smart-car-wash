import { NextResponse } from "next/server";
import { z } from "zod";
import {
  advanceBookingStatus,
  createWalkIn,
  getBoardPayload,
  updateBookingStatus,
} from "@/lib/store";
import { isValidRoPlate } from "@/lib/plates";
import { isAdminAuthorized, unauthorized } from "@/lib/admin-auth";

function todayLocal() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const day =
      new URL(req.url).searchParams.get("day") || todayLocal();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return NextResponse.json({ error: "Zi invalidă" }, { status: 400 });
    }
    const payload = await getBoardPayload(day);
    return NextResponse.json({
      ...payload,
      serverTime: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare board" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "checked_in",
      "washing",
      "ready",
      "completed",
      "cancelled",
      "no_show",
    ])
    .optional(),
  advance: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    const { id, status, advance } = parsed.data;
    const updated = advance
      ? await advanceBookingStatus(id)
      : status
        ? await updateBookingStatus(id, status)
        : null;
    if (!updated) {
      return NextResponse.json({ error: "Negăsit" }, { status: 404 });
    }
    return NextResponse.json({ booking: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare update" }, { status: 500 });
  }
}

const walkInSchema = z.object({
  plate: z.string().min(5),
  phone: z.string().min(10),
  name: z.string().optional(),
  serviceId: z.enum(["express", "complet", "detail"]),
  notes: z.string().optional(),
  startNow: z.boolean().optional(),
});

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const parsed = walkInSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    if (!isValidRoPlate(parsed.data.plate)) {
      return NextResponse.json(
        { error: "Număr de înmatriculare invalid" },
        { status: 400 },
      );
    }
    const booking = await createWalkIn(parsed.data);
    return NextResponse.json({ booking });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare walk-in" }, { status: 500 });
  }
}
