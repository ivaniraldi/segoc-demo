"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente al login si no está autenticado
    const auth = localStorage.getItem("segoc-auth")
    if (auth) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25d366] mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando SE.G.O.C...</p>
      </div>
    </div>
  )
}
