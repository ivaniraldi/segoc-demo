"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileSpreadsheet, Share2, CheckCircle } from "lucide-react"
import type { FilterState } from "@/components/filters"

interface ExportManagerProps {
  filters: FilterState
}

export function ExportManager({ filters }: ExportManagerProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  const getFilteredData = () => {
    const rawData = localStorage.getItem("segoc-demo-data")
    if (!rawData) return []

    let data = JSON.parse(rawData)

    // Apply filters
    if (filters.dateFrom) {
      data = data.filter((item: any) => new Date(item.timestamp) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      data = data.filter((item: any) => new Date(item.timestamp) <= new Date(filters.dateTo))
    }
    if (filters.selectedWork) {
      data = data.filter((item: any) => item.obra === filters.selectedWork)
    }
    if (filters.selectedWorker) {
      data = data.filter((item: any) => item.operario === filters.selectedWorker)
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      data = data.filter(
        (item: any) =>
          item.operario.toLowerCase().includes(term) ||
          item.obra.toLowerCase().includes(term) ||
          item.sector.toLowerCase().includes(term) ||
          item.actividad.toLowerCase().includes(term),
      )
    }

    return data
  }

  const exportToCSV = () => {
    setIsExporting(true)
    const data = getFilteredData()

    if (data.length === 0) {
      alert("No hay datos para exportar con los filtros actuales")
      setIsExporting(false)
      return
    }

    const headers = ["Fecha", "Hora", "Operario", "Obra", "Sector", "Actividad", "Progreso", "Gastos", "Estado"]
    const csvContent = [
      headers.join(","),
      ...data.map((item: any) =>
        [
          new Date(item.timestamp).toLocaleDateString(),
          new Date(item.timestamp).toLocaleTimeString(),
          item.operario,
          item.obra,
          item.sector,
          item.actividad,
          `${item.progreso}%`,
          item.gastos || "Sin gastos",
          item.estado || "Completado",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `segoc-reportes-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportSuccess("CSV")
    setTimeout(() => setExportSuccess(null), 3000)
    setIsExporting(false)
  }

  const exportToExcel = () => {
    setIsExporting(true)
    const data = getFilteredData()

    if (data.length === 0) {
      alert("No hay datos para exportar con los filtros actuales")
      setIsExporting(false)
      return
    }

    // Create Excel-compatible format
    const excelData = data.map((item: any) => ({
      Fecha: new Date(item.timestamp).toLocaleDateString(),
      Hora: new Date(item.timestamp).toLocaleTimeString(),
      Operario: item.operario,
      Obra: item.obra,
      Sector: item.sector,
      Actividad: item.actividad,
      Progreso: `${item.progreso}%`,
      Gastos: item.gastos || "Sin gastos",
      Estado: item.estado || "Completado",
    }))

    // Convert to CSV format for Excel compatibility
    const headers = Object.keys(excelData[0])
    const csvContent = [
      headers.join(","),
      ...excelData.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `segoc-reportes-${new Date().toISOString().split("T")[0]}.xlsx`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportSuccess("Excel")
    setTimeout(() => setExportSuccess(null), 3000)
    setIsExporting(false)
  }

  const exportToGoogleSheets = () => {
    setIsExporting(true)
    const data = getFilteredData()

    if (data.length === 0) {
      alert("No hay datos para exportar con los filtros actuales")
      setIsExporting(false)
      return
    }

    // Create Google Sheets compatible format
    const sheetData = [
      ["Fecha", "Hora", "Operario", "Obra", "Sector", "Actividad", "Progreso", "Gastos", "Estado"],
      ...data.map((item: any) => [
        new Date(item.timestamp).toLocaleDateString(),
        new Date(item.timestamp).toLocaleTimeString(),
        item.operario,
        item.obra,
        item.sector,
        item.actividad,
        `${item.progreso}%`,
        item.gastos || "Sin gastos",
        item.estado || "Completado",
      ]),
    ]

    // Create CSV for Google Sheets import
    const csvContent = sheetData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `segoc-google-sheets-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show instructions for Google Sheets
    setTimeout(() => {
      alert(
        "Archivo descargado. Para importar a Google Sheets:\n1. Abre Google Sheets\n2. Archivo > Importar\n3. Selecciona el archivo descargado\n4. Elige 'Separado por comas' como tipo",
      )
    }, 500)

    setExportSuccess("Google Sheets")
    setTimeout(() => setExportSuccess(null), 3000)
    setIsExporting(false)
  }

  return (
    <Card className="p-3 sm:p-4 w-full max-w-full overflow-hidden">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center flex-shrink-0">
          <Download className="h-4 w-4 mr-2" />
          Exportar Datos
        </h3>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportToCSV}
            disabled={isExporting}
            size="sm"
            variant="outline"
            className="text-xs bg-transparent flex-shrink-0"
          >
            {exportSuccess === "CSV" ? (
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <FileSpreadsheet className="h-3 w-3 mr-1" />
            )}
            CSV
          </Button>

          <Button
            onClick={exportToExcel}
            disabled={isExporting}
            size="sm"
            variant="outline"
            className="text-xs bg-transparent flex-shrink-0"
          >
            {exportSuccess === "Excel" ? (
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <FileSpreadsheet className="h-3 w-3 mr-1" />
            )}
            Excel
          </Button>

          <Button
            onClick={exportToGoogleSheets}
            disabled={isExporting}
            size="sm"
            variant="outline"
            className="text-xs bg-transparent flex-shrink-0"
          >
            {exportSuccess === "Google Sheets" ? (
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <Share2 className="h-3 w-3 mr-1" />
            )}
            <span className="hidden sm:inline">Google Sheets</span>
            <span className="sm:hidden">Sheets</span>
          </Button>
        </div>

        {isExporting && (
          <div className="text-xs text-gray-500 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
            Exportando datos...
          </div>
        )}
      </div>
    </Card>
  )
}
