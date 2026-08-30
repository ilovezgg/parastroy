import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client using the service-role key — same shared Supabase
// project as parastroy-admin. Never import this from a Client Component.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
