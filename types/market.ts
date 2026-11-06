import z from "zod";

export const createMarketSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
});


export const splitSchema = z.object({
  userId: z.string().min(1),
  marketId: z.string().min(1),
  quantity: z.number().int().positive(),
});


export const mergeSchema=z.object({
  userId:z.string().min(1),
  marketId:z.string().min(1),
  quantity:z.number().int().positive()
})