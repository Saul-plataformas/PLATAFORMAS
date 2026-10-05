import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET: Cargar catálogo de servicios y lista de clientes
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const [platformsRes, subsRes] = await Promise.all([
      supabase.from("platforms").select("*").order("created_at", { ascending: true }),
      supabase.from("client_subscriptions").select(`
        id,
        days_remaining,
        status,
        created_at,
        clients ( id, full_name, email, password_hash ),
        platforms ( id, name, slug )
      `).order("created_at", { ascending: false })
    ]);

    if (platformsRes.error) throw platformsRes.error;
    if (subsRes.error) throw subsRes.error;

    return NextResponse.json({
      platforms: platformsRes.data || [],
      subscriptions: subsRes.data || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Crear cliente o crear nuevo servicio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // Caso A: Crear un nuevo Producto / Servicio
    if (body.action === "CREATE_PLATFORM") {
      const { name, slug, badge, description, tags, accent_color, access_url } = body;
      const { data, error } = await supabase.from("platforms").insert({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        badge: badge || "Activo • Entrega Inmediata",
        description,
        tags: tags || ["IA"],
        accent_color: accent_color || "cyan",
        access_url: access_url || "https://chatgpt.com"
      }).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, platform: data });
    }

    // Caso B: Crear un nuevo Cliente con su suscripción y contraseña
    const { full_name, email, password, platform_id, days } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 1. Insertar cliente
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .upsert({ full_name, email, password_hash: password }, { onConflict: "email" })
      .select()
      .single();

    if (clientErr) throw clientErr;

    // 2. Asignar suscripción
    const { data: sub, error: subErr } = await supabase
      .from("client_subscriptions")
      .insert({
        client_id: client.id,
        platform_id: platform_id || null,
        days_remaining: Number(days) || 30,
        status: "active"
      })
      .select()
      .single();

    if (subErr) throw subErr;

    return NextResponse.json({ success: true, client, subscription: sub });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Borrar cliente o borrar servicio
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'subscription' | 'platform'
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const supabase = getSupabaseAdmin();

    if (type === "platform") {
      const { error } = await supabase.from("platforms").delete().eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("client_subscriptions").delete().eq("id", id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Actualizar días o estado de una suscripción
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, days_remaining, status } = body;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("client_subscriptions")
      .update({ days_remaining, status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, subscription: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
