import type { Table } from "@tanstack/table-core";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

interface LocationTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
}

export function LocationTableToolbar<TData>({ table, search, setSearch, onAdd }: LocationTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search name, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {(search || isFiltered) && (
          <Button
            variant="ghost"
            onClick={() => { setSearch(""); table.resetColumnFilters(); }}
            className="h-8 px-2 lg:px-3"
          >
            Reset <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <DataTableViewOptions table={table} />
        <Button onClick={onAdd} className="bg-[#1D6B5A] hover:bg-[#155245] text-white" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Tambah Lokasi / Pool
        </Button>
      </div>
    </div>
  );
}
