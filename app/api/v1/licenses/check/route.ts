import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, device_mac, action } = body;

    if (!username) {
      return NextResponse.json({ success: false, message: "Usuario requerido" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Buscar al cliente
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("id, full_name, email, password_hash, device_hwid")
      .eq("email", username.trim())
      .single();

    if (clientErr || !client || client.password_hash !== password) {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 });
    }

    // 2. Control de Equipo Único (Device Binding)
    if (device_mac) {
      if (!client.device_hwid) {
        // Vincula el primer dispositivo que inicia sesión
        await supabase
          .from("clients")
          .update({ device_hwid: device_mac })
          .eq("id", client.id);
      } else if (client.device_hwid !== device_mac) {
        return NextResponse.json({
          success: false,
          status: "DEVICE_LOCKED",
          message: "Dispositivo no autorizado. Acceso restringido a 1 solo equipo."
        }, { status: 403 });
      }
    }

    // 3. Consultar suscripción y datos de la plataforma
    const { data: sub, error: subErr } = await supabase
      .from("client_subscriptions")
      .select(`
        id,
        days_remaining,
        status,
        platforms ( id, name, master_email, master_password, totp_seed, access_url )
      `)
      .eq("client_id", client.id)
      .eq("status", "active")
      .gt("days_remaining", 0)
      .single();

    if (subErr || !sub) {
      return NextResponse.json({
        success: false,
        status: "EXPIRED",
        message: "Tu suscripción ha finalizado o no cuenta con días activos."
      }, { status: 403 });
    }

    const platform = sub.platforms as any;

    // Respuesta adaptada a la lógica de la extensión
    return NextResponse.json({
      success: true,
      data: {
        username: client.email,
        assigned_email: platform?.master_email || "",
        assigned_password: platform?.master_password || "",
        totp_seed: platform?.totp_seed || "",
        status: "ACTIVE",
        days_remaining: sub.days_remaining,
        days_total: 30,
        access_url: platform?.access_url || "https://gemini.google.com/app"
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Soporte para chequeo GET del Watchdog periódico
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const device_mac = searchParams.get("device_mac");

  if (!username) {
    return NextResponse.json({ success: false, message: "Parámetros incompletos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: client } = await supabase
    .from("clients")
    .select("id, email, device_hwid")
    .eq("email", username.trim())
    .single();

  if (!client) {
    return NextResponse.json({ success: false, status: "CANCELLED", message: "Usuario inexistente" });
  }

  if (device_mac && client.device_hwid && client.device_hwid !== device_mac) {
    return NextResponse.json({
      success: false,
      status: "DEVICE_LOCKED",
      message: "Acceso bloqueado: Dispositivo no autorizado."
    });
  }

  const { data: sub } = await supabase
    .from("client_subscriptions")
    .select("days_remaining, status")
    .eq("client_id", client.id)
    .single();

  if (!sub || sub.status !== "active" || sub.days_remaining <= 0) {
    return NextResponse.json({
      success: false,
      status: "EXPIRED",
      message: "Tu suscripción ha finalizado. Comunícate con tu administrador."
    });
  }

  return NextResponse.json({
    success: true,
    status: "ACTIVE",
    days_remaining: sub.days_remaining
  });
}
