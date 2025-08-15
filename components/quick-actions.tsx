"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, List, LayoutGrid, RefreshCw, Download, Bell, Settings, Plus, Search } from "lucide-react"

interface QuickActionsProps {
  onViewModeChange: (mode: "grid" | "list" | "cards") => void
  currentViewMode: "grid" | "list" | "cards"
  onRefreshIntervalChange: (interval: number) => void
  currentRefreshInterval: number
}

export function QuickActions({
  onViewModeChange,
  currentViewMode,
  onRefreshIntervalChange,
  currentRefreshInterval,
}: QuickActionsProps) {
  const refreshIntervals = [
    { label: "10s", value: 10000 },
    { label: "30s", value: 30000 },
    { label: "1m", value: 60000 },
    { label: "5m", value: 300000 },
  ]

  return (
    <Card className="border-0 shadow-lg w-full max-w-full overflow-hidden">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-4">
          {/* Modos de vista */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">Vista:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Button
                variant={currentViewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="text-xs flex-shrink-0"
              >
                <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={currentViewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="text-xs flex-shrink-0"
              >
                <List className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Lista
              </Button>
              <Button
                variant={currentViewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("cards")}
                className="text-xs flex-shrink-0"
              >
                <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Cards
              </Button>
            </div>
          </div>

          {/* Intervalo de actualización */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">Auto-refresh:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {refreshIntervals.map((interval) => (
                <Button
                  key={interval.value}
                  variant={currentRefreshInterval === interval.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRefreshIntervalChange(interval.value)}
                  className="text-xs flex-shrink-0"
                >
                  {interval.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-gray-700 flex-shrink-0 sm:hidden">Acciones:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Button variant="outline" size="sm" className="text-xs bg-transparent flex-shrink-0">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Nuevo Reporte</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs bg-transparent flex-shrink-0">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Exportar Todo</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs bg-transparent flex-shrink-0">
                <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden lg:inline">Búsqueda Avanzada</span>
                <span className="lg:hidden">Buscar</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs bg-transparent flex-shrink-0">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Configurar</span>
                <span className="sm:hidden">Config</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Indicadores de estado */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Sistema activo</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
            <span className="text-xs text-gray-600">Actualizando cada {currentRefreshInterval / 1000}s</span>
          </div>
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            <Bell className="w-3 h-3 mr-1" />3 notificaciones
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
