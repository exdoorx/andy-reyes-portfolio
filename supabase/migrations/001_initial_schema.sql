-- ============================================================
--  Andy Reyes Portfolio - database foundation (PostgreSQL / Supabase)
--
--  How to use in Supabase:
--    Dashboard -> SQL Editor -> New query -> paste this file -> Run
--  Works on any PostgreSQL 13+ (gen_random_uuid() is built in).
--  The "auth.users" table and "auth.uid()" exist in Supabase only;
--  on plain Postgres, remove the user_id foreign keys and policies.
-- ============================================================

-- ---------- 1. Portfolio contact form ----------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null check (char_length(name)    between 1 and 100),
  email       text        not null check (char_length(email)   between 3 and 200),
  message     text        not null check (char_length(message) between 1 and 2000),
  created_at  timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Visitors (anon key) may only INSERT. Nobody can read messages with the anon key;
-- you read them in the Supabase dashboard (or with the service role key).
drop policy if exists "anyone can send a message" on public.contact_messages;
create policy "anyone can send a message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- ---------- 2. Food ordering app ----------
create table if not exists public.menu_items (
  id         bigint generated always as identity primary key,
  name       text          not null unique,
  price      numeric(10,2) not null check (price >= 0),
  available  boolean       not null default true
);

create table if not exists public.orders (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users (id) on delete set null,
  status      text not null default 'pending'
              check (status in ('pending','preparing','ready','completed','cancelled')),
  total       numeric(10,2) not null default 0 check (total >= 0),
  created_at  timestamptz not null default now()
);

create table if not exists public.order_items (
  id            bigint generated always as identity primary key,
  order_id      bigint        not null references public.orders (id) on delete cascade,
  menu_item_id  bigint        not null references public.menu_items (id),
  quantity      int           not null check (quantity > 0),
  unit_price    numeric(10,2) not null check (unit_price >= 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.menu_items  enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "menu is public"            on public.menu_items;
drop policy if exists "users see own orders"      on public.orders;
drop policy if exists "users create own orders"   on public.orders;
drop policy if exists "users see own order items" on public.order_items;
drop policy if exists "users add items to own orders" on public.order_items;

create policy "menu is public"            on public.menu_items  for select using (available);
create policy "users see own orders"      on public.orders      for select using (auth.uid() = user_id);
create policy "users create own orders"   on public.orders      for insert with check (auth.uid() = user_id);
create policy "users see own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "users add items to own orders" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- ---------- 3. Appointment booking ----------
create table if not exists public.services (
  id        bigint generated always as identity primary key,
  name      text not null unique,
  minutes   int  not null default 60 check (minutes > 0)
);

create table if not exists public.appointments (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users (id) on delete set null,
  service_id    bigint      not null references public.services (id),
  customer_name text        not null,
  starts_at     timestamptz not null,
  status        text        not null default 'booked' check (status in ('booked','cancelled','done')),
  created_at    timestamptz not null default now()
);

-- Prevents double booking: one active appointment per service per time slot.
create unique index if not exists appointments_no_double_booking
  on public.appointments (service_id, starts_at)
  where status = 'booked';

alter table public.services     enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "services are public"         on public.services;
drop policy if exists "users see own appointments"  on public.appointments;
drop policy if exists "users book own appointments" on public.appointments;
drop policy if exists "users cancel own appointments" on public.appointments;

create policy "services are public"         on public.services     for select using (true);
create policy "users see own appointments"  on public.appointments for select using (auth.uid() = user_id);
create policy "users book own appointments" on public.appointments for insert with check (auth.uid() = user_id);
create policy "users cancel own appointments" on public.appointments for update using (auth.uid() = user_id);

-- ---------- 4. Study planner ----------
create table if not exists public.study_tasks (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  priority    text not null default 'Medium' check (priority in ('High','Medium','Low')),
  done        boolean not null default false,
  due_date    date,
  created_at  timestamptz not null default now()
);

create index if not exists study_tasks_user_idx on public.study_tasks (user_id, done);

alter table public.study_tasks enable row level security;
drop policy if exists "users manage own tasks" on public.study_tasks;
create policy "users manage own tasks" on public.study_tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Sample data ----------
insert into public.menu_items (name, price) values
  ('Chicken Adobo Rice', 120), ('Pork Sinigang', 150), ('Pancit Canton', 95),
  ('Halo-halo', 85), ('Iced Tea', 45)
on conflict (name) do nothing;

insert into public.services (name, minutes) values
  ('General check-up', 30), ('Dental cleaning', 45), ('Eye exam', 30), ('Consultation', 30)
on conflict do nothing;

-- ---------- Handy queries to practice SQL ----------
-- Top selling dishes:
--   select m.name, sum(oi.quantity) as sold
--   from order_items oi join menu_items m on m.id = oi.menu_item_id
--   group by m.name order by sold desc;
--
-- Free vs booked slots for a day:
--   select s.name, a.starts_at from appointments a
--   join services s on s.id = a.service_id
--   where a.status = 'booked' and a.starts_at::date = current_date;
