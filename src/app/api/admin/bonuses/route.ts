import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized, unauthorized } from "@/lib/admin-auth";
import {
  cancelBonus,
  listBonuses,
  redeemBonus,
} from "@/lib/loyalty";

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const status = new URL(req.url).searchParams.get("status") as
      | "available"
      | "redeemed"
      | "expired"
      | "cancelled"
      | null;
    const customerId = new URL(req.url).searchParams.get("customerId") || undefined;
    const bonuses = await listBonuses({
      status: status || undefined,
      customerId,
    });
    return NextResponse.json({ bonuses });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare bonusuri" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["redeem", "cancel"]),
  bookingId: z.string().uuid().optional(),
});

export async function PATCH(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    const bonus =
      parsed.data.action === "redeem"
        ? await redeemBonus(parsed.data.id, parsed.data.bookingId)
        : await cancelBonus(parsed.data.id);
    if (!bonus) {
      return NextResponse.json(
        { error: "Bonus indisponibil sau expirat" },
        { status: 409 },
      );
    }
    return NextResponse.json({ bonus });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare update bonus" }, { status: 500 });
  }
}
