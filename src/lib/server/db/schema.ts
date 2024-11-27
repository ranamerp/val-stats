import { time } from 'drizzle-orm/mysql-core';
import { pgTable, serial, text, integer, uuid, timestamp, json, char} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});

export const presets = pgTable('presets', {
	preset_id: serial('id').primaryKey(),
	user_id: uuid('id').notNull(),
	present_name: text("preset_name").notNull(),
	last_updated: timestamp("last_updated"),
	leftbgcolor: char("left_background", {length: 7}),
	leftbigtextcolor: char("left_bigtext", {length: 7}),
	leftsmalltextcolor: char("left_smalltext", {length: 7}),
	rightbgcolor: char("right_background", {length: 7}),
	rightbigtextcolor: char("right_bigtext", {length: 7}),
	rightsmalltextcolor:  char("right_smalltext", {length: 7}),

	mvpbannerbgcolor: char("mvpbanner_background", {length: 7}),
	mvpbannertextcolor:  char("mvpbanner_text", {length: 7}),
	mvpagentcolor:  char("mvp_agent", {length: 7}),
	mvptextcolor: char("mvp_text", {length: 7}),
	globaltextcolor: char("global_text", {length: 7})
});
