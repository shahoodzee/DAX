// import { createClient } from "@supabase/supabase-js";

// const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// export const supabase = createClient(url!, anonKey!, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: false,
//   },
// });

// Temporary mock client (no real network calls)
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

type AuthResult<T> = { data: T | null; error: { message: string } | null };

export const supabase = {
  auth: {
    async signInWithPassword({ email }: { email: string; password: string }): Promise<AuthResult<{ session: unknown }>> {
      await delay(300);
      console.info("[mock] signInWithPassword", email);
      return { data: { session: {} }, error: null };
    },
    async signUp({ email }: { email: string; password: string; options?: { emailRedirectTo?: string } }): Promise<AuthResult<{ user: unknown }>> {
      await delay(300);
      console.info("[mock] signUp", email);
      return { data: { user: {} }, error: null };
    },
    async signInWithOAuth({ provider }: { provider: "google" | "github"; options?: { redirectTo?: string } }): Promise<AuthResult<{ url?: string }>> {
      await delay(100);
      console.info("[mock] signInWithOAuth", provider);
      const url = `${window.location.origin}/auth/callback?code=dev`;
      window.location.assign(url);
      return { data: { url }, error: null };
    },
    async exchangeCodeForSession(_code: string): Promise<AuthResult<{ session: unknown }>> {
      await delay(200);
      console.info("[mock] exchangeCodeForSession");
      return { data: { session: {} }, error: null };
    },
  },
};
