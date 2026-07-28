import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized, unauthorized } from "@/lib/admin-auth";
import {
  getCustomer,
  grantBonus,
  listCustomers,
  upsertCustomer,
} from "@/lib/loyalty";

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  const q = new URL(req.url).searchParams.get("q") || undefined;
  const id = new URL(req.url).searchParams.get("id");
  try {
    if (id) {
      const customer = await getCustomer(id);
      if (!customer) {
        return NextResponse.json({ error: "Negăsit" }, { status: 404 });
      }
      return NextResponse.json({ customer });
    }
    const customers = await listCustomers(q);
    return NextResponse.json({ customers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare clienți" }, { status: 500 });
  }
}

const postSchema = z.object({
  plate: z.string().min(5),
  phone: z.string().min(10),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const parsed = postSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    const customer = await upsertCustomer(parsed.data);
    return NextResponse.json({ customer });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare salvare client" }, { status: 500 });
  }
}

const grantSchema = z.object({
  customerId: z.string().uuid(),
  type: z.enum(["free_wash", "free_service", "custom"]),
  serviceId: z.enum(["express", "complet", "detail"]).nullable().optional(),
  label: z.string().min(2),
  notes: z.string().optional(),
  expiresAt: z.string().nullable().optional(),
});

export async function PATCH(req: Request) {
  if (!isAdminAuthorized(req)) return unauthorized();
  try {
    const body = await req.json();
    if (body.action === "grant") {
      const parsed = grantSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Date invalide" }, { status: 400 });
      }
      const bonus = await grantBonus({
        ...parsed.data,
        source: "manual",
      });
      return NextResponse.json({ bonus });
    }
    return NextResponse.json({ error: "Acțiune invalidă" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare bonus" }, { status: 500 });
  }
}
