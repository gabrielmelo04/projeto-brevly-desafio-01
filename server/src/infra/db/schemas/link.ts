import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const links = pgTable('links', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  originalLink: text('original_link').notNull(),
  shortLink: text('short_link').notNull().unique(),
  views: integer('views').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});