DROP INDEX "branch_users_user_id_idx";--> statement-breakpoint
DROP INDEX "branch_users_branch_id_idx";--> statement-breakpoint
DROP INDEX "branches_city_idx";--> statement-breakpoint
DROP INDEX "branches_hours_is_closed_idx";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
DROP INDEX "users_city_idx";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branch_users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branch_users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "branch_users" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branch_users" ALTER COLUMN "branch_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "business_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_contact_info" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_contact_info" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "branches_contact_info" ALTER COLUMN "branch_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_hours" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_hours" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "branches_hours" ALTER COLUMN "branch_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_services" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_services" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "branches_services" ALTER COLUMN "services_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "branches_services" ALTER COLUMN "branches_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "business" ALTER COLUMN "owner_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "owner_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
CREATE INDEX "branch_users_user_id_idx" ON "branch_users" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "branch_users_branch_id_idx" ON "branch_users" USING btree ("branch_id" text_ops);--> statement-breakpoint
CREATE INDEX "branches_city_idx" ON "branches" USING btree ("city" text_ops);--> statement-breakpoint
CREATE INDEX "branches_hours_is_closed_idx" ON "branches_hours" USING btree ("is_closed" bool_ops);--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "users_city_idx" ON "users" USING btree ("city" text_ops);--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_owner_name_unique" UNIQUE("owner_id","name");--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_not_null" CHECK (NOT NULL provider);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_id_not_null" CHECK (NOT NULL provider_id);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_not_null" CHECK (NOT NULL user_id);--> statement-breakpoint
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_user_id_not_null" CHECK (NOT NULL user_id);--> statement-breakpoint
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_branch_id_not_null" CHECK (NOT NULL branch_id);--> statement-breakpoint
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_role_not_null" CHECK (NOT NULL role);--> statement-breakpoint
ALTER TABLE "branch_users" ADD CONSTRAINT "branch_users_created_at_not_null" CHECK (NOT NULL created_at);--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_name_not_null" CHECK (NOT NULL name);--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_business_id_not_null" CHECK (NOT NULL business_id);--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_city_not_null" CHECK (NOT NULL city);--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_address_not_null" CHECK (NOT NULL address);--> statement-breakpoint
ALTER TABLE "branches_contact_info" ADD CONSTRAINT "branches_contact_info_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "branches_contact_info" ADD CONSTRAINT "branches_contact_info_type_not_null" CHECK (NOT NULL type);--> statement-breakpoint
ALTER TABLE "branches_contact_info" ADD CONSTRAINT "branches_contact_info_value_not_null" CHECK (NOT NULL value);--> statement-breakpoint
ALTER TABLE "branches_contact_info" ADD CONSTRAINT "branches_contact_info_branch_id_not_null" CHECK (NOT NULL branch_id);--> statement-breakpoint
ALTER TABLE "branches_hours" ADD CONSTRAINT "branches_hours_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "branches_hours" ADD CONSTRAINT "branches_hours_branch_id_not_null" CHECK (NOT NULL branch_id);--> statement-breakpoint
ALTER TABLE "branches_hours" ADD CONSTRAINT "branches_hours_day_of_week_not_null" CHECK (NOT NULL day_of_week);--> statement-breakpoint
ALTER TABLE "branches_hours" ADD CONSTRAINT "branches_hours_open_time_not_null" CHECK (NOT NULL open_time);--> statement-breakpoint
ALTER TABLE "branches_hours" ADD CONSTRAINT "branches_hours_close_time_not_null" CHECK (NOT NULL close_time);--> statement-breakpoint
ALTER TABLE "branches_hours" ADD CONSTRAINT "branches_hours_is_closed_not_null" CHECK (NOT NULL is_closed);--> statement-breakpoint
ALTER TABLE "branches_services" ADD CONSTRAINT "branches_services_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "branches_services" ADD CONSTRAINT "branches_services_services_id_not_null" CHECK (NOT NULL services_id);--> statement-breakpoint
ALTER TABLE "branches_services" ADD CONSTRAINT "branches_services_branches_id_not_null" CHECK (NOT NULL branches_id);--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_owner_id_not_null" CHECK (NOT NULL owner_id);--> statement-breakpoint
ALTER TABLE "business" ADD CONSTRAINT "business_name_not_null" CHECK (NOT NULL name);--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_name_not_null" CHECK (NOT NULL name);--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_not_null" CHECK (NOT NULL owner_id);--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_name_not_null" CHECK (NOT NULL name);--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_not_null" CHECK (NOT NULL user_id);--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_expires_at_not_null" CHECK (NOT NULL expires_at);--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_not_null" CHECK (NOT NULL token);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_not_null" CHECK (NOT NULL id);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_name_not_null" CHECK (NOT NULL name);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_not_null" CHECK (NOT NULL email);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_city_not_null" CHECK (NOT NULL city);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_created_at_not_null" CHECK (NOT NULL created_at);