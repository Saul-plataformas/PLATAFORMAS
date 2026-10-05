# Sistema de Licencias SaaS — Backend (Next.js App Router + Supabase)

## 1. Estructura

```
sql/
  schema.sql                 -> tablas usuarios y suscripciones + RLS
  decrement_function.sql     -> función SQL para el cron
lib/supabase/server.ts       -> cliente admin + verificación de JWT
app/api/v1/licenses/check/route.ts      -> valida licencia del usuario autenticado
app/api/cron/decrement-days/route.ts    -> descuenta 1 día diario (protegido)
```

## 2. Configuración en Supabase

1. Crea el proyecto en Supabase.
2. En el **SQL Editor**, ejecuta en orden:
   - `sql/schema.sql`
   - `sql/decrement_function.sql`
3. Activa **Supabase Auth** (email/password o el proveedor que prefieras).
4. Cuando un usuario se registra en Auth, crea su fila correspondiente
   en `public.usuarios` (puedes hacerlo con un trigger en `auth.users`
   o desde tu propio endpoint de registro) para enlazar `auth_user_id`.

## 3. Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`: en el panel de Supabase,
  Settings → API.
- `CRON_SECRET`: cualquier string largo y aleatorio que tú elijas.

## 4. Instalación

```bash
npm install @supabase/supabase-js
```

## 5. Uso del endpoint de validación

```bash
curl -X POST https://tu-dominio.vercel.app/api/v1/licenses/check \
  -H "Authorization: Bearer <access_token_del_usuario>"
```

El `access_token` se obtiene al hacer login con Supabase Auth
(`supabase.auth.signInWithPassword(...)` en tu frontend/app cliente).

Respuesta (200 si válida, 403 si no):

```json
{
  "valid": true,
  "usuario": { "id": "...", "full_name": "..." },
  "suscripcion": { "plan": "standard", "status": "active", "days_remaining": 12 }
}
```

## 6. Cron job diario en Vercel

Agrega en `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/decrement-days",
      "schedule": "0 5 * * *"
    }
  ]
}
```

Vercel Cron llama automáticamente al endpoint; para protegerlo igual
puedes configurar el header `Authorization` en un `Cron Job` externo
(ej. cron-job.org) apuntando a tu dominio con el `CRON_SECRET`.

## 7. Notas de seguridad

- El endpoint de check nunca entrega credenciales ni inyecta sesiones
  en otros dominios: solo responde si el usuario tiene saldo de días.
- El cron está protegido por un secreto propio, separado del JWT de
  usuarios.
- RLS está activo: cada usuario autenticado solo puede leer su propia
  fila vía consultas directas desde el cliente; las escrituras pasan
  siempre por el backend con la service role key.
