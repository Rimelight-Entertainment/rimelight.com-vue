import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, ownerAc } from "better-auth/plugins/organization/access";
import { statement } from "./statements";

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  admin: ["access"],
  team: ["create", "update", "delete"],
  project: ["create", "update", "delete"],
  document: ["create", "edit", "publish", "delete"],
  blogPost: ["create", "edit", "publish", "delete"],
  asset: ["view", "upload", "edit", "delete"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  admin: ["access"],
  team: ["create", "update", "delete"],
  document: ["create", "edit", "publish", "delete"],
  blogPost: ["create", "edit", "publish", "delete"],
  project: ["create", "update"],
  asset: ["view", "upload", "edit", "delete"],
});

export const member = ac.newRole({
  project: ["create"],
  asset: ["view"],
});

export const user = ac.newRole({
  project: ["create"],
  asset: ["view"],
});
