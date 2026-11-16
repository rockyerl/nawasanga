"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateArticle, useUpdateArticle } from "@/features/article/hooks/article-queries";
import { ArticleTypes } from "@/types/features/article.type";
import { STATUS_LABEL } from "@/features/article/constants/article.constants";
import { toast } from "sonner";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    initialData?: ArticleTypes.Service.ArticleData;
}

const STATUSES: ArticleTypes.Service.ArticleStatus[] = ["published", "draft", "archived"];

const emptyForm = {
    title: "",
    author: "",
    category: "",
    content: "",
    publishedAt: "",
    status: "draft" as ArticleTypes.Service.ArticleStatus,
};

export function ArticleFormDialog({ open, setOpen, initialData }: Props) {
    const isEdit = !!initialData;
    const createMutation = useCreateArticle();
    const updateMutation = useUpdateArticle();
    const isLoading = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

    useEffect(() => {
        if (open && initialData) {
            setForm({
                title: initialData.title,
                author: initialData.author,
                category: initialData.category,
                content: initialData.content,
                publishedAt: initialData.publishedAt.slice(0, 10),
                status: initialData.status,
            });
        }
        if (open && !initialData) {
            setForm(emptyForm);
            setErrors({});
        }
    }, [open, initialData]);

    const set = (key: keyof typeof emptyForm) => (val: string) =>
        setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e: typeof errors = {};
        if (!form.title.trim()) e.title = "Judul artikel wajib diisi.";
        if (!form.author.trim()) e.author = "Nama penulis wajib diisi.";
        if (!form.category.trim()) e.category = "Kategori wajib diisi.";
        if (!form.content.trim()) e.content = "Konten artikel tidak boleh kosong.";
        if (!form.publishedAt) e.publishedAt = "Pilih tanggal terbit.";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const payload = {
            title: form.title.trim(),
            author: form.author.trim(),
            category: form.category.trim(),
            content: form.content.trim(),
            publishedAt: form.publishedAt,
            status: form.status,
        };

        if (isEdit && initialData) {
            updateMutation.mutate(
                { id: initialData.id, payload },
                {
                    onSuccess: () => {
                        toast.success("Artikel berhasil diperbarui");
                        setOpen(false);
                    },
                    onError: () => {
                        toast.error("Gagal memperbarui artikel");
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Artikel berhasil diterbitkan");
                    setOpen(false);
                },
                onError: () => {
                    toast.error("Gagal menambahkan artikel");
                },
            });
        }
    };

    const fieldClass = (key: keyof typeof emptyForm) =>
        `border text-sm outline-none rounded-md px-3 py-2 w-full transition-colors ${
            errors[key]
                ? "border-red-400 focus:border-red-500"
                : "border-[#DEDAD0] focus:border-[#1D6B5A]"
        }`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[95vw] sm:w-[70vw] sm:max-w-[70vw] max-h-[90vh] overflow-y-auto p-6" style={{ background: "#FDFCFA" }}>
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold" style={{ color: "#1A1A18" }}>
                        {isEdit ? "Edit Artikel" : "Tulis Artikel Baru"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-1">
                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Judul Artikel <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.title}
                            onChange={(e) => set("title")(e.target.value)}
                            placeholder="Contoh: Tren Logistik 2026"
                            className={fieldClass("title")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                        {errors.title && <p className="text-[11px]" style={{ color: "#C14B2A" }}>{errors.title}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Penulis <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.author}
                            onChange={(e) => set("author")(e.target.value)}
                            placeholder="Nama Lengkap"
                            className={fieldClass("author")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Kategori <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            value={form.category}
                            onChange={(e) => set("category")(e.target.value)}
                            placeholder="Misal: Operasional"
                            className={fieldClass("category")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Status Publikasi
                        </Label>
                        <Select value={form.status} onValueChange={set("status")}>
                            <SelectTrigger className="border-[#DEDAD0] text-sm" style={{ background: "#F7F5EF" }}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Tanggal Terbit <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <input
                            type="date"
                            value={form.publishedAt}
                            onChange={(e) => set("publishedAt")(e.target.value)}
                            className={fieldClass("publishedAt")}
                            style={{ background: "#F7F5EF", color: "#1A1A18" }}
                        />
                    </div>

                    <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium" style={{ color: "#1A1A18" }}>
                            Konten Artikel <span style={{ color: "#C14B2A" }}>*</span>
                        </Label>
                        <textarea
                            value={form.content}
                            onChange={(e) => set("content")(e.target.value)}
                            placeholder="Tulis isi artikel di sini..."
                            rows={5}
                            className={fieldClass("content")}
                            style={{ background: "#F7F5EF", color: "#1A1A18", resize: "none" }}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2" style={{ borderTop: "1px solid #EDEAE0" }}>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="text-sm"
                        style={{ borderColor: "#DEDAD0", color: "#7A7A72" }}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="text-sm font-medium"
                        style={{ background: "#1D6B5A", color: "#F7F5EF" }}
                    >
                        {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Terbitkan"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}