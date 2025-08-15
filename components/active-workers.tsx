import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import { Users } from "lucide-react" // Declared the Users variable

const workers = [
  {
    name: "Juan Pérez",
    phone: "+54 11 1234-5678",
    obra: "Obra Villa Crespo",
    sector: "Sector B",
    actividad: "Contrapiso",
    progreso: 20,
    horaInicio: "08:30",
    status: "activo",
  },
  {
    name: "María González",
    phone: "+54 11 2345-6789",
    obra: "Obra Palermo",
    sector: "Sector A",
    actividad: "Instalación eléctrica",
    progreso: 65,
    horaInicio: "07:45",
    status: "activo",
  },
  {
    name: "Carlos Rodríguez",
    phone: "+54 11 3456-7890",
    obra: "Obra Belgrano",
    sector: "Sector C",
    actividad: "Pintura",
    progreso: 90,
    horaInicio: "09:00",
    status: "activo",
  },
  {
    name: "Ana Martínez",
    phone: "+54 11 4567-8901",
    obra: "Obra Villa Crespo",
    sector: "Sector A",
    actividad: "Plomería",
    progreso: 45,
    horaInicio: "08:15",
    status: "activo",
  },
]

export function ActiveWorkers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Operarios Activos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workers.map((worker, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {worker.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {worker.obra} - {worker.sector}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Inicio: {worker.horaInicio}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{worker.actividad}</span>
                    <span className="font-medium">{worker.progreso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${worker.progreso}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
