"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavUser({
                            user,
                        }: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const router = useRouter()

    const handleLogout = () => {
        document.cookie = "is_logged_in=; path=/; max-age=0"
        router.push("/auth")
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    onClick={handleLogout}
                    className="group rounded-lg transition-colors duration-150"
                    style={{
                        color: "#7A7A72",
                    }}
                >
                    {/* Avatar initials */}
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                        style={{
                            background: "linear-gradient(135deg, #1D6B5A, #2A9478)",
                            color: "#F7F5EF",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                    </div>

                    <div className="grid flex-1 text-left text-sm leading-tight">
            <span
                className="truncate font-medium"
                style={{ color: "#1A1A18", fontSize: "13px" }}
            >
              {user.name}
            </span>
                        <span
                            className="truncate"
                            style={{ color: "#7A7A72", fontSize: "11px" }}
                        >
              {user.email}
            </span>
                    </div>

                    <LogOut
                        className="ml-auto size-4 shrink-0 transition-colors duration-150 group-hover:text-[#C14B2A]"
                        style={{ color: "#7A7A72" }}
                    />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}