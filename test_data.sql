-- 1. Insertar un Cliente de prueba (Tenant)
-- Ejecuta esto primero en el SQL Editor de Supabase
insert into public.tenants (name, slug) 
values ('Mi Primer Cliente', 'cliente-test')
returning id;

-- 2. Vincular usuario (IMPORTANTE)
-- Una vez te registres en la web (localhost:3000/auth/sign-up), 
-- copia el ID que salió arriba y pégalo en la columna `tenant_id` 
-- de tu fila en la tabla `public.profiles`.

-- 3. (Opcional) Insertar una conversación de prueba
-- Sustituye EL_ID_DEL_ESTE_CLIENTE por el UUID generado en el paso 1
/*
insert into public.conversations (tenant_id, customer_name, messages, summary, sentiment)
values (
  'EL_ID_DEL_TENANT', 
  'Pepito Grillo', 
  '[{"role": "user", "content": "Hola, ¿que tal?"}, {"role": "assistant", "content": "Hola! Soy tu asistente IA de Mi Primer Cliente."}]'::jsonb,
  'Consulta inicial sobre servicios',
  'positivo'
);
*/
