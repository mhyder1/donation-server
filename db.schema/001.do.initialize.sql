begin;

create table "user" (
  "id" integer primary key generated by default as identity,
  "label" text not null,
  "username" text unique not null
);

create table "auth" (
  "id" integer primary key generated by default as identity,
  "uid" integer references "user"("id") not null,
  "method" integer not null,
  "label" text not null default '',
  "data" text not null
);

commit;
