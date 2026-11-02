import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://oyyzvggcfbstubjxywix.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const supabase: SupabaseClient | null = supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Uploads a raw dataset buffer directly to Supabase Storage ('datasets' bucket)
 * and returns the public accessible URL.
 */
export async function uploadDatasetToSupabase(
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string | null> {
  if (!supabase) return null;

  try {
    // Ensure the bucket exists or upload directly (bucket 'datasets' is pre-created as public)
    const { error: uploadError } = await supabase.storage
      .from("datasets")
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn("Supabase Storage upload error:", uploadError.message);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from("datasets").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err: any) {
    console.warn("Supabase upload exception:", err.message);
    return null;
  }
}

/**
 * Ensures any dataset storageKey is converted to a fully-qualified public HTTP URL
 * for remote python computation (Hugging Face / cloud backend).
 */
export function getPublicDatasetUrl(storageKey: string): string {
  if (!storageKey) return "";
  if (storageKey.startsWith("http://") || storageKey.startsWith("https://")) {
    return storageKey;
  }
  const cleanKey = storageKey.includes("datasets/")
    ? storageKey.substring(storageKey.indexOf("datasets/"))
    : `datasets/${storageKey.replace(/^\/+/, "")}`;
  return `https://oyyzvggcfbstubjxywix.supabase.co/storage/v1/object/public/${cleanKey}`;
}

