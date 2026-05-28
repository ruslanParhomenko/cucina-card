// edit-provider.tsx
"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type EditContextType = {
  isEdit: boolean;
  setIsEdit: (v: boolean) => void;
  resetFn: (() => void) | null;
  registerReset: (fn: () => void) => void;
  deleteFn: (() => void) | null;
  registerDelete: (fn: () => void) => void;
};

const EditContext = createContext<EditContextType | null>(null);

export default function EditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isEdit, setIsEdit] = useState(false);
  const [resetFn, setResetFn] = useState<(() => void) | null>(null);
  const [deleteFn, setDeleteFn] = useState<(() => void) | null>(null);

  const registerReset = (fn: () => void) => setResetFn(() => fn);
  const registerDelete = (fn: () => void) => setDeleteFn(() => fn);

  useEffect(() => {
    setIsEdit(false);
    setResetFn(null);
    setDeleteFn(null);
  }, [pathname]);

  return (
    <EditContext.Provider
      value={{
        isEdit,
        setIsEdit,
        resetFn,
        registerReset,
        deleteFn,
        registerDelete,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEdit must be used inside EditProvider");
  return ctx;
}
