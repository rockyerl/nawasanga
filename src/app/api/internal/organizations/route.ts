import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const allOrgs = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
    return NextResponse.json({
      code: 200,
      status: "OK",
      message: "Data organisasi berhasil diambil",
      data: allOrgs,
    });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date();
    const newOrg = {
      id: `org_${Date.now()}`,
      name: body.name,
      slug: body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      industry: body.industry || "Logistics",
      contactEmail: body.contactEmail || "admin@example.com",
      contactPhone: body.contactPhone || "-",
      address: body.address || "-",
      plan: body.plan || "starter",
      maxAssets: parseInt(body.maxAssets, 10) || 10,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(organizations).values(newOrg);
    return NextResponse.json({ code: 201, status: "Created", message: "Organisasi berhasil didaftarkan", data: newOrg });
  } catch (err) {
    return NextResponse.json({ code: 500, status: "Error", message: String(err) }, { status: 500 });
  }
}
