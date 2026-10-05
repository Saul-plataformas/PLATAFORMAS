import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 1. Obtener la lista de clientes para la tabla del dashboard
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("client_subscriptions")
      .select(`
        id,
        days_remaining,
        status,
        clients ( full_name, email ),
        platforms ( name, slug ),
        proxies ( host, port )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. Registrar un nuevo cliente y asignarle días desde el modal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, platformId, days, proxyId } = body;

    const supabase = getSupabaseAdmin();

    // Crear cliente
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .insert({ full_name: fullName, email, password_hash: password })
      .select()
      .single();

    if (clientErr) throw clientErr;

    // Calcular fecha de vencimiento y registrar suscripción
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(days));

    const { data: sub, error: subErr } = await supabase
      .from("client_subscriptions")
      .insert({
        client_id: client.id,
        platform_id: platformId,
        proxy_id: proxyId || null,
        days_remaining: Number(days),
        expires_at: expiresAt.toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (subErr) throw subErr;

    return NextResponse.json({ ok: true, client, subscription: sub });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
