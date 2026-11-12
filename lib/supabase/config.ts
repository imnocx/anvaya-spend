export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    anonKey &&
    !url.includes("placeholder-anvaya") &&
    !url.includes("your-project-id") &&
    anonKey !== "placeholder-anon-key" &&
    anonKey !== "your-anon-key-here" &&
    anonKey.length > 20
  );
}
