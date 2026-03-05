-- 1. Insertar un Cliente de prueba (Tenant)
-- Ejecuta esto primero en el SQL Editor de Supabase
insert into public.tenants (name, slug) 
values ('Peluquerias paqui', 'paqui')
returning id;

-- 2. Vincular usuario (IMPORTANTE)
-- Una vez te registres en la web (localhost:3000/auth/sign-up), 
-- copia el ID que salió arriba y pégalo en la columna `tenant_id` 
-- de tu fila en la tabla `public.profiles`.

-- 3. Insertar un Cliente Final (El usuario que no tiene acceso al dashboard)
insert into public.customers (tenant_id, external_id, name)
values (
  (select id from public.tenants where slug = 'paqui' limit 1),
  'WA-123456', -- ID externo (ej: WhatsApp)
  'Pepito Grillo'
)
returning id;

-- 4. Insertar una conversación de prueba vinculada a ese customer
insert into public.conversations (tenant_id, customer_id, messages, summary, sentiment)
values (
  (select id from public.tenants where slug = 'paqui' limit 1), 
  (select id from public.customers where external_id = 'WA-123456' limit 1),
  '[{"role": "user", "content": "Hola, ¿que tal?"}, {"role": "assistant", "content": "Hola! Soy tu asistente IA de Peluquerias paqui."}]'::jsonb,
  'Consulta inicial sobre servicios',
  'positivo'
);
