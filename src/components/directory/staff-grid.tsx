"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StaffCard } from "./staff-card" // We will create this
import { Search } from "lucide-react"

// Define type locally or import
interface StaffMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: string;
}

export function StaffGrid({ staff, currentUserEmail }: { staff: StaffMember[], currentUserEmail?: string | null }) {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("All")

    const departments = ["All", "Engineering", "Creative", "Finance", "Admin"]

    const filteredStaff = staff.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === "All" || s.department === filter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search directory..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {departments.map(dept => (
                        <Button
                            key={dept}
                            variant={filter === dept ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(dept)}
                        >
                            {dept}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStaff.map(member => (
                    <StaffCard
                        key={member._id}
                        staff={member}
                        isOwner={currentUserEmail === member.email}
                    />
                ))}
                {filteredStaff.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No staff members found.
                    </div>
                )}
            </div>
        </div>
    )
}
