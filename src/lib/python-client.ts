/**
 * Client configuration and resolution for Bedah Data Python Statistical Microservice.
 * Automatically handles Hugging Face Spaces (Gradio wrap), Render, or localhost environments.
 */

export function getPythonApiUrl(): string {
  // 1. Direct explicit environment variables
  const explicit = process.env.PYTHON_API_URL || process.env.STATS_ENGINE_URL;
  if (explicit && !explicit.includes("localhost")) {
    return cleanUrl(explicit);
  }

  // 2. Auto-scan all env variables for any Hugging Face / Cloud Python URLs
  for (const [key, val] of Object.entries(process.env)) {
    if (
      typeof val === "string" &&
      val.startsWith("http") &&
      !val.includes("localhost") &&
      !val.includes("supabase.co") &&
      !val.includes("vercel.app")
    ) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("python") ||
        lowerKey.includes("stats") ||
        lowerKey.includes("hf") ||
        lowerKey.includes("hugging") ||
        lowerKey.includes("space") ||
        lowerKey.includes("backend") ||
        lowerKey.includes("engine") ||
        lowerKey.includes("fastapi") ||
        val.includes("hf.space") ||
        val.includes("huggingface")
      ) {
        return cleanUrl(val);
      }
    }
  }

  return cleanUrl(explicit || "http://localhost:8000");
}

export function cleanUrl(rawUrl: string): string {
  let url = rawUrl.trim().replace(/\/+$/, "");
  // Auto-convert HuggingFace Space UI url to direct direct API domain if needed:
  // e.g. https://huggingface.co/spaces/user/bedah-data-engine -> https://user-bedah-data-engine.hf.space
  const hfSpacesMatch = url.match(/https?:\/\/huggingface\.co\/spaces\/([^\/]+)\/([^\/]+)/i);
  if (hfSpacesMatch) {
    const owner = hfSpacesMatch[1].toLowerCase().replace(/_/g, "-");
    const space = hfSpacesMatch[2].toLowerCase().replace(/_/g, "-");
    url = `https://${owner}-${space}.hf.space`;
  }
  return url;
}
