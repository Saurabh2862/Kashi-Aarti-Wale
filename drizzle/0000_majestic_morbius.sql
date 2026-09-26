CREATE TABLE `booking_status_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` integer NOT NULL,
	`status` text NOT NULL,
	`note` text,
	`changed_by` text DEFAULT 'system' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_booking_history_booking_id` ON `booking_status_history` (`booking_id`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`occasion` text NOT NULL,
	`event_date` text NOT NULL,
	`city` text NOT NULL,
	`pincode` text NOT NULL,
	`venue` text,
	`guest_count` integer,
	`notes` text,
	`status` text DEFAULT 'AWAITING_REVIEW' NOT NULL,
	`quote_amount` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_reference_unique` ON `bookings` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_bookings_phone_reference` ON `bookings` (`phone`,`reference`);--> statement-breakpoint
CREATE INDEX `idx_bookings_status_created_at` ON `bookings` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_bookings_event_date` ON `bookings` (`event_date`);--> statement-breakpoint
PRAGMA optimize;
