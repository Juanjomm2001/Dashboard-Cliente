-- 1. Habilitar pgvector
create extension if not exists vector;

-- 2. Crear la tabla 'documents' (Base vectorial)
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  knowledge_item_id uuid references public.knowledge_items(id) on delete cascade,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz default now()
);

-- 3. Trigger para Sincronizar tenant_id y knowledge_item_id desde metadata
-- Esto es vital para que al insertar desde n8n/LangChain, las columnas se rellenen solas.
create or replace function public.sync_document_metadata_to_columns()
returns trigger as $$
begin
  new.tenant_id := (new.metadata->>'tenant_id')::uuid;
  new.knowledge_item_id := (new.metadata->>'knowledge_item_id')::uuid;
  return new;
end;
$$ language plpgsql;

drop trigger if exists sync_metadata_on_insert on public.documents;
create trigger sync_metadata_on_insert
before insert on public.documents
for each row execute procedure public.sync_document_metadata_to_columns();

-- 4. Función exec_sql (para nodos de n8n que necesiten SQL manual)
create or replace function exec_sql(sql text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql;
end;
$$;

-- 5. Función de búsqueda vectorial
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_tenant_id uuid
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents d
  where d.tenant_id = p_tenant_id
    and 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;
