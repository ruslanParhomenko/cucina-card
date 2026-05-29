import { z } from "zod";
import { CATEGORY_PRODUCT, CATEGORY_UNIT } from "./constants";

export const unitEnum = z.enum(
  CATEGORY_UNIT.map((u) => u.value) as ["kg", "l", "pcs"],
  {
    message: "Неверная единица измерения",
  },
);

export const categoryEnum = z.enum(
  CATEGORY_PRODUCT.map((u) => u.value) as [
    "vegetables_fruits",
    "meat",
    "poultry",
    "fish_seafood",
    "dairy",
    "eggs",
    "grocery",
    "fats_oils",
    "spices",
    "sauces_canned",
    "frozen",
    "bakery",
    "confectionery",
  ],
  {
    message: "Неверная категория продукта",
  },
);

export const productSchema = z.object({
  name: z.string(),
  coefficient: z
    .string()
    .regex(
      /^\d+(\.\d+)?$/,
      "Коэффициент должен содержать только цифры и точку",
    ),
  unit: unitEnum,
  category: categoryEnum,
  id: z.string().regex(/^\d+$/, "Ключ должен содержать только цифры"),
});

export type ProductType = z.infer<typeof productSchema>;

export const productDefaultValues = {
  name: "",
  coefficient: "",
  unit: undefined,
  category: undefined,
  id: "",
};
