import type { Row } from "@tanstack/table-core";
import { MoreVertical } from "lucide-react";

interface UserTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function UserTableRowActions<TData>({ row: _ }: UserTableRowActionsProps<TData>) {
    return (
        <button className="text-[#8E8E8E] hover:text-gray-700">
            <MoreVertical className="h-4 w-4" />
        </button>
    );
}