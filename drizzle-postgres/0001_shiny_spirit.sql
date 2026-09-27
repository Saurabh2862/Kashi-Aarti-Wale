CREATE TABLE "gallery_videos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"ceremony" text DEFAULT 'Ganga Aarti' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"legacy_src" text,
	"asset_id" text,
	"cover_id" text,
	"active" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"kind" text NOT NULL,
	"purpose" text NOT NULL,
	"review_id" text,
	"status" text DEFAULT 'reserved' NOT NULL,
	"bytes" integer,
	"format" text,
	"version" integer,
	"created_at" text NOT NULL,
	CONSTRAINT "media_assets_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ceremony" text NOT NULL,
	"rating" integer NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"token_hash" text NOT NULL,
	"attachment_kinds" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"consent_at" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "submission_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"used" integer DEFAULT 0 NOT NULL,
	"expires_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_videos" ADD CONSTRAINT "gallery_videos_asset_id_media_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."media_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_videos" ADD CONSTRAINT "gallery_videos_cover_id_media_assets_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_assets_review" ON "media_assets" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "idx_reviews_status_created" ON "reviews" USING btree ("status","created_at");