import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, ownerAc, adminAc } from "better-auth/plugins/organization/access";

const customStatements = {
  organization: ["create", "update", "delete"],
  team: ["create", "update", "delete"],
  project: ["create", "share", "update", "delete"],
  blogPost: ["create", "edit", "publish", "delete"]
} as const;

export const statement = {
  ...defaultStatements,
  ...customStatements
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  team: ["create", "update", "delete"],
  project: ["create", "update", "delete"],
  blogPost: ["create", "edit", "publish", "delete"]
});

export const admin = ac.newRole({
  ...adminAc.statements,
  team: ["create", "update", "delete"],
  project: ["create", "update"]
});

export const member = ac.newRole({
  project: ["create"]
});

export const user = ac.newRole({
  project: ["create"]
});
