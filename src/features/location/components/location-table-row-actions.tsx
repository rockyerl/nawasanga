import type { Row } from "@tanstack/table-core";
import { MoreVertical } from "lucide-react";

interface LocationTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function LocationTableRowActions<TData>({ row: _ }: LocationTableRowActionsProps<TData>) {
  return (
    <button className="text-[#8E8E8E] hover:text-gray-700">
      <MoreVertical className="h-4 w-4" />
    </button>
  );
}
