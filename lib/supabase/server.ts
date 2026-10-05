import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la service_role key.
 * SOLO se usa en Route Handlers / server-side. Nunca exponer al cliente.
 * Bypassea RLS, así que cada función debe filtrar explícitamente
 * por el usuario correspondiente.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Verifica el JWT de Supabase Auth enviado en el header Authorization
 * y devuelve el usuario autenticado (o null si no es válido).
 */
export async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) return null;
  return data.user;
}
