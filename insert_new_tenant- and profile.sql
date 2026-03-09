-- 1. Insertar el nuevo Tenant
-- Cambia 'Nombre del Cliente' y 'slug-del-cliente' por los reales
insert into public.tenants (name, slug) 
values ('Nuevo Cliente', 'nuevo-cliente')
returning id;

-- 2. Vincular un usuario existente a este nuevo tenant (OPCIONAL)
-- Si ya tienes un usuario creado y quieres que vea este tenant:
-- Descomenta la línea de abajo y cambia 'TU_USER_ID_DE_AUTH' por el ID de la tabla auth.users
-- o búscalo por el email en el dashboard de Supabase.

-- update public.profiles 
-- set tenant_id = (select id from public.tenants where slug = 'nuevo-cliente' limit 1)
-- where id = 'TU_USER_ID_DE_AUTH';
