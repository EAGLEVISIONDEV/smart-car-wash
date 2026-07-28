import { NextResponse } from "next/server";
import { z } from "zod";
import { packages } from "@/lib/data";
import { isValidRoPlate } from "@/lib/plates";
import { createBooking, getActiveForSlots } from "@/lib/store";
import { generateSlotsForDay } from "@/lib/booking";

const schema = z.object({
  plate: z.string().min(5),
  phone: z.string().min(10),
  name: z.string().optional(),
  serviceId: z.enum(["express", "complet", "detail"]),
  startAt: z.string().datetime(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const data = parsed.data;
    if (!isValidRoPlate(data.plate)) {
      return NextResponse.json(
        { error: "Număr de înmatriculare invalid (format RO)" },
        { status: 400 },
      );
    }
    if (!packages.some((p) => p.id === data.serviceId)) {
      return NextResponse.json({ error: "Serviciu invalid" }, { status: 400 });
    }

    const day = data.startAt.slice(0, 10);
    const existing = await getActiveForSlots(day);
    const slots = generateSlotsForDay(day, existing, data.serviceId);
    if (!slots.includes(data.startAt) && !slots.some((s) => s === data.startAt)) {
      // allow exact match after normalize
      const ok = slots.some((s) => new Date(s).getTime() === new Date(data.startAt).getTime());
      if (!ok) {
        return NextResponse.json(
          { error: "Intervalul nu mai este disponibil. Alege alt slot." },
          { status: 409 },
        );
      }
    }

    const booking = await createBooking({
      plate: data.plate,
      phone: data.phone,
      name: data.name,
      serviceId: data.serviceId,
      startAt: data.startAt,
      notes: data.notes,
      source: "web",
    });

    return NextResponse.json({ booking });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Eroare la salvare. Încearcă din nou." },
      { status: 500 },
    );
  }
}
