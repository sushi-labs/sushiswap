-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "chain" (
	"chainId" bigint PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chainId" bigint NOT NULL,
	"address" varchar(42) NOT NULL,
	"symbol" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"decimals" integer NOT NULL,
	"addedBy" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "token_chainId_address_unique" UNIQUE("chainId","address")
);

*/