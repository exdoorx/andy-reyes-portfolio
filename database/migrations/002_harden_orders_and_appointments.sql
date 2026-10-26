-- ============================================================
--  Migration 002 — Policy tightening (run in Supabase SQL editor)
--
--  1. appointments: the owner may ONLY cancel (booked -> cancelled).
--     Every other column is immutable to the row owner.
--  2. orders: total is now derived from order_items by trigger.
--     The client can no longer submit an arbitrary (e.g. zero) total.
-- ============================================================

-- ---------- 1. appointments: owner may only cancel ----------
create or replace function public.appointments_guard_owner_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Ownership must not change.
  if new.user_id is distinct from old.user_id then
    return null; -- deny
  end if;
  -- Only the status column may change, and only booked -> cancelled.
  if new.customer_name is distinct from old.customer_name
     or new.service_id is distinct from old.service_id
     or new.starts_at is distinct from old.starts_at then
    return null;
  end if;
  if new.status not in ('booked', 'cancelled', 'done') then
    return null;
  end if;
  if old.status = 'booked' and new.status not in ('booked', 'cancelled') then
    return null;
  end if;
  if old.status in ('cancelled', 'done') and new.status is distinct from old.status then
    return null; -- terminal states are final
  end if;
  return new;
end;
$$;

drop trigger if exists appointments_owner_update_guard on public.appointments;
create trigger appointments_owner_update_guard
  before update on public.appointments
  for each row execute function public.appointments_guard_owner_update();

drop policy if exists "users cancel own appointments" on public.appointments;
create policy "users cancel own appointments"
  on public.appointments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);  -- WITH CHECK added: owner cannot reassign rows

-- ---------- 2. orders.total derived server-side ----------
create or replace function public.recalc_order_total()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_order_id bigint;
begin
  target_order_id := coalesce(new.order_id, old.order_id);
  update public.orders
     set total = (
       select coalesce(sum(quantity * unit_price), 0)::numeric(10,2)
       from public.order_items
       where order_id = target_order_id
     )
   where id = target_order_id;
  return null; -- after trigger, return value ignored
end;
$$;

create or replace function public.deny_orders_total_write()
returns trigger
language plpgsql
as $$
begin
  if new.total is distinct from old.total then
    -- Allow ONLY the exact server-derived value (written by the recalc trigger).
    if new.total <> (
      select coalesce(sum(quantity * unit_price), 0)::numeric(10,2)
      from public.order_items
      where order_id = new.id
    ) then
      return null; -- deny client price manipulation (e.g. total = 0)
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists order_items_recalc_total on public.order_items;
create trigger order_items_recalc_total
  after insert or update or delete on public.order_items
  for each row execute function public.recalc_order_total();

drop trigger if exists orders_total_write_guard on public.orders;
create trigger orders_total_write_guard
  before update on public.orders
  for each row execute function public.deny_orders_total_write();

-- Notes:
--  * The security definer functions above pin search_path to public (no
--    search_path hijacking) and only ever reference fixed table names —
--    no dynamic SQL anywhere.
--  * Existing policy "users create own orders" still applies; a user with
--    rows in their own order can no longer dictate the stored total.
--  * Execute grants: verify in Supabase that these functions are executable
--    by authenticated/anon roles ONLY as needed by the triggers (triggers
--    run as definer; direct EXECUTE can be revoked:
--      revoke all on function public.appointments_guard_owner_update(),
--                                       public.recalc_order_total(),
--                                       public.deny_orders_total_write()
--    from anon, authenticated, public;
--    )
--  * deny_orders_total_write must also be attached as a trigger on orders
--    (see below) so any future UPDATE policy on orders cannot reintroduce
--    client-controlled totals.
