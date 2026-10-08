import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const [platformsRes, subsRes, proxiesRes, masterAccountsRes] = await Promise.all([
      supabase.from("platforms").select("*").order("created_at", { ascending: true }),
      supabase.from("client_subscriptions").select(`
        id,
        days_remaining,
        status,
        created_at,
        proxy_id,
        master_account_id,
        clients ( id, full_name, email, password_hash ),
        platforms ( id, name, slug, access_url ),
        proxies ( id, name, host, port ),
        master_accounts ( id, account_name, email )
      `).order("created_at", { ascending: false }),
      supabase.from("proxies").select("*, client_subscriptions(count)"),
      supabase.from("master_accounts").select("*, client_subscriptions(count), platforms(name)")
    ]);

    if (platformsRes.error) throw platformsRes.error;
    if (subsRes.error) throw subsRes.error;
    if (proxiesRes.error) throw proxiesRes.error;
    if (masterAccountsRes.error) throw masterAccountsRes.error;

    // Calcular cupos de Proxies
    const proxiesWithSlots = (proxiesRes.data || []).map((p: any) => {
      const activeUsers = p.client_subscriptions?.[0]?.count || 0;
      return {
        ...p,
        used_slots: activeUsers,
        available_slots: Math.max(0, p.max_users - activeUsers),
        is_full: activeUsers >= p.max_users
      };
    });

    // Calcular cupos de Cuentas Matrices con su contador
    const accountsWithSlots = (masterAccountsRes.data || []).map((acc: any) => {
      const activeUsers = acc.client_subscriptions?.[0]?.count || 0;
      return {
        ...acc,
        used_slots: activeUsers,
        available_slots: Math.max(0, acc.max_users - activeUsers),
        is_full: activeUsers >= acc.max_users
      };
    });

    return NextResponse.json({
      platforms: platformsRes.data || [],
      subscriptions: subsRes.data || [],
      proxies: proxiesWithSlots,
      master_accounts: accountsWithSlots
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // 1. Guardar nueva Cuenta Matriz para cualquier servicio
    if (body.action === "CREATE_MASTER_ACCOUNT") {
      const { platform_id, account_name, email, password, totp_seed, max_users } = body;
      if (!platform_id || !email || !password) {
        return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
      }

      const { data, error } = await supabase.from("master_accounts").insert({
        platform_id,
        account_name: account_name || "Cuenta Principal",
        email: email.trim(),
        password: password.trim(),
        totp_seed: totp_seed ? totp_seed.trim() : null,
        max_users: Number(max_users) || 5
      }).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, master_account: data });
    }

    // 2. Crear nuevo Proxy
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

    // 3. Crear nuevo Servicio (Vitrina)
    if (body.action === "CREATE_PLATFORM") {
      const { name, slug, badge, description, access_url } = body;
      const { data, error } = await supabase.from("platforms").insert({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        badge: badge || "Activo • Entrega Inmediata",
        description,
        access_url: access_url || "https://chatgpt.com"
      }).select().single();

      if (error) throw error;
      return NextResponse.json({ success: true, platform: data });
    }

    // 4. Crear Cliente asignándole Servicio, Cuenta Matriz y Proxy específicos
    const { full_name, email, password, platform_id, master_account_id, proxy_id, days } = body;
    if (!email || !password || !full_name || !platform_id) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .upsert({ full_name, email: email.trim().toLowerCase(), password_hash: password }, { onConflict: "email" })
      .select()
      .single();

    if (clientErr) throw clientErr;

    const { data: sub, error: subErr } = await supabase
      .from("client_subscriptions")
      .insert({
        client_id: client.id,
        platform_id,
        master_account_id: master_account_id || null,
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
    const type = searchParams.get("type"); // 'subscription' | 'platform' | 'proxy' | 'master_account'
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    const supabase = getSupabaseAdmin();

    if (type === "platform") {
      await supabase.from("platforms").delete().eq("id", id);
    } else if (type === "proxy") {
      await supabase.from("proxies").delete().eq("id", id);
    } else if (type === "master_account") {
      await supabase.from("master_accounts").delete().eq("id", id);
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
    const { id, days_remaining, status, proxy_id, master_account_id } = body;
    const supabase = getSupabaseAdmin();

    const updateData: any = {};
    if (days_remaining !== undefined) updateData.days_remaining = days_remaining;
    if (status !== undefined) updateData.status = status;
    if (proxy_id !== undefined) updateData.proxy_id = proxy_id;
    if (master_account_id !== undefined) updateData.master_account_id = master_account_id;

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
