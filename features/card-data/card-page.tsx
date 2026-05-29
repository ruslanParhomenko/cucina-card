"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { CalculationCardType } from "../card-create/schema";
import { useRouter } from "next/navigation";

import { CATEGORY } from "../card-create/constants";

export default function ProductsTable({
  data,
}: {
  data: CalculationCardType[];
}) {
  const router = useRouter();

  const handleView = (id: string) => {
    router.push(`/card/${id}`);
  };
  return (
    <div className="overflow-auto h-[95vh]">
      <Table className="table-fixed">
        <TableBody>
          {data.map((card, index) => (
            <TableRow key={card.id} className="[&>td]:py-2">
              <TableCell className="w-6 text-xs px-2">{index + 1}</TableCell>
              <TableCell
                className="truncate cursor-pointer text-blue-600 w-44 md:w-80 text-xs px-4"
                onClick={() => handleView(card.id)}
              >
                {card.name}
              </TableCell>
              <TableCell className="text-xs">{card.weight}</TableCell>
              <TableCell className="text-xs w-30 text-blue-600 font-bold">
                {card.id}
              </TableCell>

              <TableCell className="hidden md:table-cell text-xs text-muted-foreground text-end px-4">
                {CATEGORY.find((c) => c.value === card.category)?.label}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
