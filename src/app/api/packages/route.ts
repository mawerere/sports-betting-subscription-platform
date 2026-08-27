import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const packages = await db.query.packages.findMany();
  return NextResponse.json(packages);
}