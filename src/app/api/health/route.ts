import { NextResponse } from "next/server";
import { client } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await client.execute("SELECT 1;");
    dbLatencyMs = Date.now() - dbStart;
  } catch (error) {
    dbStatus = "unhealthy";
    console.error("[HealthCheck] Database ping failed:", error);
  }

  const memoryUsage = process.memoryUsage();

  const healthData = {
    status: dbStatus === "healthy" ? "healthy" : "degraded",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    system: {
      nodeVersion: process.version,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
    },
  };

  const statusCode = dbStatus === "healthy" ? 200 : 503;

  return NextResponse.json(healthData, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
