create schema if not exists stats;
create table
  stats.users (
    user_id uuid not null,
    provider_id text not null,
    provider text not null,
    provider_username text not null,
    provider_image text null,
    current_match jsonb null,
    current_preset jsonb null,
    constraint users_pkey primary key (user_id)
  ) tablespace pg_default;

  GRANT ALL privileges ON TABLE stats.users TO postgres, anon, authenticated, service_role, dashboard_user;

create table
  stats.presets (
    preset_id bigint generated by default as identity (START WITH 100 INCREMENT BY 1) not null,
    user_id uuid not null default gen_random_uuid (),
    preset_name text not null default 'Preset'::text,
    last_updated timestamp without time zone null,
    left_background character varying null,
    left_bigtext character varying null,
    left_smalltext character varying null,
    right_background character varying null,
    right_bigtext character varying null,
    right_smalltext character varying null,
    mvpbanner_background character varying null,
    mvpbanner_text character varying null,
    mvp_agent character varying null,
    mvp_text character varying null,
    global_text character varying null,
    font character varying null,
    constraint presets_pkey primary key (preset_id),
    constraint presets_preset_id_key unique (preset_id),
    constraint presets_user_id_fkey foreign key (user_id) references stats.users (user_id) on update cascade on delete cascade
  ) tablespace pg_default;

  --Will eventually want to tighten this, for now all is fine
  GRANT ALL privileges ON TABLE stats.presets TO postgres, anon, authenticated, service_role, dashboard_user;


create function stats.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.provider = 'discord' then 
    insert into stats.users (user_id, provider_id, provider, provider_username, provider_image)
    values (new.user_id, new.provider_id, new.provider, new.identity_data->>'full_name', new.identity_data->>'avatar_url');
  end if;
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.identities
  for each row execute procedure stats.handle_new_user();

GRANT ALL ON SCHEMA stats TO postgres, anon, authenticated, service_role, dashboard_user;