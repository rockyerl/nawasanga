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
                <div className="flex items-center gap-2.5 px-2 py-3">
                    {/* Logo bulat kecil */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rimba-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={team.logo}
                            alt={team.name}
                            width={24}
                            height={24}
                            style={{ objectFit: "contain", padding: "2px" }}
                        />
                    </div>
                    {/* Nama app */}
                    <span className="text-sm font-semibold text-arang truncate">
            {team.name}
          </span>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}