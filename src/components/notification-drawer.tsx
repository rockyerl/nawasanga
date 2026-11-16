"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Fuel,
  CreditCard,
  Truck,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  category: "emission" | "operational" | "billing" | "system";
  link: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationDrawer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["internal-notifications"],
    queryFn: async () => {
      const res = await fetch("/api/internal/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/internal/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-notifications"] });
    },
  });

  const rawItems: NotificationItem[] = data?.data?.items || [];
  const items = rawItems.map((item) => ({
    ...item,
    isRead: item.isRead || readIds.has(item.id),
  }));

  const unreadCount = items.filter((n) => !n.isRead).length;

  const filteredItems = items.filter((n) => {
    if (activeTab === "all") return true;
    return n.category === activeTab;
  });

  const handleItemClick = (item: NotificationItem) => {
    setReadIds((prev) => new Set(prev).add(item.id));
    setOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAll = () => {
    const allIds = new Set(rawItems.map((i) => i.id));
    setReadIds(allIds);
    markAllMutation.mutate();
  };

  const getCategoryIcon = (category: string, type: string) => {
    if (category === "operational") return <Truck className="h-4 w-4 text-emerald-600" />;
    if (category === "emission") return <Fuel className="h-4 w-4 text-amber-600" />;
    if (category === "billing") return <CreditCard className="h-4 w-4 text-blue-600" />;
    if (category === "system") return <MessageSquare className="h-4 w-4 text-purple-600" />;
    if (type === "warning") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    return <Info className="h-4 w-4 text-gray-600" />;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#DEDAD0] bg-[#F7F5EF] text-[#7A7A72] transition-colors hover:bg-[#EDEAE0] hover:text-[#1D6B5A] focus:outline-none"
          aria-label="Pusat Notifikasi & Peringatan"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C14B2A] px-1 text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[90vw] sm:w-[420px] max-w-[420px] p-0 rounded-xl border border-[#EDEAE0] bg-white shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDEAE0] bg-[#F7F5EF] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">Notifikasi & Peringatan</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#1D6B5A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1D6B5A]">
                {unreadCount} baru
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1 text-[11px] font-medium text-[#1D6B5A] hover:underline cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tandai Dibaca
            </button>
          )}
        </div>

        {/* Filter Category Tabs */}
        <div className="flex border-b border-[#EDEAE0] bg-neutral-50/60 px-3 py-1.5 gap-1 overflow-x-auto text-[11px]">
          {[
            { id: "all", label: "Semua" },
            { id: "emission", label: "Emisi" },
            { id: "operational", label: "Armada & SIM" },
            { id: "billing", label: "Billing" },
            { id: "system", label: "Layanan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-2.5 py-1 font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-xs border border-[#EDEAE0]"
                  : "text-[#7A7A72] hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="max-h-[340px] overflow-y-auto divide-y divide-[#EDEAE0]">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-[#7A7A72]">
              Memuat data peringatan...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-10 text-center space-y-1">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto opacity-70" />
              <p className="text-xs font-semibold text-gray-800">Semua Terkendali</p>
              <p className="text-[11px] text-[#7A7A72]">Tidak ada peringatan baru saat ini.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-[#F7F5EF]/80 ${
                  !item.isRead ? "bg-[#1D6B5A]/5" : "bg-white"
                }`}
              >
                <div className="mt-0.5 rounded-lg border border-[#EDEAE0] bg-white p-2 shrink-0 shadow-2xs">
                  {getCategoryIcon(item.category, item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs truncate ${!item.isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                      {item.title}
                    </p>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#1D6B5A] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A7A72] line-clamp-2 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="text-[10px] text-[#A0A098]">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#1D6B5A]">
                      Buka Rincian <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#EDEAE0] bg-[#F7F5EF] p-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              router.push("/support");
            }}
            className="w-full text-xs font-semibold text-[#1D6B5A] hover:bg-[#EDEAE0]"
          >
            Pusat Bantuan & Tiket Telematika
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
