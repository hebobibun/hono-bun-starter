CREATE TABLE `addresses` (
	`address_id` integer PRIMARY KEY NOT NULL,
	`street` text,
	`city` text,
	`province` text,
	`country` text NOT NULL,
	`postal_code` text,
	`contact_id` integer NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`contact_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`contact_id` integer PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text,
	`email` text,
	`phone` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `email_verifications` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`token` text NOT NULL,
	`expiry` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expiry` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`fullname` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false,
	`password` text NOT NULL,
	`is_locked` integer DEFAULT false,
	`locked_reason` text,
	`locked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);