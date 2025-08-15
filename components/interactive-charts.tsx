"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, PieChart, Calendar, Download } from "lucide-react"
import type { FilterState } from "./filters"

interface InteractiveChartsProps {
  filters: FilterState
}

export function InteractiveCharts({ filters }: InteractiveChartsProps) {
  const [activeChart, setActiveChart] = useState<"progress" | "expenses" | "timeline">("progress")
  const [animationKey, setAnimationKey] = useState(0)
  const [chartData, setChartData] = useState({
    progress: [
      { obra: "Obra Central", progreso: 75, sector: "Estructura", color: "bg-blue-500" },
      { obra: "Obra Norte", progreso: 45, sector: "Cimientos", color: "bg-green-500" },
      { obra: "Obra Sur", progreso: 90, sector: "Acabados", color: "bg-purple-500" },
      { obra: "Obra Este", progreso: 30, sector: "Instalaciones", color: "bg-orange-500" },
    ],
    expenses: [
      { categoria: "Cemento", monto: 450000, porcentaje: 35, color: "bg-red-500" },
      { categoria: "Acero", monto: 320000, porcentaje: 25, color: "bg-blue-500" },
      { categoria: "Ladrillos", monto: 280000, porcentaje: 22, color: "bg-green-500" },
      { categoria: "Otros", monto: 230000, porcentaje: 18, color: "bg-yellow-500" },
    ],
    timeline: [
      { fecha: "Hoy", reportes: 12, completados: 8 },
      { fecha: "Ayer", reportes: 15, completados: 12 },
      { fecha: "2 días", reportes: 10, completados: 9 },
      { fecha: "3 días", reportes: 18, completados: 15 },
    ],
  })

  useEffect(() => {
    // Simular actualización de datos basada en filtros
    const timer = setTimeout(() => {
      setAnimationKey((prev) => prev + 1)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters])

  const exportChart = () => {
    // Simular exportación
    const data = JSON.stringify(chartData[activeChart], null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${activeChart}-data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Análisis Interactivo</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportChart} className="text-xs bg-transparent">
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={activeChart === "progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart("progress")}
            className="text-xs"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Progreso
          </Button>
          <Button
            variant={activeChart === "expenses" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart("expenses")}
            className="text-xs"
          >
            <PieChart className="w-4 h-4 mr-1" />
            Gastos
          </Button>
          <Button
            variant={activeChart === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveChart("timeline")}
            className="text-xs"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Timeline
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Gráfico de Progreso */}
        {activeChart === "progress" && (
          <div key={`progress-${animationKey}`} className="space-y-4">
            {chartData.progress.map((item, index) => (
              <div
                key={item.obra}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.obra}</h4>
                    <p className="text-sm text-gray-600">{item.sector}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {item.progreso}%
                  </Badge>
                </div>
                <Progress value={item.progreso} className="h-3" />
              </div>
            ))}
          </div>
        )}

        {/* Gráfico de Gastos */}
        {activeChart === "expenses" && (
          <div key={`expenses-${animationKey}`} className="space-y-4">
            {chartData.expenses.map((item, index) => (
              <div
                key={item.categoria}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.categoria}</h4>
                    <p className="text-sm text-gray-600">${item.monto.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="outline">{item.porcentaje}%</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {activeChart === "timeline" && (
          <div key={`timeline-${animationKey}`} className="space-y-4">
            {chartData.timeline.map((item, index) => (
              <div
                key={item.fecha}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <h4 className="font-medium text-gray-900">{item.fecha}</h4>
                  <p className="text-sm text-gray-600">
                    {item.completados} de {item.reportes} reportes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={(item.completados / item.reportes) * 100} className="w-20 h-2" />
                  <Badge variant="secondary">{Math.round((item.completados / item.reportes) * 100)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
