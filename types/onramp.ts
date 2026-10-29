import z from "zod";

export const onrampSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int().positive(),
});
