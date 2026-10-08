import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Check if variables are valid and not placeholders
const isValidConfig = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-supabase-project.supabase.co" && 
  supabaseAnonKey !== "your-anon-role-key";

export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = !!isValidConfig;
