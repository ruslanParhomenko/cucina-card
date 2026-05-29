"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TabsOptions from "../tabs/tabs-options";
import { NAV_BY_PATCH, NAV_BY_PATCH_TYPE } from "./constants";
import { useEffect, useTransition } from "react";
import { CATEGORY } from "@/features/card-create/constants";
import { CATEGORY_PRODUCT } from "@/features/product-create/constants";
import SelectOptions from "../select/select-options";

export default function NavHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const patch = pathname.split("/")[1] as keyof typeof NAV_BY_PATCH;

  const router = useRouter();

  const STORAGE_KEY_CARD_FILTER = `card-filter-${pathname}`;
  const STORAGE_KEY_PRODUCT_FILTER = `product-filter-${pathname}`;

  const config = NAV_BY_PATCH[
    patch as keyof typeof NAV_BY_PATCH
  ] as NAV_BY_PATCH_TYPE[string];

  const tabs = config.tabs;
  const isFilter = config.selectOptions;

  const activeTab = searchParams.get("tab") || tabs[0]?.value;
  const activeFilterCards = searchParams.get("filter-cards") || "";
  const activeFilterProducts = searchParams.get("filter-products") || "";

  const [isPending, startTransition] = useTransition();

  // handler

  const paramsByKey = {
    cards: "filter-cards",
    products: "filter-products",
  };

  const handleTabChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("tab", value);
      } else {
        params.delete("tab");
      }
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    });
  };

  const handleFilterChange = (value: string) => {
    const paramsItem = paramsByKey[activeTab as keyof typeof paramsByKey];

    if (value) localStorage.setItem(STORAGE_KEY_PRODUCT_FILTER, value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(paramsItem, value);
    } else {
      params.delete(paramsItem);
    }

    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (!pathname || tabs.length === 0) return;
    if (searchParams.get("tab")) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabs[0].value);

    if (isFilter) {
      const storedFilterCards = localStorage.getItem(STORAGE_KEY_CARD_FILTER);
      if (storedFilterCards) params.set("filter-cards", storedFilterCards);

      const storedFilterProducts = localStorage.getItem(
        STORAGE_KEY_PRODUCT_FILTER,
      );
      if (storedFilterProducts)
        params.set("filter-products", storedFilterProducts);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname]);

  const optionsDataByTab = {
    cards: [{ value: "all", label: "все" }, ...CATEGORY],
    products: [{ value: "all", label: "все" }, ...CATEGORY_PRODUCT],
  };

  const activeFilter = {
    cards: activeFilterCards,
    products: activeFilterProducts,
  };

  const optionData =
    optionsDataByTab[activeTab as keyof typeof optionsDataByTab] || [];

  return (
    <div className="py-1 px-4 bg-background  sticky top-0 z-12 flex justify-between items-center">
      {tabs.length > 0 && (
        <TabsOptions
          value={activeTab}
          setValue={handleTabChange}
          isPending={isPending}
          options={tabs}
        />
      )}
      {isFilter && (
        <SelectOptions
          options={optionData}
          value={activeFilter[activeTab as keyof typeof activeFilter]}
          onChange={handleFilterChange}
          className="min-w-28 text-xs text-blue-600 font-bold"
        />
      )}
    </div>
  );
}
