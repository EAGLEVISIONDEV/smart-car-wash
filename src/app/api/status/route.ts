import { NextResponse } from "next/server";
import { findByPlateOrCode } from "@/lib/store";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ error: "Introdu numărul sau codul" }, { status: 400 });
  }
  try {
    const results = await findByPlateOrCode(q);
    return NextResponse.json({ results });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare la căutare" }, { status: 500 });
  }
}
