"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CATEGORY_PRODUCT, CATEGORY_UNIT } from "../product/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductType } from "../product/schema";
import { useHashParam } from "@/hooks/use-hash";

interface ProductsTableProps {
  data: ProductType[];
}

export default function ProductsTable({ data }: ProductsTableProps) {
  const router = useRouter();

  const [valueFilterProducts] = useHashParam("filter-products");

  const [itemSearch, setItemSearch] = useState<string>("");
  const [idSearch, setIdSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  const handleView = (id: string) => {
    router.push(`/product/${id}#tab=products`);
  };

  return (
    <div className="overflow-auto h-[95vh]">
      <Table className="table-fixed">
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.id} className="[&>td]:py-1.5">
              <TableCell className="w-6 text-xs px-2">{index + 1}</TableCell>
              <TableCell
                className="truncate cursor-pointer text-blue-600 w-44 text-xs px-4"
                onClick={() => handleView(product.id?.toString()!)}
              >
                {product.name}
              </TableCell>
              <TableCell className="text-xs hidden md:table-cell">
                {CATEGORY_UNIT.find((u) => u.value === product.unit)?.label}
              </TableCell>
              <TableCell className="text-xs w-30 text-blue-600 font-bold">
                {product.id || "-"}
              </TableCell>
              <TableCell className="text-xs">{product.coefficient}</TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground px-4 text-end">
                {
                  CATEGORY_PRODUCT.find((c) => c.value === product.category)
                    ?.label
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
