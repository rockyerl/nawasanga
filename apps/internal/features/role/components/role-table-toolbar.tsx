import { Search, Plus } from "lucide-react";

export function RoleTableToolbar({ search, setSearch, onAdd }: any) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="relative w-72">
                <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#7A7A72" }}
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama role..."
                    style={{
                        width: "100%",
                        paddingLeft: "2rem",
                        paddingRight: "0.75rem",
                        height: "36px",
                        fontSize: "13px",
                        border: "1px solid #DEDAD0",
                        borderRadius: "8px",
                        backgroundColor: "#FFFFFF",
                        color: "#1A1A18",
                        outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1D6B5A")}
                    onBlur={(e) => (e.target.style.borderColor = "#DEDAD0")}
                />
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
                onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#175749")}
                onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#1D6B5A")}
            >
                <Plus size={15} />
                Tambah Role
            </button>
        </div>
    );
}