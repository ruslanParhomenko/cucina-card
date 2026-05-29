import { getAllProducts } from "@/app/actions/products/products-actions";
import CardForm from "@/features/card-create/card-form";
import { ProductType } from "@/features/product-create/schema";

export default async function Page() {
  const dataProduct = await getAllProducts();

  return <CardForm dataProduct={dataProduct as ProductType[]} />;
}
