import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ valid: false, error: "Ingresa correo y contraseña" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Buscar cliente por email
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("id, full_name, email, password_hash")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (clientErr || !client) {
      return NextResponse.json({ valid: false, error: "Usuario no registrado" }, { status: 401 });
    }

    // 2. Comprobar contraseña
    if (client.password_hash !== password.trim()) {
      return NextResponse.json({ valid: false, error: "Contraseña incorrecta" }, { status: 401 });
    }

    // 3. Buscar suscripción activa
    const { data: sub } = await supabase
      .from("client_subscriptions")
      .select(`
        id,
        days_remaining,
        status,
        platforms ( name, slug, access_url ),
        proxies ( host, port, username, password )
      `)
      .eq("client_id", client.id)
      .maybeSingle();

    return NextResponse.json({
      valid: true,
      usuario: {
        id: client.id,
        full_name: client.full_name,
        email: client.email
      },
      suscripcion: {
        plan: (sub?.platforms as any)?.name || "Acceso Autorizado",
        status: sub?.status || "active",
        days_remaining: sub?.days_remaining ?? 30
      },
      access_url: (sub?.platforms as any)?.access_url || "https://chatgpt.com",
      proxy: sub?.proxies || null
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}
