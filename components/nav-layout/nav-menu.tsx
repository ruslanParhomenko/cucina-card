"use client";
import { Activity, useContext, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { CATEGORY_PRODUCT } from "@/features/product/constants";
import { useSession } from "next-auth/react";

import { NAV_BY_PATCH, NAV_BY_PATCH_TYPE } from "./constants";
import TabsOptions from "../tabs/tabs-options";

import SelectOptions from "../select/select-options";
import LogOutButton from "../buttons/logout-button";
import { CATEGORY } from "@/features/card/constants";

import { useSwipeable } from "react-swipeable";
import { Plus } from "lucide-react";
import EditButton from "../buttons/edit-button";
import { useEdit } from "@/providers/edit-provider";
import PrintButton from "../buttons/print-button";
import ExitButton from "../buttons/exit-button";
import DeleteButton from "../buttons/delete-button";
import ResetButton from "../buttons/reset-button";
import { RefContext } from "@/providers/client-ref-provider";
import SaveButton from "../buttons/save-button";
import { useFormId } from "@/hooks/use-form-id";

export type PageNavType = {
  title: string;
  href: string;
};

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const ref = useContext(RefContext);

  const formId = useFormId();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const patch = pathname.split("/")[1] as keyof typeof NAV_BY_PATCH;

  const STORAGE_KEY_NAV = `nav-tab-${pathname}`;
  const STORAGE_KEY_CARD_FILTER = `card-filter-${pathname}`;
  const STORAGE_KEY_PRODUCT_FILTER = `product-filter-${pathname}`;

  const config = NAV_BY_PATCH[patch] as NAV_BY_PATCH_TYPE[string];

  const tabs = config.tabs;
  const isFilter = config.selectOptions;
  const actionButton = config.actionButton;

  const has = (key: string) => actionButton.includes(key);

  const [isPending, startTransition] = useTransition();

  const { isEdit, setIsEdit, resetFn, deleteFn } = useEdit();

  const router = useRouter();

  const activeTab = searchParams.get("tab") || tabs[0]?.value;
  const activeFilterCards = searchParams.get("filter-cards") || "";
  const activeFilterProducts = searchParams.get("filter-products") || "";
  // new

  const handleTabChange = (value: string) => {
    startTransition(() => {
      if (value) localStorage.setItem(STORAGE_KEY_NAV, value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("tab", value);
      } else {
        params.delete("tab"); // не писать пустой параметр
      }
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    });
  };

  const handleFilterCardsChange = (value: string) => {
    startTransition(() => {
      if (value) localStorage.setItem(STORAGE_KEY_CARD_FILTER, value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("filter-cards", value);
      } else {
        params.delete("filter-cards"); // не писать пустой параметр
      }
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    });
  };
  const handleFilterProductsChange = (value: string) => {
    startTransition(() => {
      if (value) localStorage.setItem(STORAGE_KEY_PRODUCT_FILTER, value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("filter-products", value);
      } else {
        params.delete("filter-products"); // не писать пустой параметр
      }
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    });
  };

  const addNew = () => {
    const url = activeTab === "cards" ? `/card` : `/product`;
    router.push(url);
  };
  useEffect(() => {
    if (!pathname || tabs.length === 0) return;

    const storedTab = localStorage.getItem(STORAGE_KEY_NAV);
    handleTabChange(storedTab || activeTab);

    if (!isFilter) return;

    const storedFilterCards = localStorage.getItem(STORAGE_KEY_CARD_FILTER);
    if (storedFilterCards) handleFilterCardsChange(storedFilterCards);

    const storedFilterProducts = localStorage.getItem(
      STORAGE_KEY_PRODUCT_FILTER,
    );
    if (storedFilterProducts) handleFilterProductsChange(storedFilterProducts);
  }, [STORAGE_KEY_NAV, pathname, tabs, isFilter]);

  const handlers = useSwipeable({
    delta: 100,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    onSwipedRight: () => {
      if (!activeTab) return;
      const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex].value;
      handleTabChange(nextTab);
    },
    onSwipedLeft: () => {
      if (!activeTab) return;
      const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      const prevTab = tabs[prevIndex].value;
      handleTabChange(prevTab);
    },
  });

  const selectClassName =
    "w-32 md:min-w-16 h-6.5!  rounded-md text-xs  text-blue-600 font-bold bg-transparent  shadow-xs";

  const iconCn = "bg-border rounded-md border px-3 py-1 cursor-pointer";

  return (
    <>
      <div className="p-2 bg-background  sticky top-0 z-12 flex justify-between items-center">
        <LogOutButton />
        {tabs.length > 0 && (
          <TabsOptions
            value={activeTab}
            setValue={handleTabChange}
            isPending={isPending}
            options={tabs}
          />
        )}
        {isFilter && (
          <>
            <Activity mode={activeTab === "cards" ? "visible" : "hidden"}>
              <SelectOptions
                options={[{ value: "all", label: "все" }, ...CATEGORY]}
                value={activeFilterCards}
                onChange={handleFilterCardsChange}
                className={selectClassName}
              />
            </Activity>
            <Activity mode={activeTab === "products" ? "visible" : "hidden"}>
              <SelectOptions
                options={[{ value: "all", label: "все" }, ...CATEGORY_PRODUCT]}
                value={activeFilterProducts}
                onChange={handleFilterProductsChange}
                className={selectClassName}
              />
            </Activity>
          </>
        )}
        {isAdmin && (
          <button
            onClick={addNew}
            type="button"
            className="cursor-pointer w-10 px-2  border-0 h-8  flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-blue-600 font-bold" />
          </button>
        )}
      </div>
      <div {...handlers} ref={ref} className="flex-1">
        {children}
      </div>
      {actionButton.length > 0 && (
        <div className="p-2 bg-background  sticky top-0 z-12 flex  items-center justify-end gap-10">
          {has("delete") && isEdit && (
            <DeleteButton
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={!isAdmin}
              className={iconCn}
              dialogText="Вы уверены что хотите удалить?"
              descriptionText="Это действие необратимо"
              onDelete={() => {
                deleteFn?.();
                setIsEdit(false);
              }}
            />
          )}
          {has("exit") && !isEdit && (
            <ExitButton className={iconCn} disabled={isPending} />
          )}
          {has("print") && !isEdit && <PrintButton className={iconCn} />}
          {has("reset") && isEdit && (
            <ResetButton className={iconCn} reset={() => resetFn?.()} />
          )}
          {has("save") && isEdit && (
            <SaveButton
              formId={formId}
              isEdit={isEdit}
              disabled={!isAdmin || isPending || !isEdit}
              className={iconCn}
            />
          )}
          {has("edit") && (
            <EditButton
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              disabled={!isAdmin}
              className={iconCn}
            />
          )}
        </div>
      )}
    </>
  );
}
