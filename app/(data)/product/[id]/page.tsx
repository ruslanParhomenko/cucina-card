import { getProductById } from "@/app/actions/products/products-actions";
import ProductForm from "@/features/product-create/product-form";
import { ProductType } from "@/features/product-create/schema";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;
  const data = await getProductById(id);

  return <ProductForm data={data as ProductType} />;
}
