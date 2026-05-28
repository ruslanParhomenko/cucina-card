"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, PlusIcon } from "lucide-react";

import TextInput from "@/components/input/text-input";
import NumericInput from "@/components/input/numeric-input";
import SelectInput from "@/components/input/select-input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { FormWrapper } from "@/components/wrapper/form-wrapper";

import {
  calculationCardDefaultValues,
  CalculationCardFormValues,
  calculationCardSchema,
  CalculationCardType,
} from "./schema";
import { ProductType } from "../product/schema";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import {
  createCard,
  deleteCard,
  updateCard,
} from "@/app/actions/cards/cards-action";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import SelectFieldWithSearch from "@/components/input/select-with-search";

import { cn } from "@/lib/utils";
import { CATEGORY } from "./constants";
import { useSession } from "next-auth/react";

import { useEdit } from "@/providers/edit-provider";

export default function CardForm({
  dataProduct,
  dataCard,
}: {
  dataProduct: ProductType[];
  dataCard?: CalculationCardType;
}) {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();
  const isAdmin = session.data?.user?.role === "ADMIN";

  const idCard = dataCard && dataCard?.id?.toString();

  const { isEdit, setIsEdit, registerReset, registerDelete } = useEdit();

  const disabled = !isEdit || !isAdmin;

  const STORAGE_KEY = "add-card";

  const [dataOptions, setDataOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const form = useForm<CalculationCardFormValues>({
    resolver: zodResolver(calculationCardSchema),
    defaultValues: calculationCardDefaultValues,
    mode: "onBlur",
  });

  const { isLoaded, resetForm } = useLocalStorageForm(form, STORAGE_KEY);

  const category =
    useWatch({
      control: form.control,
      name: "category",
    }) || "";

  const portion =
    useWatch({
      control: form.control,
      name: "portion",
    }) || 1;

  const recipe =
    useWatch({
      control: form.control,
      name: "recipe",
    }) || [];

  const weight =
    useWatch({
      control: form.control,
      name: "weight",
    }) || 0;

  const RecipeArray = useFieldArray({
    control: form.control,
    name: "recipe",
  });

  const computedValues = useMemo(() => {
    let totalNeto = 0;
    let totalBruto = 0;
    let totalBruto_2 = 0;
    let totalNeto_2 = 0;

    const values = recipe.map((r) => {
      const product = dataProduct.find((p) => p.id?.toString() === r.nameId);

      const weight = Number(r.quantity || 0);
      const coefficient = Number(product?.coefficient || 1);

      const neto = weight * coefficient;
      const bruto2 = weight * +portion;
      const neto2 = weight * +portion * coefficient;

      totalBruto += weight;
      totalNeto += neto;
      totalBruto_2 += bruto2;
      totalNeto_2 += neto2;

      return { neto, bruto2, neto2, product };
    });

    return {
      values,
      totals: { totalNeto, totalBruto, totalNeto_2, totalBruto_2 },
    };
  }, [recipe, portion, dataProduct]);

  const onSubmit: SubmitHandler<CalculationCardType> = async (data) => {
    const { id, ...rest } = data;
    try {
      if (!idCard) {
        await createCard(data);
        toast.success("Продукт успешно создан");
      } else {
        await updateCard(id, rest);
        toast.success("Продукт успешно обновлен");
      }

      resetForm(calculationCardDefaultValues);
    } catch (error) {
      if (error instanceof Error && error.message === "CARD_ID_EXISTS") {
        toast.error("Карта с таким номером уже существует");

        form.setError("id", {
          type: "manual",
          message: "Этот номер карты уже используется",
        });

        return;
      }

      toast.error("Ошибка сохранения продукта");
    }
    setIsEdit(false);
    router.back();
  };

  useEffect(() => {
    if (!dataProduct) return;

    setDataOptions(
      dataProduct.map((item) => ({
        label: item.name,
        value: item.id?.toString() || "",
      })),
    );
  }, [dataProduct]);

  useEffect(() => {
    if (dataCard) {
      form.reset(dataCard);
      RecipeArray.replace(dataCard.recipe);
    }
    if (idCard) {
      registerDelete(async () => {
        await deleteCard(idCard);
      });
    }
  }, [dataCard]);

  useEffect(() => {
    registerReset(() => form.reset(calculationCardDefaultValues));
  }, []);
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        ...loading
      </div>
    );
  }

  const reset = () => {
    resetForm(calculationCardDefaultValues);
  };

  return (
    <FormWrapper form={form} onSubmit={onSubmit} id={pathname}>
      <div className="flex flex-col h-[88dvh] p-2 print:p-8">
        <div className="flex flex-col gap-1">
          <TextInput
            fieldLabel="Тех карта:"
            fieldName="id"
            orientation="horizontal"
            classNameInput="h-5! border-0 shadow-none border-b rounded-none"
            disabled={disabled}
          />

          <SelectInput
            fieldLabel="Категория продукта:"
            fieldName="category"
            orientation="horizontal"
            options={CATEGORY}
            classNameSelect="border-0 shadow-none border-b rounded-none text-black! h-5! [&>svg]:hidden"
            disabled={disabled}
          />

          <TextInput
            fieldLabel="Наименование"
            fieldName="name"
            orientation="horizontal"
            classNameInput="h-5! border-0 shadow-none border-b rounded-none font-bold"
            disabled={disabled}
          />

          <TextInput
            fieldLabel="Срок хранения:"
            fieldName="expirationPeriod"
            orientation="horizontal"
            classNameInput="h-5! border-0 shadow-none border-b rounded-none"
            disabled={disabled}
          />

          <TextInput
            fieldLabel="Вес:"
            fieldName="weight"
            orientation="horizontal"
            classNameInput="h-5! border-0 shadow-none border-b rounded-none"
            disabled={disabled}
          />
        </div>
        <div className="flex-1 mt-8">
          <Table className="md:table-fixed table-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="w-6 md:w-8" />
                <TableHead className="w-30 md:w-60" />
                <TableHead className="w-6 md:w-12" />
                <TableHead colSpan={2} className="text-center">
                  1 {category === "pf" || weight === "kg" ? "кг" : "порция"}
                </TableHead>
                <TableHead colSpan={2} className="text-center">
                  <div className="flex justify-center items-center gap-3">
                    <NumericInput
                      fieldName="portion"
                      className="h-full border-0 shadow-none border-b rounded-none"
                      disabled={disabled}
                    />
                    {category === "pf" || weight === "kg" ? "кг" : "порция"}
                  </div>
                </TableHead>
                <TableHead className="w-14" />
              </TableRow>

              <TableRow>
                <TableHead className="w-8 border-r"></TableHead>
                <TableHead className="text-center">продукт</TableHead>
                <TableHead className="border-x w-16 text-center">ед</TableHead>
                <TableHead className="border-x w-30 text-center">
                  брутто
                </TableHead>
                <TableHead className="border-x w-30 text-center">
                  нетто
                </TableHead>
                <TableHead className="border-x w-30 text-center">
                  брутто
                </TableHead>
                <TableHead className="border-x w-30 text-center">
                  нетто
                </TableHead>
                <TableHead className="w-18" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {RecipeArray.fields.map((field, idx) => {
                const { neto, bruto2, neto2, product } =
                  computedValues.values[idx] || {};

                const isLast = idx === RecipeArray.fields.length - 1;
                const isOnlyOne = RecipeArray.fields.length === 1;

                return (
                  <TableRow key={field.id} className="[&>td]:py-0">
                    <TableCell className="border-r text-start px-1 text-xs">
                      {idx + 1}
                    </TableCell>

                    <TableCell className="truncate">
                      <SelectFieldWithSearch
                        options={dataOptions}
                        fieldName={`recipe.${idx}.nameId`}
                        onValueChange={(value) => {
                          const product = dataProduct.find(
                            (item) => item.id?.toString() === value,
                          );

                          form.setValue(
                            `recipe.${idx}.name`,
                            product?.name ?? "",
                          );
                          form.setValue(
                            `recipe.${idx}.unit`,
                            product?.unit ?? "",
                          );
                        }}
                        className="border-0 h-7!"
                        disabled={disabled}
                      />
                    </TableCell>

                    <TableCell className="border-x">
                      <input
                        {...form.register(`recipe.${idx}.unit`)}
                        className="text-center w-full h-7 text-xs"
                        disabled={disabled}
                      />
                    </TableCell>

                    <TableCell className="border-x md:hidden">
                      <NumericInput
                        fieldName={`recipe.${idx}.quantity`}
                        className="border-0 shadow-none rounded-none w-full h-7 text-center p-0"
                        disabled={disabled}
                        floating={true}
                      />
                    </TableCell>
                    <TableCell className="border-x  hidden md:table-cell">
                      <input
                        {...form.register(`recipe.${idx}.quantity`)}
                        className="border-0 shadow-none rounded-none w-full h-7 text-center font-bold"
                        disabled={disabled}
                      />
                    </TableCell>

                    <TableCell className="border-x text-center ">
                      {product && neto?.toFixed(4)}
                    </TableCell>

                    <TableCell className="border-x text-center font-bold">
                      {product && bruto2?.toFixed(4)}
                    </TableCell>

                    <TableCell className="border-x text-center">
                      {product && neto2?.toFixed(4)}
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-end print:hidden",
                        disabled && "hidden",
                      )}
                    >
                      <div className="flex justify-between gap-2">
                        <Trash2Icon
                          className="cursor-pointer w-4 h-4 text-red-700"
                          onClick={() =>
                            isOnlyOne
                              ? RecipeArray.replace({
                                  nameId: "",
                                  name: "",
                                  unit: "",
                                  quantity: "",
                                  coefficient: "1",
                                })
                              : RecipeArray.remove(idx)
                          }
                        />

                        {isLast && (
                          <PlusIcon
                            className="cursor-pointer w-4 h-4 text-green-700"
                            onClick={() =>
                              RecipeArray.append({
                                nameId: "",
                                name: "",
                                unit: "",
                                quantity: "",
                                coefficient: "1",
                              })
                            }
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow className="font-semibold">
                <TableCell colSpan={3} className="text-end">
                  Итого, кг
                </TableCell>
                <TableCell className="text-center">
                  {computedValues.totals.totalBruto.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {computedValues.totals.totalNeto.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {computedValues.totals.totalBruto_2.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {computedValues.totals.totalNeto_2.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <Label className="my-2">Технология приготовления:</Label>
          <Textarea
            className="resize-none text-xs p-4"
            {...form.register("description")}
          />
        </div>
      </div>
    </FormWrapper>
  );
}
