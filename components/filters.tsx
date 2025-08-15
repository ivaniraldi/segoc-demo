"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar, Filter, Search, X } from "lucide-react"

interface FilterProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  dateFrom: string
  dateTo: string
  selectedWork: string
  selectedWorker: string
  searchTerm: string
}

export function Filters({ onFiltersChange }: FilterProps) {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedWork, setSelectedWork] = useState("all")
  const [selectedWorker, setSelectedWorker] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    onFiltersChange({
      dateFrom,
      dateTo,
      selectedWork,
      selectedWorker,
      searchTerm,
    })
  }, [dateFrom, dateTo, selectedWork, selectedWorker, searchTerm])

  const clearFilters = () => {
    setDateFrom("")
    setDateTo("")
    setSelectedWork("all")
    setSelectedWorker("all")
    setSearchTerm("")
  }

  return (
    <Card className="p-3 sm:p-4 lg:p-6 bg-white shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Filtros de Búsqueda</h3>
        </div>
        <Button
          onClick={clearFilters}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 self-start sm:self-auto"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="text-xs sm:text-sm">Limpiar</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {/* Búsqueda general */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
          />
        </div>

        {/* Fecha desde */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            type="date"
            placeholder="Fecha desde"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
          />
        </div>

        {/* Fecha hasta */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            type="date"
            placeholder="Fecha hasta"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="pl-8 sm:pl-10 text-sm h-9 sm:h-10"
          />
        </div>

        {/* Filtro por obra */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Select value={selectedWork} onValueChange={setSelectedWork}>
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Seleccionar obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las obras</SelectItem>
              <SelectItem value="Obra Centro Comercial">🏢 Obra Centro Comercial</SelectItem>
              <SelectItem value="Obra Residencial Norte">🏠 Obra Residencial Norte</SelectItem>
              <SelectItem value="Obra Industrial Sur">🏭 Obra Industrial Sur</SelectItem>
              <SelectItem value="Obra Plaza Principal">🏛️ Obra Plaza Principal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por operario */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Select value={selectedWorker} onValueChange={setSelectedWorker}>
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Seleccionar operario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los operarios</SelectItem>
              <SelectItem value="Usuario Demo 1">👤 Usuario Demo 1</SelectItem>
              <SelectItem value="Usuario Demo 2">👤 Usuario Demo 2</SelectItem>
              <SelectItem value="Usuario Demo 3">👤 Usuario Demo 3</SelectItem>
              <SelectItem value="Usuario Demo 4">👤 Usuario Demo 4</SelectItem>
              <SelectItem value="Usuario Demo 5">👤 Usuario Demo 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
