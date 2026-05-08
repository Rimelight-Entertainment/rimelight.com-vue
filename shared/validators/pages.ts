import { z } from "zod";

const BaseRules = z.object({
  id: z.uuid(),
});

const fields = Object.keys(BaseRules.shape) as [keyof typeof BaseRules.shape];

export const CreateRules = BaseRules.omit({ id: true });

export const ListRules = z.object({
  keywords: z.string().optional(),
  limit: z.coerce.number().int().min(1).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sortBy: z.enum(fields).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  include: z.enum(fields).optional(),
});

export const ReadRules = z.object({
  id: z.uuid(),
  include: z.enum(fields).optional(),
});

export const UpdateRules = BaseRules;

export const DeleteRules = z.object({
  id: z.uuid(),
});
