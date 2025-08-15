"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // Simular notificaciones basadas en datos del dashboard
    const dashboardData = JSON.parse(localStorage.getItem("segoc-dashboard-data") || "[]")
    const existingNotifications = JSON.parse(localStorage.getItem("segoc-notifications") || "[]")

    // Generar notificaciones para nuevos reportes
    const newNotifications: Notification[] = []

    dashboardData.forEach((item: any) => {
      const existingNotif = existingNotifications.find((n: any) => n.id === `report-${item.id}`)
      if (!existingNotif) {
        newNotifications.push({
          id: `report-${item.id}`,
          type: "success",
          title: "Nuevo reporte completado",
          message: `${item.nombre} completó el reporte de ${item.obra}`,
          timestamp: item.timestamp,
          read: false,
        })
      }
    })

    // Agregar notificaciones de ejemplo
    if (existingNotifications.length === 0) {
      newNotifications.push(
        {
          id: "welcome",
          type: "info",
          title: "Bienvenido a SE.G.O.C",
          message: "Sistema de gestión de obras iniciado correctamente",
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: "demo-ready",
          type: "info",
          title: "Demo disponible",
          message: "Prueba el chatbot de WhatsApp en la sección Demo",
          timestamp: new Date().toISOString(),
          read: false,
        },
      )
    }

    const allNotifications = [...existingNotifications, ...newNotifications]
    setNotifications(allNotifications)
    localStorage.setItem("segoc-notifications", JSON.stringify(allNotifications))
  }, [])

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    localStorage.setItem("segoc-notifications", JSON.stringify(updated))
  }

  const removeNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem("segoc-notifications", JSON.stringify(updated))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    })
  }

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setShowPanel(!showPanel)}
          className="relative bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          size="sm"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      {showPanel && (
        <div className="fixed top-16 right-4 z-40 w-80 max-h-96 overflow-y-auto">
          <Card className="shadow-xl border border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                <Button
                  onClick={() => setShowPanel(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No hay notificaciones</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
