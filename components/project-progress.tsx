import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building } from "lucide-react"

const projects = [
  {
    name: "Obra Villa Crespo",
    sectores: [
      { name: "Sector A", progreso: 75 },
      { name: "Sector B", progreso: 30 },
      { name: "Sector C", progreso: 90 },
    ],
    progresoGeneral: 65,
  },
  {
    name: "Obra Palermo",
    sectores: [
      { name: "Sector A", progreso: 85 },
      { name: "Sector B", progreso: 60 },
    ],
    progresoGeneral: 72,
  },
  {
    name: "Obra Belgrano",
    sectores: [
      { name: "Sector A", progreso: 95 },
      { name: "Sector B", progreso: 88 },
      { name: "Sector C", progreso: 92 },
    ],
    progresoGeneral: 92,
  },
]

export function ProjectProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Progreso de Obras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <span className="text-sm font-medium text-gray-600">{project.progresoGeneral}%</span>
              </div>

              <Progress value={project.progresoGeneral} className="h-2" />

              <div className="space-y-2">
                {project.sectores.map((sector, sectorIndex) => (
                  <div key={sectorIndex} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{sector.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${sector.progreso}%` }} />
                      </div>
                      <span className="text-gray-500 w-8">{sector.progreso}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
