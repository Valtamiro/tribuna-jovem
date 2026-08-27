import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const editions = mysqlTable("editions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  issueLabel: varchar("issueLabel", { length: 100 }).notNull(),
  description: text("description").notNull(),
  documentUrl: text("documentUrl"),
  coverUrl: text("coverUrl"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  editionId: int("editionId"),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  authorName: varchar("authorName", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  coverUrl: text("coverUrl"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const interviews = mysqlTable("interviews", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  interviewee: varchar("interviewee", { length: 180 }).notNull(),
  presenter: varchar("presenter", { length: 180 }).notNull(),
  description: text("description").notNull(),
  transcript: text("transcript"),
  videoUrl: text("videoUrl"),
  coverUrl: text("coverUrl"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const mediaItems = mysqlTable("mediaItems", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  assetType: mysqlEnum("assetType", ["image", "document"]).notNull(),
  url: text("url").notNull(),
  storageKey: varchar("storageKey", { length: 512 }),
  mimeType: varchar("mimeType", { length: 120 }),
  published: boolean("published").default(false).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
