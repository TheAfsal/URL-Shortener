"use client"

import { Outlet } from "react-router-dom"
import { useAuthStore } from "../store/auth-store"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { LinkIcon, LogOut } from "lucide-react"

export default function Layout() {
    const { isAuthenticated, logout } = useAuthStore()

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-blue-800/30 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to={isAuthenticated ? "/home" : "/login"} className="flex items-center gap-2">
                        <LinkIcon className="h-6 w-6 text-blue-400" />
                        <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              LinkShortener
            </span>
                    </Link>
                    {isAuthenticated && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="text-blue-300 hover:text-blue-100 hover:bg-blue-800/30"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    )}
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="border-t border-blue-800/30 py-6 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center text-blue-300 text-sm">
                    &copy; {new Date().getFullYear()} LinkShortener. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
