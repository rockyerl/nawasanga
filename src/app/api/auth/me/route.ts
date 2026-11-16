import { NextResponse } from "next/server";
import { getCurrentSession } from "@/features/auth/actions";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { code: 401, status: "Unauthorized", user: null },
        { status: 401 }
      );
    }

    let organizationName = session.organizationName;
    if (!organizationName && session.organizationId) {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.id, session.organizationId),
      });
      organizationName = org?.name || null;
    }

    return NextResponse.json({
      code: 200,
      status: "OK",
      user: {
        ...session,
        organizationName,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { code: 500, status: "Error", message: String(err) },
      { status: 500 }
    );
  }
}
