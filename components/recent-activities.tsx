import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"

const activities = [
  {
    operario: "Juan Pérez",
    obra: "Obra Villa Crespo",
    actividad: "Contrapiso",
    progreso: 20,
    gastos: "Cemento $40.000, Cal $30.000",
    hora: "10:30",
    fecha: "Hoy",
  },
  {
    operario: "María González",
    obra: "Obra Palermo",
    actividad: "Instalación eléctrica",
    progreso: 65,
    gastos: "Cables $25.000, Conectores $15.000",
    hora: "11:15",
    fecha: "Hoy",
  },
  {
    operario: "Carlos Rodríguez",
    obra: "Obra Belgrano",
    actividad: "Pintura",
    progreso: 90,
    gastos: "Pintura $60.000, Rodillos $8.000",
    hora: "09:45",
    fecha: "Hoy",
  },
  {
    operario: "Ana Martínez",
    obra: "Obra Villa Crespo",
    actividad: "Plomería",
    progreso: 45,
    gastos: "Tuberías $35.000, Accesorios $20.000",
    hora: "12:00",
    fecha: "Hoy",
  },
]

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Actividades Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{activity.operario}</h3>
                  <p className="text-sm text-gray-600">{activity.obra}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{activity.progreso}%</Badge>
                  <p className="text-xs text-gray-500 mt-1">{activity.hora}</p>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">Actividad: {activity.actividad}</p>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mt-0.5 text-green-600" />
                <span>{activity.gastos}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
