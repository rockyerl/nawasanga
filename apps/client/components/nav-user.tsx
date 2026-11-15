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
                    className="text-abu-bambu hover:bg-pasir hover:text-jati"
                >
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium text-arang">{user.name}</span>
                        <span className="truncate text-xs text-abu-bambu">{user.email}</span>
                    </div>
                    <LogOut className="ml-auto size-4 shrink-0 text-abu-bambu" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}