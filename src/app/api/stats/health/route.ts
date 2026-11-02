import { NextResponse } from "next/server";
import { getPythonApiUrl } from "@/lib/python-client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const pythonUrl = getPythonApiUrl();
  const envKeys = Object.keys(process.env).filter(
    (k) =>
      k.toLowerCase().includes("python") ||
      k.toLowerCase().includes("stats") ||
      k.toLowerCase().includes("hugging") ||
      k.toLowerCase().includes("hf") ||
      k.toLowerCase().includes("backend")
  );

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

    const res = await fetch(`${pythonUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    if (res && res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ status: "online", target: pythonUrl, python: data, envKeys });
    }

    return NextResponse.json({ status: "warming_up", target: pythonUrl, envKeys });
  } catch (err: any) {
    return NextResponse.json({ status: "waking_up", target: pythonUrl, error: err.message, envKeys });
  }
}

