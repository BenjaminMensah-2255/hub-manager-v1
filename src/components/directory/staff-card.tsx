"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateMyStatus } from "@/actions/staff-actions"
import { Loader2, Circle } from "lucide-react"
import { useState } from "react"

interface StaffMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: string;
}

export function StaffCard({ staff, isOwner }: { staff: StaffMember, isOwner: boolean }) {
    const [isUpdating, setIsUpdating] = useState(false)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-500'
            case 'On Leave': return 'bg-red-500'
            case 'Out of Office': return 'bg-yellow-500'
            default: return 'bg-gray-500'
        }
    }

    const handleStatusChange = async (status: string) => {
        if (!isOwner) return
        setIsUpdating(true)
        try {
            await updateMyStatus(status)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                    <span className="text-sm text-muted-foreground">{staff.role} • {staff.department}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mt-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(staff.status)}`} />
                    <span className="font-medium text-sm">{staff.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate" title={staff.email}>
                    {staff.email}
                </p>
            </CardContent>
            {isOwner && (
                <CardFooter className="bg-muted/30 p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full h-8" disabled={isUpdating}>
                                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                                Update Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange('Available')}>
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" /> Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('Out of Office')}>
                                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" /> Out of Office
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('On Leave')}>
                                <div className="h-2 w-2 rounded-full bg-red-500 mr-2" /> On Leave
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            )}
        </Card>
    )
}
