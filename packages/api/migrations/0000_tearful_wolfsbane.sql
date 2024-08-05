CREATE TABLE IF NOT EXISTS "item" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"type" text NOT NULL,
	"title" text,
	"content" text,
	"linkImage" text,
	"description" text,
	"url" text,
	"deletedAt" timestamp (3),
	"spaceId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "itemTag" (
	"createdAt" timestamp (3) NOT NULL,
	"itemId" text NOT NULL,
	"tagId" text NOT NULL,
	CONSTRAINT "itemTag_itemId_tagId_pk" PRIMARY KEY("itemId","tagId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loginCode" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "membership" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"userId" text NOT NULL,
	"spaceId" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "space" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"spaceId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"email" text NOT NULL,
	"avatar" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_spaceId_space_id_fk" FOREIGN KEY ("spaceId") REFERENCES "public"."space"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "itemTag" ADD CONSTRAINT "itemTag_itemId_item_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."item"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "itemTag" ADD CONSTRAINT "itemTag_tagId_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membership" ADD CONSTRAINT "membership_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membership" ADD CONSTRAINT "membership_spaceId_space_id_fk" FOREIGN KEY ("spaceId") REFERENCES "public"."space"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tag" ADD CONSTRAINT "tag_spaceId_space_id_fk" FOREIGN KEY ("spaceId") REFERENCES "public"."space"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "item_spaceId_idx" ON "item" USING btree ("spaceId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "loginCode_email_idx" ON "loginCode" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "membership_userId_idx" ON "membership" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "membership_spaceId_idx" ON "membership" USING btree ("spaceId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tag_spaceId_idx" ON "tag" USING btree ("spaceId");