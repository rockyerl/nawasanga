import type { ColumnDef } from "@tanstack/table-core";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ArticleTableRowActions } from "@/features/article/components/article-table-row-actions";
import { ArticleTypes } from "@/types/features/article.type";
import { STATUS_LABEL, STATUS_COLOR } from "@/features/article/constants/article.constants";

export const articleColumns: ColumnDef<ArticleTypes.Service.ArticleData>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Judul Artikel" />,
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[300px]">
                <span className="text-sm font-medium truncate" style={{ color: "#1A1A18" }}>
                    {row.getValue("title")}
                </span>
                <span className="text-[11px]" style={{ color: "#7A7A72" }}>
                    {row.original.category}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "author",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Penulis" />,
        cell: ({ row }) => <span className="text-sm">{row.getValue("author")}</span>,
    },
    {
        accessorKey: "publishedAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tgl Terbit" />,
        cell: ({ row }) => {
            const raw = row.getValue("publishedAt") as string;
            const date = raw ? new Date(raw) : new Date();
            const isValid = !isNaN(date.getTime());
            return (
                <span className="text-sm text-[#7A7A72]">
                    {isValid ? date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "views",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dilihat" />,
        cell: ({ row }) => <span className="text-sm">{row.getValue("views")}x</span>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("status") as ArticleTypes.Service.ArticleStatus;
            const color = STATUS_COLOR[status] || { bg: "#eef5f3", text: "#1D6B5A" };
            return (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: color.bg, color: color.text }}
                >
                    {STATUS_LABEL[status] || status}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        cell: ({ row, table }) => {
            const onEdit = (table.options.meta as any)?.onEdit;
            return <ArticleTableRowActions row={row} onEdit={onEdit} />;
        },
    },
];