import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"

const expenses = [
  { categoria: "Cemento", monto: 120000, porcentaje: 35 },
  { categoria: "Pintura", monto: 85000, porcentaje: 25 },
  { categoria: "Cables/Eléctricos", monto: 65000, porcentaje: 19 },
  { categoria: "Plomería", monto: 45000, porcentaje: 13 },
  { categoria: "Otros", monto: 25000, porcentaje: 8 },
]

const totalGastos = expenses.reduce((sum, expense) => sum + expense.monto, 0)

export function ExpensesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Gastos por Categoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">${totalGastos.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total gastos hoy</p>
          </div>

          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{expense.categoria}</span>
                  <span className="text-sm text-gray-600">${expense.monto.toLocaleString()}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${expense.porcentaje}%` }}
                  />
                </div>

                <div className="text-xs text-gray-500 text-right">{expense.porcentaje}%</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <TrendingUp className="h-4 w-4" />
            <span>15% menos que ayer</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
