import { relations } from "drizzle-orm"
import {
  primaryKey,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { ulid } from "ulidx"

const defaultRandomId = () => ulid().toLowerCase()

const defaultNow = () => new Date()

const dateColumn = (name: `${string}At`) => timestamp(name, { precision: 3 })

const dateColumnWithDefault = (name: `${string}At`) =>
  dateColumn(name).$defaultFn(defaultNow).notNull()

export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(defaultRandomId),
  createdAt: dateColumnWithDefault("createdAt"),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
})

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  memberships: many(membership),
}))

export const loginCode = pgTable(
  "loginCode",
  {
    id: text("id").primaryKey().$defaultFn(defaultRandomId),
    createdAt: dateColumnWithDefault("createdAt"),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: dateColumnWithDefault("expiresAt"),
  },
  (t) => ({
    email_idx: index("loginCode_email_idx").on(t.email),
  }),
)

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(defaultRandomId),
    createdAt: dateColumnWithDefault("createdAt"),
    name: text("name").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
  },
  (t) => ({
    userId_idx: index("session_userId_idx").on(t.userId),
  }),
)

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const space = pgTable(
  "space",
  {
    id: text("id").primaryKey().$defaultFn(defaultRandomId),
    createdAt: dateColumnWithDefault("createdAt"),
    name: text("name").notNull(),
  },
  (t) => ({}),
)

export const membership = pgTable(
  "membership",
  {
    id: text("id").primaryKey().$defaultFn(defaultRandomId),
    createdAt: dateColumnWithDefault("createdAt"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    spaceId: text("spaceId")
      .notNull()
      .references(() => space.id, { onDelete: "cascade" }),
    role: text("role").$type<"admin">().notNull(),
  },
  (t) => ({
    userId_idx: index("membership_userId_idx").on(t.userId),
    spaceId_idx: index("membership_spaceId_idx").on(t.spaceId),
  }),
)

export const membershipRelations = relations(membership, ({ one }) => ({
  user: one(user, {
    fields: [membership.userId],
    references: [user.id],
  }),
  space: one(space, {
    fields: [membership.spaceId],
    references: [space.id],
  }),
}))

export const item = pgTable(
  "item",
  {
    id: text("id").primaryKey().$defaultFn(defaultRandomId),
    createdAt: dateColumnWithDefault("createdAt"),
    type: text("type").$type<"link" | "image" | "note">().notNull(),
    title: text("title"),
    content: text("content"),
    linkImage: text("linkImage"),
    description: text("description"),
    url: text("url"),
    deletedAt: dateColumn("deletedAt"),
    spaceId: text("spaceId")
      .notNull()
      .references(() => space.id, { onDelete: "cascade" }),
  },
  (t) => ({
    spaceId_idx: index("item_spaceId_idx").on(t.spaceId),
  }),
)

export const itemRelations = relations(item, ({ one, many }) => ({
  space: one(space, {
    fields: [item.spaceId],
    references: [space.id],
  }),
  itemTags: many(itemTag),
}))

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey().$defaultFn(defaultRandomId),
    name: text("name").notNull(),
    createdAt: dateColumnWithDefault("createdAt"),
    spaceId: text("spaceId")
      .notNull()
      .references(() => space.id, { onDelete: "cascade" }),
  },
  (t) => ({
    spaceId_idx: index("tag_spaceId_idx").on(t.spaceId),
  }),
)

export const tagRelations = relations(tag, ({ one, many }) => ({
  space: one(space, {
    fields: [tag.spaceId],
    references: [space.id],
  }),
  itemTags: many(itemTag),
}))

export const itemTag = pgTable(
  "itemTag",
  {
    createdAt: dateColumnWithDefault("createdAt"),
    itemId: text("itemId")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    tagId: text("tagId")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.tagId] }),
  }),
)

export const itemTagRelations = relations(itemTag, ({ one }) => ({
  item: one(item, {
    fields: [itemTag.itemId],
    references: [item.id],
  }),
  tag: one(tag, {
    fields: [itemTag.tagId],
    references: [tag.id],
  }),
}))
