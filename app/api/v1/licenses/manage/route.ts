import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const [platformsRes, subsRes, proxiesRes] = await Promise.all([
      supabase.from("platforms").select("*").order("created_at", { ascending: true }),
      supabase.from("client_subscriptions").select(`
        id,
        days_remaining,
        status,
        created_at,
        proxy_id,
        clients ( id, full_name, email, password_hash ),
        platforms ( id, name, slug, access_url ),
        proxies ( id, name, host, port )
      `).order("created_at", { ascending: false }),
      supabase.from("proxies").select("*, client_subscriptions(count)")
    ]);

    if (platformsRes.error) throw platformsRes.error;
    if (subsRes.error) throw subsRes.error;
    if (proxiesRes.error) throw proxiesRes.error;

    // Calcular espacios disponibles en cada proxy
    const proxiesWithSlots = (proxiesRes.data || []).map((p: any) => {
      const activeUsers = p.client_subscriptions?.[0]?.count || 0;
      return {
        ...p,
        used_slots: activeUsers,
        available_slots: Math.max(0, p.max_users - activeUsers),
        is_full: activeUsers >= p.max_users
      };
    });

    return NextResponse.json({
      platforms: platformsRes.data || [],
      subscriptions: subsRes.data || [],
      proxies: proxiesWithSlots
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // 1. Crear nuevo Proxy
    if (body.action === "CREATE_PROXY") {
      const { name, host, port, username, password, max_users } = body;
      const { data, error } = await supabase.from("proxies").insert({
        name,
        host,
        port: Number(port) || 8080,
        username,
        password,
        max_users: Number(max_users) || 5
      }).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, proxy: data });
    }

    // 2. Crear nuevo Producto / Servicio
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

    // 3. Crear Cliente con Asignación de Proxy
    const { full_name, email, password, platform_id, proxy_id, days } = body;
    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .upsert({ full_name, email, password_hash: password }, { onConflict: "email" })
      .select()
      .single();

    if (clientErr) throw clientErr;

    const { data: sub, error: subErr } = await supabase
      .from("client_subscriptions")
      .insert({
        client_id: client.id,
        platform_id: platform_id || null,
        proxy_id: proxy_id || null,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'subscription' | 'platform' | 'proxy'
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    const supabase = getSupabaseAdmin();

    if (type === "platform") {
      await supabase.from("platforms").delete().eq("id", id);
    } else if (type === "proxy") {
      await supabase.from("proxies").delete().eq("id", id);
    } else {
      await supabase.from("client_subscriptions").delete().eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, days_remaining, status, proxy_id } = body;
    const supabase = getSupabaseAdmin();

    const updateData: any = {};
    if (days_remaining !== undefined) updateData.days_remaining = days_remaining;
    if (status !== undefined) updateData.status = status;
    if (proxy_id !== undefined) updateData.proxy_id = proxy_id;

    const { data, error } = await supabase
      .from("client_subscriptions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, subscription: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
