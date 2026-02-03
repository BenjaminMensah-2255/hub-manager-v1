import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login | Hub Manager",
    description: "Secure login for Asante Innovation Hub staff.",
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    )
}
