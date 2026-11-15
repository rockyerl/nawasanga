"use client"

import {
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
                                 teams,
                             }: {
    teams: {
        name: string
        logo: string
        plan: string
    }[]
}) {
    const team = teams[0]

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-3">
                    {/* Logo tanpa background */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={team.logo}
                            alt={team.name}
                            width={36}
                            height={36}
                            style={{ objectFit: "contain" }}
                        />
                    </div>

                    {/* Nama & badge plan */}
                    <div className="flex flex-col min-w-0">
                <span
                    style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A1A18",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.3",
                    }}
                >
                    {team.name}
                </span>
                        <span
                            style={{
                                fontSize: "11px",
                                fontWeight: 500,
                                color: "#B8962E",
                                letterSpacing: "0.02em",
                            }}
                        >
                    {team.plan}
                </span>
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}