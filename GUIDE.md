# Guía de Inicio: Dashboard AI Multi-tenant

Esta guía te explica cómo está construido el proyecto, qué necesitas para correrlo y cómo se conecta todo.

## 🛠️ Tecnologías Utilizadas (npm install)

Para este proyecto hemos instalado las siguientes librerías:
- **Next.js & Supabase**: La base del portal y la autenticación.
- **Tailwind CSS**: Para los estilos rápidos y modernos.
- **Lucide React**: Iconos elegantes y ligeros.
- **Framer Motion**: Para animaciones fluidas y micro-interacciones.
- **Clsx & Tailwind Merge**: Utilidades para manejar clases de CSS dinámicamente.

Comando ejecutado: `npm install framer-motion lucide-react clsx tailwind-merge`

## 🔐 Configuración del Entorno (.env)

He creado un archivo `.env.local` basado en `.env.example`. Para que el proyecto funcione en local o en producción (Vercel/Git), necesitas estas dos variables de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

> [!IMPORTANT]
> **Seguridad**: Nunca subas el archivo `.env.local` a GitHub. Está incluido en `.gitignore` por defecto. Si usas Vercel, deberás añadir estas variables en el panel de control del proyecto.

## 📁 Estructura del Proyecto

- `/app`: Contiene las páginas y rutas (Next.js App Router).
- `/components`: Componentes reutilizables (Sidebar, Cards, etc.).
- `/lib`: Utilidades y configuración de clientes (Supabase).
- `supabase_schema.sql`: El script que debes copiar y pegar en el SQL Editor de tu Dashboard de Supabase para crear las tablas.

## ⚡ Conexión con n8n

1. **Base de Datos**: n8n se conectará directamente a tu base de datos de Supabase (PostgreSQL) para leer/escribir en `conversations` y `knowledge_items`.
2. **Webhooks**: El botón de "Subir Archivo" en el Dashboard enviará una señal (webhook) a n8n para que procese el archivo, lo vectorice y lo guarde en Supabase.
3. **Multi-tenancy**: Es vital que n8n siempre guarde el `tenant_id` correcto para que cada cliente solo vea sus propios datos.


Para correrlo:  npm run dev
