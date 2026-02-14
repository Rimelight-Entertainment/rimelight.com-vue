import { z } from "zod";

const BaseRules = z.object({
  id: z.uuid(),
});

const fields = Object.keys(BaseRules.shape) as [keyof typeof BaseRules.shape];

export const CreateRules = BaseRules.omit({ id: true });

export const ListRules = z.object({
  keywords: z.string().optional(),
  limit: z.coerce.number().int().positive().default(10).optional(),
  offset: z.coerce.number().int().nonnegative().default(0).optional(),
  sortBy: z.enum(fields).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  include: z.enum(fields).optional(),
});

export const ReadRules = z.object({
  id: z.uuid(),
  include: z.enum(fields).optional,
});

export const UpdateRules = BaseRules;

export const DeleteRules = z.object({
  id: z.uuid(),
});
