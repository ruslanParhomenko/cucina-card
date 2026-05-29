"use client";
import { useFormId } from "@/hooks/use-form-id";
import CreateButton from "../buttons/create-button";
import EditButton from "../buttons/edit-button";
import PrintButton from "../buttons/print-button";
import ResetButton from "../buttons/reset-button";
import SaveButton from "../buttons/save-button";
import ExitButton from "../buttons/exit-button";
import DeleteButton from "../buttons/delete-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEdit } from "@/providers/edit-provider";
import LogOutButton from "../buttons/logout-button";
import { NAV_BY_PATCH, NAV_BY_PATCH_TYPE } from "./constants";
import { useTransition } from "react";

const CREATE_URL_BY_TAB = {
  cards: "/card",
  products: "/product",
};

export default function NavFooter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending] = useTransition();

  const pathname = usePathname();
  const patch = pathname.split("/")[1] as keyof typeof NAV_BY_PATCH;

  const config = NAV_BY_PATCH[patch] as NAV_BY_PATCH_TYPE[string];
  const actionButtons = config.actionButton;
  const tabs = config.tabs;

  const activeTab = searchParams.get("tab") || tabs[0]?.value;
  const urlCreate =
    CREATE_URL_BY_TAB[activeTab as keyof typeof CREATE_URL_BY_TAB];

  const formId = useFormId();

  const { setIsEdit, deleteFn, resetFn, isEdit } = useEdit();

  const has = (key: string) => actionButtons.includes(key);
  const handleDelete = () => {
    deleteFn?.();
    setIsEdit(false);
    resetFn?.();
    router.back();
  };

  const iconCn =
    "bg-blue-400 rounded-md border border-blue-400 px-2 py-1.5 cursor-pointer";
  return (
    <div className="bg-background sticky top-0 z-12 flex items-center justify-between py-1 px-2">
      {!isEdit && patch === "home" ? (
        <LogOutButton className="rounded-md border-blue-400 border px-2 py-1.5 cursor-pointer" />
      ) : (
        <div />
      )}

      {actionButtons.length > 0 && (
        <div className="flex gap-6">
          {has("add") && <CreateButton className={iconCn} url={urlCreate} />}
          {has("delete") && (
            <DeleteButton className={iconCn} onDelete={handleDelete} />
          )}
          {has("exit") && (
            <ExitButton className={iconCn} disabled={isPending} />
          )}
          {has("print") && <PrintButton className={iconCn} />}
          {has("reset") && <ResetButton className={iconCn} />}
          {has("save") && <SaveButton formId={formId} className={iconCn} />}
          {has("edit") && <EditButton className={iconCn} />}
        </div>
      )}
    </div>
  );
}
