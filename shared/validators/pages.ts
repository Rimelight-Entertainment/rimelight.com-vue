import * as v from "valibot";

const BaseRules = v.object({
  id: v.pipe(v.string(), v.uuid()),
});

const fields = Object.keys(BaseRules.entries) as [keyof typeof BaseRules.entries];

export const CreateRules = v.omit(BaseRules, ["id"]);

export const ListRules = v.object({
  keywords: v.optional(v.string()),
  limit: v.optional(v.pipe(v.unknown(), v.toNumber(), v.integer(), v.minValue(1)), 10),
  offset: v.optional(v.pipe(v.unknown(), v.toNumber(), v.integer(), v.minValue(0)), 0),
  sortBy: v.optional(v.picklist(fields)),
  sortOrder: v.optional(v.picklist(["asc", "desc"]), "desc"),
  include: v.optional(v.picklist(fields)),
});

export const ReadRules = v.object({
  id: v.pipe(v.string(), v.uuid()),
  include: v.optional(v.picklist(fields)),
});

export const UpdateRules = BaseRules;

export const DeleteRules = v.object({
  id: v.pipe(v.string(), v.uuid()),
});
