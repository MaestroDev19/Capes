import { createClient as createServerSupabase } from "@/supabase/server";
import { type Profile } from "@/data-types";

export type MinimalProfile = Pick<Profile, "id" | "username" | "bio" | "country"> & {
  interests?: Profile["interests"] | null;
};

export async function fetchProfileByUserId(userId: string) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") {
    throw error;
  }
  return data as Profile | null;
}

export function isProfileComplete(profile: Partial<Profile> | null) {
  if (!profile) return false;
  const hasUsername = Boolean((profile as any).username && String((profile as any).username).trim().length > 0);
  const hasCountry = Boolean((profile as any).country && String((profile as any).country).trim().length > 0);
  const hasInterests = Boolean((profile as any).interests && Object.keys((profile as any).interests || {}).length > 0);
  return hasUsername && hasCountry && hasInterests;
}

export async function ensureProfileWithDefaults(userId: string) {
  const existing = await fetchProfileByUserId(userId);
  if (existing) return existing;

  const supabase = await createServerSupabase();
  const defaultRow: Partial<Profile> = {
    id: userId,
    bio: "New user",
  };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(defaultRow, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as Profile;
}


