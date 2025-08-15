"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, MapPin, Clock, DollarSign, Calendar, Phone, Mail } from "lucide-react"

interface WorkerDetailsModalProps {
  workerId: string
  onClose: () => void
}

export function WorkerDetailsModal({ workerId, onClose }: WorkerDetailsModalProps) {
  const [workerData, setWorkerData] = useState({
    name: "Juan Pérez",
    phone: "+54 11 1234-5678",
    email: "juan.perez@segoc.com",
    currentWork: "Obra Central",
    currentSector: "Estructura - Piso 3",
    currentActivity: "Instalación de vigas",
    progress: 75,
    startTime: "08:30",
    expenses: [
      { item: "Cemento", amount: 45000, time: "10:15" },
      { item: "Acero", amount: 32000, time: "14:30" },
    ],
    recentActivities: [
      { date: "2024-01-15", work: "Obra Norte", activity: "Cimientos", progress: 90 },
      { date: "2024-01-14", work: "Obra Sur", activity: "Estructura", progress: 85 },
      { date: "2024-01-13", work: "Obra Central", activity: "Instalaciones", progress: 70 },
    ],
    stats: {
      totalReports: 45,
      avgProgress: 78,
      totalExpenses: 890000,
      workedDays: 23,
    },
  })

  useEffect(() => {
    console.log(`[SykoTech] Loading data for worker: ${workerId}`)
  }, [workerId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Operario</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {workerData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                {workerData.name}
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Activo
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{workerData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{workerData.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado actual */}
          <Card>
            <CardHeader>
              <CardTitle>Estado Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{workerData.currentWork}</p>
                    <p className="text-sm text-gray-600">{workerData.currentSector}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-medium">Desde las {workerData.startTime}</p>
                    <p className="text-sm text-gray-600">Tiempo activo</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{workerData.currentActivity}</span>
                  <Badge variant="outline">{workerData.progress}%</Badge>
                </div>
                <Progress value={workerData.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Gastos del día */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                Gastos de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workerData.expenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{expense.item}</p>
                      <p className="text-sm text-gray-600">{expense.time}</p>
                    </div>
                    <Badge variant="secondary">${expense.amount.toLocaleString()}</Badge>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total del día:</span>
                    <span className="text-orange-600">
                      ${workerData.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{workerData.stats.totalReports}</p>
                <p className="text-sm text-gray-600">Reportes Totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{workerData.stats.avgProgress}%</p>
                <p className="text-sm text-gray-600">Progreso Promedio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  ${(workerData.stats.totalExpenses / 1000).toFixed(0)}k
                </p>
                <p className="text-sm text-gray-600">Gastos Totales</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{workerData.stats.workedDays}</p>
                <p className="text-sm text-gray-600">Días Trabajados</p>
              </CardContent>
            </Card>
          </div>

          {/* Actividades recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Actividades Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workerData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.work}</p>
                      <p className="text-sm text-gray-600">{activity.activity}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Badge variant="outline">{activity.progress}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
