"use client";
import { use } from "react";

import { RefContext } from "@/providers/client-ref-provider";
import NavFooter from "./nav-footer";
import NavHeader from "./nav-header";

export type PageNavType = {
  title: string;
  href: string;
};

export default function NavLayout({ children }: { children: React.ReactNode }) {
  const ref = use(RefContext);

  return (
    <>
      <NavHeader />

      <div ref={ref} className="flex-1">
        {children}
      </div>
      <NavFooter />
    </>
  );
}
