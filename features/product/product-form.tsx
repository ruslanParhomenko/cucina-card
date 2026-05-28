"use client";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products/products-actions";
import SelectInput from "@/components/input/select-input";
import TextInput from "@/components/input/text-input";
import { FormWrapper } from "@/components/wrapper/form-wrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { CATEGORY_PRODUCT, CATEGORY_UNIT } from "./constants";
import { toast } from "sonner";
import { productDefaultValues, productSchema, ProductType } from "./schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useEdit } from "@/providers/edit-provider";

export default function ProductForm({
  data,
  disabled = false,
}: {
  data?: ProductType;
  disabled?: boolean;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const id = data?.id;

  const { isEdit, setIsEdit, registerReset, registerDelete } = useEdit();

  const form = useForm<ProductType>({
    resolver: zodResolver(productSchema),
    defaultValues: productDefaultValues,
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      if (!id) {
        await createProduct(data);
        toast.success("Продукт успешно создан");
      } else {
        const { id, ...formattedData } = data;
        await updateProduct(id, formattedData);
        toast.success("Продукт успешно обновлен");
      }

      form.reset(productDefaultValues);
    } catch (error) {
      if (error instanceof Error && error.message === "KEY_EXISTS") {
        toast.error("Продукт с таким key уже существует");

        form.setError("id", {
          type: "manual",
          message: "Такой key уже используется",
        });

        return;
      }

      toast.error("Ошибка сохранения продукта");
    }
    setIsEdit(false);
    router.back();
  };

  useEffect(() => {
    if (!data) return;
    form.reset(data);
    if (!id) return;
    registerDelete(async () => {
      await deleteProduct(id);
    });
  }, [data]);

  useEffect(() => {
    registerReset(() => form.reset(productDefaultValues));
  }, []);

  return (
    <FormWrapper form={form} onSubmit={onSubmit} id={pathname}>
      <div className="flex flex-col gap-8  justify-center">
        <TextInput
          fieldLabel="продукт"
          fieldName="name"
          disabled={disabled || !isEdit}
        />
        <TextInput
          fieldLabel="коэффициент"
          fieldName="coefficient"
          disabled={disabled || !isEdit}
        />
        <SelectInput
          fieldLabel="единица"
          fieldName="unit"
          options={CATEGORY_UNIT}
          disabled={disabled || !isEdit}
        />
        <SelectInput
          fieldLabel="категория"
          fieldName="category"
          options={CATEGORY_PRODUCT}
          disabled={disabled || !isEdit}
        />
        <TextInput
          fieldLabel="номер id"
          fieldName="id"
          disabled={disabled || !isEdit}
        />
      </div>
    </FormWrapper>
  );
}
