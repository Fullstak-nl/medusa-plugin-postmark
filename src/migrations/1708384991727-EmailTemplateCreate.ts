import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailTemplateCreate1708384991727 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = NOW();
                    RETURN NEW;
                END;
            $$ language 'plpgsql';

            CREATE OR REPLACE FUNCTION to_kebab_case(text) 
                RETURNS text AS $$
                BEGIN
                    RETURN regexp_replace(lower($1), '[\\s_]', '-', 'g');
                END;
            $$ LANGUAGE plpgsql IMMUTABLE STRICT;

            CREATE TYPE email_template_type AS ENUM ('standard', 'layout');

            CREATE TYPE email_template_notification_event_type AS ENUM (
                'unset',
                'order.placed',
                'order.cancelled',
                'order.shipment_created',
                'customer.created',
                'customer.password_reset',
                'user.created',
                'user.password_reset',
                'auth.password_reset',
                'auth.verify_account',
                'activity.inactive_user',
                'activity.inactive_customer'
            );

            CREATE TABLE IF NOT EXISTS "email_template" (
                "id" varchar(100) PRIMARY KEY,
                "postmark_id" integer UNIQUE,

                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "deleted_at" TIMESTAMP, 

                "name" varchar(100) NOT NULL, 
                "alias" varchar(100) GENERATED ALWAYS AS (to_kebab_case(name)) STORED, 
                "html_body" text NOT NULL, 
                "json_template" jsonb NOT NULL,
                "subject" varchar(400) NOT NULL, 
                "type" email_template_type NOT NULL DEFAULT 'standard', 
                "layout" varchar(100) NULL,
                "notification_event" email_template_notification_event_type NOT NULL DEFAULT 'unset'
            );

            CREATE OR REPLACE TRIGGER update_email_template_updated_at 
                BEFORE UPDATE ON "email_template" 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

            CREATE UNIQUE INDEX IF NOT EXISTS "email_template__alias" ON "email_template" ("alias");
            CREATE UNIQUE INDEX IF NOT EXISTS "email_template__event" ON "email_template" ("notification_event") 
                WHERE "notification_event" != 'unset';
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "email_template" CASCADE;
            DROP FUNCTION IF EXISTS to_kebab_case;
            DROP FUNCTION IF EXISTS update_updated_at_column;
            DROP TYPE IF EXISTS email_template_type;
            DROP TYPE IF EXISTS email_template_notification_event_type;
        `);
    }
}
