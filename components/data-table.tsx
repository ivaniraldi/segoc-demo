"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Download, Clock, CheckCircle, AlertCircle, ArrowUpDown } from "lucide-react"
import type { FilterState } from "./filters"

interface DashboardData {
  id: string
  nombre: string
  obra: string
  sector: string
  actividad: string
  progreso: string
  gastos: string
  horaInicio: string
  horaFin?: string
  fecha: string
  timestamp: string
  status: string
}

interface DataTableProps {
  filters: FilterState
}

export function DataTable({ filters }: DataTableProps) {
  const [data, setData] = useState<DashboardData[]>([])
  const [sortField, setSortField] = useState<keyof DashboardData>("fecha")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const dashboardData = JSON.parse(localStorage.getItem("segoc-dashboard-data") || "[]")
    setData(dashboardData)
  }, [])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.nombre.toLowerCase().includes(searchLower) ||
          item.obra.toLowerCase().includes(searchLower) ||
          item.sector.toLowerCase().includes(searchLower) ||
          item.actividad.toLowerCase().includes(searchLower) ||
          item.gastos.toLowerCase().includes(searchLower),
      )
    }

    // Filtro por fecha desde
    if (filters.dateFrom) {
      filtered = filtered.filter((item) => item.fecha >= filters.dateFrom)
    }

    // Filtro por fecha hasta
    if (filters.dateTo) {
      filtered = filtered.filter((item) => item.fecha <= filters.dateTo)
    }

    // Filtro por obra
    if (filters.selectedWork) {
      filtered = filtered.filter((item) => item.obra === filters.selectedWork)
    }

    // Filtro por operario
    if (filters.selectedWorker) {
      filtered = filtered.filter((item) => item.nombre === filters.selectedWorker)
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Manejo especial para fechas
      if (sortField === "fecha") {
        aValue = new Date(aValue as string).getTime().toString()
        bValue = new Date(bValue as string).getTime().toString()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [data, filters, sortField, sortDirection])

  const handleSort = (field: keyof DashboardData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getStatusBadge = (status: string, horaFin?: string) => {
    if (status === "completed" && horaFin) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completado
        </Badge>
      )
    } else if (status === "in-progress") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />
          En Progreso
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const exportData = () => {
    const csvContent = [
      ["Fecha", "Operario", "Obra", "Sector", "Actividad", "Progreso", "Gastos", "Hora Inicio", "Hora Fin", "Estado"],
      ...filteredData.map((item) => [
        formatDate(item.fecha),
        item.nombre,
        item.obra,
        item.sector,
        item.actividad,
        item.progreso,
        item.gastos,
        item.horaInicio,
        item.horaFin || "En progreso",
        item.status === "completed" ? "Completado" : "En progreso",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-segoc-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">Registros Detallados</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Mostrando {filteredData.length} de {data.length} registros
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={exportData}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900 bg-transparent"
            disabled={filteredData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {data.length === 0 ? "No hay datos disponibles" : "No se encontraron resultados"}
            </h3>
            <p className="text-gray-500 mb-4">
              {data.length === 0
                ? "Complete algunas simulaciones del chatbot para ver los datos aquí"
                : "Intente ajustar los filtros para encontrar los datos que busca"}
            </p>
            {data.length === 0 && (
              <Button asChild>
                <a href="/demo">Ir a Demo Chatbot</a>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort("fecha")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Fecha</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Operario</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-50 select-none" onClick={() => handleSort("obra")}>
                    <div className="flex items-center space-x-1">
                      <span>Obra</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Gastos</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{formatDate(item.fecha)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {item.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span>{item.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.obra}</TableCell>
                    <TableCell>{item.sector}</TableCell>
                    <TableCell>{item.actividad}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {item.progreso}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.gastos}</TableCell>
                    <TableCell className="text-sm">
                      <div>{item.horaInicio}</div>
                      {item.horaFin && <div className="text-gray-500">- {item.horaFin}</div>}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status, item.horaFin)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
