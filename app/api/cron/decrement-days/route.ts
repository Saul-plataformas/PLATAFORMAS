import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/cron/decrement-days
 *
 * Endpoint de mantenimiento diario. Protegido con CRON_SECRET.
 * 1. Ejecuta la función RPC en Supabase para descontar 1 día de forma atómica.
 * 2. Marca como 'expired' las suscripciones en client_subscriptions que lleguen a 0.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const providedSecret = authHeader.replace(/^Bearer\s+/i, "").trim();
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || providedSecret !== cronSecret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // 1. Descontar 1 día a las suscripciones activas
  const { data: decremented, error: decrementError } = await supabase.rpc(
    "decrement_active_subscriptions"
  );

  if (decrementError) {
    return NextResponse.json(
      { error: "Error al descontar días", detail: decrementError.message },
      { status: 500 }
    );
  }

  // 2. Expirar las que llegaron a 0 días en la tabla REAL: client_subscriptions
  const { data: expired, error: expireError } = await supabase
    .from("client_subscriptions")
    .update({ status: "expired" })
    .eq("status", "active")
    .lte("days_remaining", 0)
    .select("id");

  if (expireError) {
    return NextResponse.json(
      { error: "Error al expirar suscripciones", detail: expireError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    decremented_count: decremented ?? 0,
    expired_count: expired?.length ?? 0,
    ran_at: new Date().toISOString(),
  });
}
