-- Create Analysis History Table
create table if not exists analysis_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamptz default now(),
  type text check (type in ('premium_analysis', 'gacha', 'name_search')),
  input_data jsonb, -- Stores surname, birthdate, focus, etc.
  result_data jsonb -- Stores the generated names and grades
);

-- Enable RLS
alter table analysis_history enable row level security;

-- Policies
create policy "Users can insert their own history"
  on analysis_history for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own history"
  on analysis_history for select
  using (auth.uid() = user_id);
