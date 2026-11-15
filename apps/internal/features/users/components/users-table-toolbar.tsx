import type { Table } from "@tanstack/table-core";
import { Search, Plus, X } from "lucide-react";

interface UsersTableToolbarProps<TData> {
    table: Table<TData>;
    search: string;
    setSearch: (value: string) => void;
    onAdd: () => void;
}

export function UsersTableToolbar<TData>({ table, search, setSearch, onAdd }: UsersTableToolbarProps<TData>) {
    const isFiltered = search.length > 0 || table.getState().columnFilters.length > 0;

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <div style={{ position: "relative", width: "280px" }}>
                    <Search
                        size={14}
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#7A7A72",
                            pointerEvents: "none",
                        }}
                    />
                    <input
                        placeholder="Cari nama, email, atau role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            height: "36px",
                            paddingLeft: "32px",
                            paddingRight: isFiltered ? "32px" : "12px",
                            fontSize: "13px",
                            border: "1px solid #DEDAD0",
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF",
                            color: "#1A1A18",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#1D6B5A")}
                        onBlur={(e) => (e.target.style.borderColor = "#DEDAD0")}
                    />
                    {isFiltered && (
                        <button
                            onClick={() => { setSearch(""); table.resetColumnFilters(); }}
                            style={{
                                position: "absolute",
                                right: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#7A7A72",
                                display: "flex",
                                alignItems: "center",
                                padding: 0,
                            }}
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>
            </div>

            <button
                onClick={onAdd}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#1D6B5A",
                    color: "#F7F5EF",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0 16px",
                    height: "36px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background-color 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget).style.backgroundColor = "#175749")}
                onMouseLeave={(e) => ((e.currentTarget).style.backgroundColor = "#1D6B5A")}
            >
                <Plus size={15} />
                Tambah Pengguna
            </button>
        </div>
    );
}