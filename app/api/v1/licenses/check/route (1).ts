import { NextResponse } from "next/server";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/licenses/check
 *
 * Header requerido: Authorization: Bearer <access_token de Supabase Auth>
 *
 * Valida que el usuario autenticado tenga una suscripción activa
 * con days_remaining > 0. No entrega ninguna credencial ni sesión
 * de terceros: solo informa el estado de la licencia propia.
 */
export async function POST(request: Request) {
  const authUser = await getAuthenticatedUser(request);

  if (!authUser) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const supabase = getSupabaseAdmin();

  // 1. Resolver el registro interno de usuario a partir del auth_user_id
  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id, full_name, email")
    .eq("auth_user_id", authUser.id)
    .single();

  if (usuarioError || !usuario) {
    return NextResponse.json(
      { error: "Usuario no registrado en el sistema de licencias" },
      { status: 404 }
    );
  }

  // 2. Buscar la suscripción más reciente de ese usuario
  const { data: suscripcion, error: subError } = await supabase
    .from("suscripciones")
    .select("id, plan, days_remaining, status, start_date, updated_at")
    .eq("usuario_id", usuario.id)
    .order("start_date", { ascending: false })
    .limit(1)
    .single();

  if (subError || !suscripcion) {
    return NextResponse.json(
      { error: "El usuario no tiene ninguna suscripción" },
      { status: 404 }
    );
  }

  const isValid =
    suscripcion.status === "active" && suscripcion.days_remaining > 0;

  return NextResponse.json(
    {
      valid: isValid,
      usuario: { id: usuario.id, full_name: usuario.full_name },
      suscripcion: {
        plan: suscripcion.plan,
        status: suscripcion.status,
        days_remaining: suscripcion.days_remaining,
      },
    },
    { status: isValid ? 200 : 403 }
  );
}
