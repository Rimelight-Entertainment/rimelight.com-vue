import { relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { UserAvailability } from "~/types";

const id = uuid("id")
  .default(sql`uuidv7()`)
  .notNull();

const timestamps = {
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

// ============================================================================
// Core Auth Tables
// ============================================================================

export const user = pgTable(
  "user",
  {
    id: id.primaryKey(),
    name: text("name").notNull(),
    tag: text("tag").notNull().default("0000"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    availability: text("availability").$type<UserAvailability>().notNull().default("available"),
    status: text("status"),
    ...timestamps,
    role: text("role"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
    publicKey: text("public_key"),
    encryptedPrivateKey: text("encrypted_private_key"),
    derivationSalt: text("derivation_salt"),
  },
  (table) => ({
    nameTagUnique: uniqueIndex("user_name_tag_unique").on(table.name, table.tag),
  }),
);

export const session = pgTable(
  "session",
  {
    id: id.primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ...timestamps,
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
    activeOrganizationId: uuid("active_organization_id"),
    activeTeamId: uuid("active_team_id"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: id.primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: id.primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimit = pgTable("rate_limit", {
  id: id.primaryKey(),
  key: text("key"),
  count: integer("count"),
  lastRequest: bigint("last_request", { mode: "number" }),
});

// ============================================================================
// Organization Tables
// ============================================================================

export const organization = pgTable("organization", {
  id: id.primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  ...timestamps,
  metadata: text("metadata"),
});

export const member = pgTable(
  "member",
  {
    id: id.primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    ...timestamps,
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = pgTable(
  "invitation",
  {
    id: id.primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ...timestamps,
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const team = pgTable(
  "team",
  {
    id: id.primaryKey(),
    name: text("name").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references((): AnyPgColumn => team.id, {
      onDelete: "cascade",
    }),
    ...timestamps,
    metadata: text("metadata"),
  },
  (table) => [index("team_organizationId_idx").on(table.organizationId)],
);

export const teamMember = pgTable("team_member", {
  id: id.primaryKey(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  ...timestamps,
});

// ============================================================================
// Note Tables (shared feature)
// ============================================================================

export const todo = pgTable("todo", {
  id: id.primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  isArchived: boolean("is_archived").default(false).notNull(),
  ...timestamps,
});

export const note = pgTable("note", {
  id: id.primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content"),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  ...timestamps,
});

export const noteLabel = pgTable("noteLabel", {
  id: id.primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ...timestamps,
});

export const note_noteLabel = pgTable(
  "note_noteLabel",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => note.id, { onDelete: "cascade" }),
    labelId: uuid("label_id")
      .notNull()
      .references(() => noteLabel.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.labelId] }),
  }),
);

// ============================================================================
// Relations
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  members: many(member),
  invitations: many(invitation),
  notes: many(note),
  noteLabels: many(noteLabel),
  todos: many(todo),
  teamMembers: many(teamMember),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  teams: many(team),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
  parentTeam: one(team, {
    fields: [team.parentId],
    references: [team.id],
    relationName: "subteams",
  }),
  subteams: many(team, { relationName: "subteams" }),
  members: many(teamMember),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
}));

export const noteRelations = relations(note, ({ one, many }) => ({
  user: one(user, {
    fields: [note.userId],
    references: [user.id],
  }),
  noteLabels: many(note_noteLabel),
}));

export const noteLabelRelations = relations(noteLabel, ({ one, many }) => ({
  user: one(user, {
    fields: [noteLabel.userId],
    references: [user.id],
  }),
  noteLabels: many(note_noteLabel),
}));

export const note_noteLabelRelations = relations(note_noteLabel, ({ one }) => ({
  note: one(note, {
    fields: [note_noteLabel.noteId],
    references: [note.id],
  }),
  label: one(noteLabel, {
    fields: [note_noteLabel.labelId],
    references: [noteLabel.id],
  }),
}));

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user, {
    fields: [todo.userId],
    references: [user.id],
  }),
}));

// ============================================================================
// Type Exports
// ============================================================================

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Organization = typeof organization.$inferSelect;
export type Member = typeof member.$inferSelect;
export type Invitation = typeof invitation.$inferSelect;
export type Team = typeof team.$inferSelect;
export type TeamMember = typeof teamMember.$inferSelect;
export type Note = typeof note.$inferSelect & {
  labels: Array<
    typeof note_noteLabel.$inferSelect & {
      label: typeof noteLabel.$inferSelect;
    }
  >;
};
export type Label = typeof noteLabel.$inferSelect;
export type Todo = typeof todo.$inferSelect;
