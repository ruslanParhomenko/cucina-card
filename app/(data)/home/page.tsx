import { getAllCards } from "@/app/actions/cards/cards-action";
import { getAllProducts } from "@/app/actions/products/products-actions";
import HomePage from "@/features/home/home-page";
import { Suspense } from "react";

export default async function Page() {
  const [dataProduct, dataCards] = await Promise.all([
    getAllProducts(),
    getAllCards(),
  ]);
  const data = {
    dataProduct,
    dataCards,
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage data={data} />
    </Suspense>
  );
}
