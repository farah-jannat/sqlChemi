import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const { difficulty, count } = await request.json();
  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "public/datas/manifest.json"),
      "utf-8",
    ),
  );

  //   const filtered = manifest.filter((q: any) => q.difficulty === difficulty.toLowerCase());

  // Use toLowerCase() on BOTH sides of the comparison
  const filtered = manifest.filter(
    (q: any) => q.difficulty.toLowerCase() === difficulty.toLowerCase(),
  );

  const selected = filtered.sort(() => 0.5 - Math.random()).slice(0, count);

  return NextResponse.json(selected);
}
