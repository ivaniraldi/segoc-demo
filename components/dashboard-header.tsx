"use client"

import { Bell, Download, Settings, MessageCircle, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{ username: string; loginTime: string } | null>(null)

  useEffect(() => {
    const userInfo = localStorage.getItem("segoc-user")
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("segoc-auth")
    localStorage.removeItem("segoc-user")
    router.push("/login")
  }

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const formatLoginTime = (loginTime: string) => {
    return new Date(loginTime).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SE.G.O.C</h1>
            <p className="text-gray-600">Sistema de Gestión de Obras</p>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/demo">
              <Button
                variant="outline"
                size="sm"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Demo Chatbot</span>
                <span className="sm:hidden">Demo</span>
              </Button>
            </Link>

            <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Exportar Datos</span>
            </Button>

            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Settings className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-[#25d366] text-white">
                      {currentUser ? getUserInitials(currentUser.username) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{currentUser?.username || "Usuario"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.username || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Conectado desde: {currentUser ? formatLoginTime(currentUser.loginTime) : "N/A"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
