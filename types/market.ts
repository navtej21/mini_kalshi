import z from "zod";

export const createMarketSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
});
