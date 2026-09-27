CREATE TABLE "admin_login_attempts" (
	"key" text PRIMARY KEY NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"locked_until" text,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"status" text NOT NULL,
	"note" text,
	"changed_by" text DEFAULT 'system' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"occasion" text NOT NULL,
	"event_date" text NOT NULL,
	"city" text NOT NULL,
	"pincode" text NOT NULL,
	"venue" text,
	"guest_count" integer,
	"notes" text,
	"status" text DEFAULT 'AWAITING_REVIEW' NOT NULL,
	"quote_amount" integer,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "bookings_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "booking_status_history" ADD CONSTRAINT "booking_status_history_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_booking_history_booking_id" ON "booking_status_history" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "idx_bookings_phone_reference" ON "bookings" USING btree ("phone","reference");--> statement-breakpoint
CREATE INDEX "idx_bookings_status_created_at" ON "bookings" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_bookings_event_date" ON "bookings" USING btree ("event_date");