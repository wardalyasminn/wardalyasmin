import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const allProducts = await getProducts();
  const results = allProducts
    .filter((p: any) => p.is_active !== false)
    .filter((p: any) => p.name?.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8);

  return NextResponse.json({ results });
}
