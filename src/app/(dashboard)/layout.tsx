import { Sidebar } from "@/components/layout/sidebar"

// We will use standard div for scroll
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 lg:block">
                <Sidebar />
            </div>
            <div className="flex flex-col">
                {/* Mobile Header could go here */}
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6 lg:hidden">
                    <span className="font-semibold">Asante Hub</span>
                    {/* Add toggle trigger here if sheet implemented */}
                </header>
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
