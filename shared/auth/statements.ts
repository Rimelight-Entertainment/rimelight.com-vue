export const statement = {
  organization: ["update", "delete", "create"],
  member: ["update", "delete", "create"],
  invitation: ["create", "cancel"],
  team: ["update", "delete", "create"],
  ac: ["update", "delete", "read", "create"],
  admin: ["access"],
  project: ["create", "share", "update", "delete"],
  blogPost: ["create", "edit", "publish", "delete"],
  document: ["create", "edit", "publish", "delete"],
  asset: ["view", "upload", "edit", "delete"],
} as const;
