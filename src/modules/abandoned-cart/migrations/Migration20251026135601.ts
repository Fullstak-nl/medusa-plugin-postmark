import { Migration } from '@mikro-orm/migrations';

export class Migration20251026135601 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "reminder_schedule" drop constraint if exists "reminder_schedule_template_id_unique";`);
    this.addSql(`create table if not exists "reminder_schedule" ("id" text not null, "enabled" boolean not null, "template_id" text not null, "delays_iso" text[] not null, "notify_existing" boolean not null default false, "reset_on_cart_update" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reminder_schedule_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_reminder_schedule_template_id_unique" ON "reminder_schedule" (template_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reminder_schedule_deleted_at" ON "reminder_schedule" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reminder_schedule" cascade;`);
  }

}
