import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Acepta tanto 'email' (del portal web) como 'username' (de la extensión)
    const userIdentifier = (body.email || body.username || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const device_mac = body.device_mac || null;

    if (!userIdentifier || !password) {
      return NextResponse.json(
        { success: false, valid: false, error: "Credenciales incompletas", message: "Credenciales incompletas" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Buscar al cliente en la base de datos
    const { data: client, error: clientErr } = await supabase
      .from("clients")
      .select("id, full_name, email, password_hash, device_hwid")
      .eq("email", userIdentifier)
      .maybeSingle();

    if (clientErr || !client || client.password_hash !== password) {
      return NextResponse.json(
        { success: false, valid: false, error: "Credenciales inválidas", message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 2. Control de Equipo Único (si viene desde la extensión)
    if (device_mac) {
      if (!client.device_hwid) {
        await supabase
          .from("clients")
          .update({ device_hwid: device_mac })
          .eq("id", client.id);
      } else if (client.device_hwid !== device_mac) {
        return NextResponse.json({
          success: false,
          valid: false,
          status: "DEVICE_LOCKED",
          message: "Dispositivo no autorizado. Acceso restringido a 1 solo equipo."
        }, { status: 403 });
      }
    }

    // 3. Buscar suscripción del cliente
    const { data: sub } = await supabase
      .from("client_subscriptions")
      .select(`
        id,
        days_remaining,
        status,
        platforms ( id, name, slug, access_url, master_email, master_password, totp_seed ),
        proxies ( host, port, username, password )
      `)
      .eq("client_id", client.id)
      .maybeSingle();

    const platform = sub?.platforms as any;
    const daysRemaining = sub?.days_remaining ?? 30;
    const subStatus = sub?.status || "active";

    // Respuesta híbrida compatible con el Portal Web y la Extensión
    return NextResponse.json({
      success: true,
      valid: true,
      // Para el Portal Web (/portal):
      usuario: {
        id: client.id,
        full_name: client.full_name,
        email: client.email
      },
      suscripcion: {
        plan: platform?.name || "Acceso Autorizado",
        status: subStatus,
        days_remaining: daysRemaining
      },
      access_url: platform?.access_url || "https://chatgpt.com",
      proxy: sub?.proxies || null,

      // Para la Extensión de navegador:
      data: {
        username: client.email,
        assigned_email: platform?.master_email || "",
        assigned_password: platform?.master_password || "",
        totp_seed: platform?.totp_seed || "",
        status: subStatus === "active" && daysRemaining > 0 ? "ACTIVE" : "EXPIRED",
        days_remaining: daysRemaining,
        days_total: 30,
        access_url: platform?.access_url || "https://chatgpt.com"
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, valid: false, error: err.message }, { status: 500 });
  }
}

// Soporte GET para el Watchdog periódico de la extensión
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "").trim().toLowerCase();
  const device_mac = searchParams.get("device_mac");

  if (!username) {
    return NextResponse.json({ success: false, message: "Parámetros incompletos" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: client } = await supabase
    .from("clients")
    .select("id, email, device_hwid")
    .eq("email", username)
    .maybeSingle();

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
    .maybeSingle();

  if (!sub || sub.status !== "active" || (sub.days_remaining ?? 0) <= 0) {
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
