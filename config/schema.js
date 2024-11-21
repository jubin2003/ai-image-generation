import { pgTable, uuid, varchar, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  image_url: varchar("image_url").notNull(),
  credits: integer("credits").default(10),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const roomDesigns = pgTable("room_designs", {
  id: uuid("id").primaryKey().defaultRandom(),
  room_type: text("room_type"),
  design_type: text("design_type"),
  additional_requirement: text("additional_requirement"),
  image_url: text("image_url"),
  ai_generated_url: text("ai_generated_url"),
  user_email: varchar("user_email"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
