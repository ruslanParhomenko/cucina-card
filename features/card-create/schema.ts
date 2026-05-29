import { z } from "zod";

export const recipeItemSchema = z.object({
  name: z.string().default(""),
  quantity: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Количество должно содержать только цифры и точку")
    .default("0"),
  coefficient: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Коэффициент должен содержать только цифры и точку")
    .default("1"),
  unit: z.string().default(""),
  nameId: z.string().default(""),
  productId: z.number().optional(),
});

export const recipeItemDefaultValues = {
  name: "",
  quantity: "0",
  coefficient: "1",
  unit: "",
  nameId: "",
};

export const calculationCardSchema = z.object({
  portion: z.string().optional().default("1"),
  id: z
    .string()
    .regex(/^\d+$/, "CardId должен содержать только цифры")
    .optional()
    .default(""),

  name: z.string().optional().default(""),
  unit: z.string().optional().default(""),
  category: z.string().optional().default(""),

  weight: z
    .string()
    .regex(
      /^(kg|\d+(\/\d+)*)$/,
      'Вес должен содержать только цифры, формат 1/2 или значение "kg"',
    )
    .optional()
    .default(""),

  expirationPeriod: z.string().optional().default(""),
  description: z.string().optional().default(""),

  recipe: z.array(recipeItemSchema).optional().default([]),
});

export const calculationCardDefaultValues = {
  id: "",
  name: "",
  unit: "",
  category: "",
  weight: "",
  expirationPeriod: "",
  description: "",
  portion: "1",

  recipe: [
    {
      name: "",
      quantity: "",
      coefficient: "1",
      unit: "",
      nameId: "",
    },
  ],
};

export type RecipeItemType = z.infer<typeof recipeItemSchema>;

export type CalculationCardType = z.output<typeof calculationCardSchema>;
export type CalculationCardFormValues = z.input<typeof calculationCardSchema>;
