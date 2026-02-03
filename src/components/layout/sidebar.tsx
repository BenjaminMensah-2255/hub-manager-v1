"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, FileText, BarChart3, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

const navItems = [
    { name: "Directory", href: "/", icon: Users },
    { name: "Claims", href: "/claims", icon: FileText },
    { name: "Admin", href: "/admin", icon: BarChart3 }, // We could hide this for non-admins but safer to handle in page or nice to show locked
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold font-xl text-primary">
                    <span className="">Asante Hub</span>
                </Link>
            </div>
            <div className="flex-1 py-4">
                <nav className="grid gap-1 px-2">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
