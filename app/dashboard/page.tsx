"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ActiveWorkers } from "@/components/active-workers"
import { RecentActivities } from "@/components/recent-activities"
import { ProjectProgress } from "@/components/project-progress"
import { ExpensesChart } from "@/components/expenses-chart"
import { DataTable } from "@/components/data-table"
import { Filters, type FilterState } from "@/components/filters"
import { NotificationPanel } from "@/components/notification-panel"
import { InteractiveCharts } from "@/components/interactive-charts"
import { WorkerDetailsModal } from "@/components/worker-details-modal"
import { RealTimeStats } from "@/components/real-time-stats"
import { QuickActions } from "@/components/quick-actions"
import { ExportManager } from "@/components/export-manager"

export default function Dashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "cards">("grid")
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 segundos
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    selectedWork: "",
    selectedWorker: "",
    searchTerm: "",
  })

  useEffect(() => {
    const auth = localStorage.getItem("segoc-auth")
    if (!auth) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const event = new CustomEvent("refreshDashboard")
      window.dispatchEvent(event)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [isAuthenticated, refreshInterval])

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleWorkerSelect = useCallback((workerId: string) => {
    setSelectedWorker(workerId)
  }, [])

  const handleViewModeChange = useCallback((mode: "grid" | "list" | "cards") => {
    setViewMode(mode)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25d366] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <DashboardHeader />
      <NotificationPanel />

      <main className="w-full max-w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8 w-full">
          <RealTimeStats />

          <div className="w-full max-w-full overflow-hidden">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full flex flex-col lg:flex-row gap-3 sm:gap-4">
                <div className="w-full lg:flex-1 min-w-0 overflow-hidden">
                  <QuickActions
                    onViewModeChange={handleViewModeChange}
                    currentViewMode={viewMode}
                    onRefreshIntervalChange={setRefreshInterval}
                    currentRefreshInterval={refreshInterval}
                  />
                </div>
                <div className="w-full lg:w-auto lg:flex-shrink-0">
                  <ExportManager filters={filters} />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-full overflow-hidden">
            <Filters onFiltersChange={handleFiltersChange} />
          </div>

          <div className="w-full max-w-full overflow-hidden">
            <InteractiveCharts filters={filters} />
          </div>

          <div className="w-full max-w-full overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8 min-w-0 overflow-hidden">
                <ActiveWorkers onWorkerSelect={handleWorkerSelect} viewMode={viewMode} />
                <DataTable filters={filters} viewMode={viewMode} onWorkerSelect={handleWorkerSelect} />
              </div>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8 min-w-0 overflow-hidden">
                <ProjectProgress interactive={true} />
                <ExpensesChart interactive={true} />
                <RecentActivities onWorkerSelect={handleWorkerSelect} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedWorker && <WorkerDetailsModal workerId={selectedWorker} onClose={() => setSelectedWorker(null)} />}
    </div>
  )
}
