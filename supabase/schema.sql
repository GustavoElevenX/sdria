create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  name text,
  email text,
  role text check (role in ('admin', 'manager', 'closer', 'operator')),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  name text,
  company_name text,
  phone text,
  email text,
  source text,
  stage text,
  status text,
  owner_id uuid references profiles(id),
  estimated_value numeric,
  context_level text,
  context_score int default 0,
  lead_score int default 0,
  ai_status text,
  last_interaction_at timestamp,
  next_action_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists lead_contexts (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id),
  main_pain text,
  service_interest text,
  known_objections text,
  urgency text,
  decision_maker text,
  commercial_context text,
  internal_notes text,
  ai_summary text,
  ai_recommended_angle text,
  ai_missing_fields jsonb,
  ai_recommended_cases jsonb,
  ready_for_outreach boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists cases (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  title text not null,
  client_alias text,
  is_confidential boolean default true,
  segment text,
  subsegment text,
  initial_problem text,
  before_scenario text,
  implemented_solution text,
  sold_service text,
  result_obtained text,
  time_to_result text,
  objections_faced text,
  when_to_use text,
  when_not_to_use text,
  proofs_available text,
  internal_notes text,
  tags text[],
  active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists knowledge_documents (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  title text not null,
  type text,
  content text,
  tags text[],
  active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists knowledge_chunks (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references knowledge_documents(id),
  company_id uuid references companies(id),
  content text,
  embedding vector(1536),
  tags text[],
  created_at timestamp default now()
);

create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  lead_id uuid references leads(id),
  channel text default 'whatsapp',
  status text,
  assigned_to uuid references profiles(id),
  last_message_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id),
  lead_id uuid references leads(id),
  company_id uuid references companies(id),
  sender_type text,
  content text,
  whatsapp_message_id text,
  message_template_id uuid,
  metadata jsonb,
  created_at timestamp default now()
);

create table if not exists message_templates (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  name text,
  category text,
  content text,
  stage_target text,
  active boolean default true,
  approved_on_whatsapp boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists meetings (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  lead_id uuid references leads(id),
  conversation_id uuid references conversations(id),
  closer_id uuid references profiles(id),
  calendar_event_id text,
  starts_at timestamp,
  ends_at timestamp,
  status text,
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists agent_settings (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  agent_name text,
  agent_role text,
  tone_of_voice text,
  writing_style text,
  forbidden_words text[],
  preferred_words text[],
  max_response_length int,
  qualification_rules jsonb,
  followup_rules jsonb,
  scheduling_rules jsonb,
  human_escalation_rules jsonb,
  opt_out_rules jsonb,
  commercial_rules jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists agent_runs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  lead_id uuid references leads(id),
  conversation_id uuid references conversations(id),
  run_type text,
  input jsonb,
  output jsonb,
  status text,
  error text,
  created_at timestamp default now()
);

create table if not exists learning_insights (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  type text,
  summary text,
  evidence jsonb,
  recommendation text,
  status text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists experiments (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  name text,
  status text,
  hypothesis text,
  variants jsonb,
  metrics jsonb,
  winner_variant text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists integrations (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id),
  type text,
  status text,
  config jsonb,
  encrypted_tokens text,
  last_checked_at timestamp,
  last_error text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create index if not exists leads_company_status_idx on leads(company_id, status);
create index if not exists messages_conversation_created_idx on messages(conversation_id, created_at);
create index if not exists learning_insights_company_status_idx on learning_insights(company_id, status);
create index if not exists knowledge_chunks_embedding_idx on knowledge_chunks using ivfflat (embedding vector_cosine_ops);
