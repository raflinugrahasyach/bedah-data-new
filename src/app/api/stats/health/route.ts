import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.STATS_ENGINE_URL || "http://localhost:8000";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const res = await fetch(`${PYTHON_API_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ status: "online", python: data });
    }

    return NextResponse.json({ status: "warming_up", target: PYTHON_API_URL });
  } catch (err: any) {
    return NextResponse.json({ status: "waking_up", error: err.message });
  }
}
