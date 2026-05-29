"use client";
import { cn } from "@/lib/utils";
import { RefContext } from "@/providers/client-ref-provider";
import { useEdit } from "@/providers/edit-provider";
import { Printer } from "lucide-react";
import { useContext } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

type Props = {
  componentRef?: React.RefObject<HTMLDivElement | null> | null;
  className?: string;
  disabled?: boolean;
  size?: number;
};

export default function PrintButton({
  componentRef,
  className,
  disabled = false,
  size = 16,
}: Props) {
  const ref = componentRef || useContext(RefContext);

  const { isEdit } = useEdit();

  const handlePrint = useReactToPrint({
    contentRef: ref as any,
    pageStyle: `
  @page { 
    size: A4; 
    margin: 20mm 20mm 20mm 20mm; 
  }
  html, body { 
    margin: 0; 
    padding: 0; 
  }
  @media print {
    body { -webkit-print-color-adjust: exact; }
    .no-print { display: none !important; }
  }
`,
    onAfterPrint: () => toast.success("Печать завершена"),
    onPrintError: () => toast.error("Произошла ошибка при печати"),
  });

  if (isEdit) return null;
  return (
    <button
      onClick={() => ref && handlePrint()}
      type="button"
      disabled={disabled}
      className={className}
    >
      <Printer
        size={size}
        className={cn("text-white hover:text-black", disabled && "opacity-50")}
        strokeWidth={2}
      />
    </button>
  );
}
