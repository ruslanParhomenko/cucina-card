"use client";

import { CalculationCardType } from "../card-create/schema";
import { ProductType } from "../product-create/schema";

import CardTable from "@/features/card-data/card-page";
import ProductsTable from "../products-data/products-page";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function HomePage({
  data,
}: {
  data: {
    dataProduct: ProductType[];
    dataCards: CalculationCardType[];
  };
}) {
  const searchParams = useSearchParams() || "cards";

  const tab = searchParams.get("tab");
  const filterCards = searchParams.get("filter-cards");
  const filterProducts = searchParams.get("filter-products");

  const [itemSearch, setItemSearch] = useState<string>("");
  const [idSearch, setIdSearch] = useState<string>("");

  const dataCards = data.dataCards
    .filter(
      (item) =>
        !filterCards || filterCards === "all" || item.category === filterCards,
    )
    .filter((item) => item.name.toLowerCase().includes(itemSearch))
    .filter((item) => item.id.includes(idSearch))
    .sort((a, b) =>
      a.name.localeCompare(b.name, "ru", { sensitivity: "base" }),
    );
  const dataProduct = data.dataProduct
    .filter(
      (item) =>
        !filterProducts ||
        filterProducts === "all" ||
        item.category === filterProducts,
    )
    .filter((item) => item.name.toLowerCase().includes(itemSearch))
    .filter((item) => item.id.includes(idSearch))
    .sort((a, b) =>
      a.name.localeCompare(b.name, "ru", { sensitivity: "base" }),
    );

  return (
    <div className="flex flex-col h-[90dvh]">
      {tab === "cards" && <CardTable data={dataCards} />}

      {tab === "products" && <ProductsTable data={dataProduct} />}
      <div className="sticky top-0 grid-cols-4  grid bg-background z-10">
        <div />
        <input
          type="text"
          placeholder="...search"
          onChange={(e) => setItemSearch(e.target.value.toLowerCase().trim())}
          className="px-2 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 text-xs"
        />
        <div />

        <input
          type="text"
          placeholder="...id"
          onChange={(e) => setIdSearch(e.target.value.toLowerCase().trim())}
          className="px-2 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 text-xs"
        />
      </div>
    </div>
  );
}
