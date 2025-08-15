"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Activity, DollarSign, TrendingUp, Clock } from "lucide-react"

export function RealTimeStats() {
  const [stats, setStats] = useState({
    activeWorkers: 12,
    totalWorks: 4,
    todayReports: 8,
    totalExpenses: 1280000,
    avgProgress: 62,
    lastUpdate: new Date(),
  })

  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const handleRefresh = () => {
      setIsUpdating(true)

      // Simular actualización de datos
      setTimeout(() => {
        setStats((prev) => ({
          ...prev,
          activeWorkers: prev.activeWorkers + Math.floor(Math.random() * 3) - 1,
          todayReports: prev.todayReports + Math.floor(Math.random() * 2),
          totalExpenses: prev.totalExpenses + Math.floor(Math.random() * 50000) - 25000,
          avgProgress: Math.min(100, prev.avgProgress + Math.floor(Math.random() * 5) - 2),
          lastUpdate: new Date(),
        }))
        setIsUpdating(false)
      }, 1000)
    }

    window.addEventListener("refreshDashboard", handleRefresh)
    return () => window.removeEventListener("refreshDashboard", handleRefresh)
  }, [])

  const statCards = [
    {
      title: "Operarios Activos",
      value: stats.activeWorkers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2 desde ayer",
    },
    {
      title: "Obras en Progreso",
      value: stats.totalWorks,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "Sin cambios",
    },
    {
      title: "Reportes Hoy",
      value: stats.todayReports,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+3 desde ayer",
    },
    {
      title: "Gastos Totales",
      value: `$${stats.totalExpenses.toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5.2% esta semana",
    },
    {
      title: "Progreso Promedio",
      value: `${stats.avgProgress}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+8% este mes",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard en Tiempo Real</h2>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Última actualización: {stats.lastUpdate.toLocaleTimeString()}</span>
          {isUpdating && (
            <Badge variant="secondary" className="animate-pulse">
              Actualizando...
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                isUpdating ? "animate-pulse" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    En vivo
                  </Badge>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
