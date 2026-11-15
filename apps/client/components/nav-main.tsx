"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItem = {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
    const pathname = usePathname()

    return (
        <SidebarMenu>
            {items.map((item) => {
                const isActive =
                    pathname === item.url ||
                    item.items?.some((i) => pathname === i.url) ||
                    false

                return (
                    <SidebarMenuItem key={item.title}>
                        {item.items ? (
                            <Collapsible defaultOpen={isActive}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isActive}
                                        className={
                                            isActive
                                                ? "!bg-rimba-500 !text-kertas [&>svg]:!text-kertas [&>span]:!text-kertas hover:!bg-rimba-600 hover:!text-kertas rounded-md"
                                                : "!text-abu-bambu hover:!bg-pasir hover:!text-jati rounded-md"
                                        }
                                    >
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => {
                                            const isSubActive = pathname === subItem.url
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isSubActive}
                                                        className={
                                                            isSubActive
                                                                ? "!text-rimba-500 font-semibold"
                                                                : "!text-abu-bambu hover:!text-jati"
                                                        }
                                                    >
                                                        <Link href={subItem.url}>{subItem.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={isActive}
                                className={
                                    isActive
                                        ? "!bg-rimba-500 !text-kertas [&>svg]:!text-kertas [&>span]:!text-kertas hover:!bg-rimba-600 hover:!text-kertas rounded-md"
                                        : "!text-abu-bambu hover:!bg-pasir hover:!text-jati rounded-md"
                                }
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                )
            })}
        </SidebarMenu>
    )
}