import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized, unauthorized } from "@/lib/admin-auth";
import { getLoyaltySettings, updateLoyaltySettings } from "@/lib/loyalty";

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const settings = await getLoyaltySettings();
    return NextResponse.json({ settings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare setări" }, { status: 500 });
  }
}

const schema = z.object({
  visitsRequired: z.number().int().min(1).max(50),
  rewardType: z.enum(["free_wash", "free_service", "custom"]),
  rewardServiceId: z.enum(["express", "complet", "detail"]).nullable(),
  rewardLabel: z.string().min(2),
  enabled: z.boolean(),
});

export async function PUT(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    const settings = await updateLoyaltySettings(parsed.data);
    return NextResponse.json({ settings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare salvare" }, { status: 500 });
  }
}
