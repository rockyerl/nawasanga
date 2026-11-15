"use client";

import type { Row } from "@tanstack/table-core";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubscriptionTypes } from "@/types/features/subscription.type";
import { SubscriptionFormDialog } from "@/features/subscription/components/subscription-form-dialog";

interface Props {
    row: Row<SubscriptionTypes.Service.PlanData>;
}

export function SubscriptionTableRowActions({ row }: Props) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setEditOpen(true)}
            >
                <Pencil size={14} style={{ color: "#1D6B5A" }} />
                <span className="sr-only">Edit plan</span>
            </Button>

            <SubscriptionFormDialog
                open={editOpen}
                setOpen={setEditOpen}
                initialData={row.original}
            />
        </>
    );
}