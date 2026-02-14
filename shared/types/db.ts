import { user } from "../../server/db/schema";

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type UserForm = Pick<NewUser, "name" | "email">;
export type PublicUser = Omit<User, "">;
