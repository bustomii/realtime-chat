create table if not exists rooms (
	id serial primary key,
	name text unique not null
);

create table if not exists messages (
	id bigserial primary key,
	room_id integer not null references rooms(id) on delete cascade,
	username text not null,
	text text not null,
	created_at timestamptz not null default now()
);

create index if not exists idx_messages_room_created on messages(room_id, created_at);

