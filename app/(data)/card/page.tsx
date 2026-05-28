import { getAllProducts } from "@/app/actions/products/products-actions";
import CardForm from "@/features/card/card-form";
import { ProductType } from "@/features/product/schema";

export default async function Page() {
  const dataProduct = await getAllProducts();

  return <CardForm dataProduct={dataProduct as ProductType[]} />;
}
