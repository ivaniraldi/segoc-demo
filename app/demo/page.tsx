"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Phone, Video, MoreVertical, Check, CheckCheck, Clock, Send, Paperclip, Smile } from "lucide-react"
import Link from "next/link"

interface ChatData {
  nombre: string
  telefono: string
  obra: string
  sector: string
  actividad: string
  progreso: string
  gastos: string
  horaInicio: string
  horaFin?: string
  sessionId: string
  fecha: string
  userId: string
}

interface Message {
  id: string
  type: "bot" | "user"
  text: string
  time: string
  status?: "sending" | "sent" | "delivered" | "read"
}

type ChatStep =
  | "inicio"
  | "confirmar-obra"
  | "confirmar-sector"
  | "indicar-actividad"
  | "progreso-actividad"
  | "registro-gastos"
  | "finalizado"

const STORAGE_KEY = "segoc-chat-data"
const MESSAGES_KEY = "segoc-messages"
const DEMO_COUNTER_KEY = "segoc-demo-counter"
const DASHBOARD_DATA_KEY = "segoc-demo-data" // Cambiado para coincidir con el dashboard

export default function WhatsAppDemo() {
  const [currentStep, setCurrentStep] = useState<ChatStep>("inicio")
  const [chatData, setChatData] = useState<ChatData>({
    nombre: "",
    telefono: "+54 9 11 1234-5678",
    obra: "",
    sector: "",
    actividad: "",
    progreso: "",
    gastos: "",
    horaInicio: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    sessionId: Date.now().toString(),
    fecha: new Date().toISOString().split("T")[0],
    userId: "",
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [textInputValue, setTextInputValue] = useState("")
  const [textInputPlaceholder, setTextInputPlaceholder] = useState("")
  const [hasInitialized, setHasInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    const savedMessages = localStorage.getItem(MESSAGES_KEY)

    // Generar usuario demo único
    const demoCounter = Number.parseInt(localStorage.getItem(DEMO_COUNTER_KEY) || "0") + 1
    localStorage.setItem(DEMO_COUNTER_KEY, demoCounter.toString())

    const demoUser = {
      nombre: `Usuario Demo ${demoCounter}`,
      userId: `demo_${demoCounter}_${Date.now()}`,
    }

    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setChatData({ ...parsedData, ...demoUser })
    } else {
      setChatData((prev) => ({ ...prev, ...demoUser }))
    }

    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      setMessages(parsedMessages)
      determineCurrentStep(parsedMessages)
    } else if (!hasInitialized) {
      initializeChat(demoUser.nombre)
    }
    setHasInitialized(true)
  }, [])

  useEffect(() => {
    if (showTextInput && textInputRef.current) {
      textInputRef.current.focus()
    }
  }, [showTextInput])

  const initializeChat = (userName: string) => {
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      text: `Hola ${userName}, comenzemos con la gestión del día`,
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
    }
    setMessages([welcomeMessage])

    setTimeout(() => {
      setShowOptions(true)
    }, 1500)
  }

  const determineCurrentStep = (msgs: Message[]) => {
    const userMessages = msgs.filter((m) => m.type === "user")
    const lastMessage = userMessages[userMessages.length - 1]?.text || ""

    if (lastMessage.includes("No me encuentro en servicio") || lastMessage.includes("Cancelar")) {
      setCurrentStep("finalizado")
      setShowOptions(false)
    } else if (userMessages.length >= 5) {
      setCurrentStep("finalizado")
      setShowOptions(false)
    } else if (userMessages.length === 4) {
      setCurrentStep("registro-gastos")
      setShowOptions(true)
    } else if (userMessages.length === 3) {
      setCurrentStep("progreso-actividad")
      setShowOptions(true)
    } else if (userMessages.length === 2) {
      setCurrentStep("indicar-actividad")
      setShowOptions(true)
    } else if (userMessages.length === 1) {
      setCurrentStep("confirmar-sector")
      setShowOptions(true)
    } else {
      setCurrentStep("inicio")
      setShowOptions(true)
    }
  }

  const saveToDashboard = (completedData: ChatData) => {
    const existingData = JSON.parse(localStorage.getItem(DASHBOARD_DATA_KEY) || "[]")
    const newEntry = {
      ...completedData,
      id: completedData.sessionId,
      timestamp: new Date().toISOString(),
      status: "completed",
      operario: completedData.nombre, // Agregado para compatibilidad con dashboard
      estado: "Completado", // Agregado para compatibilidad con dashboard
    }
    existingData.push(newEntry)
    localStorage.setItem(DASHBOARD_DATA_KEY, JSON.stringify(existingData))

    const event = new CustomEvent("demoDataUpdated", { detail: newEntry })
    window.dispatchEvent(event)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatData))
  }, [chatData])

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (type: "bot" | "user", text: string, callback?: () => void) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      text,
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      status: type === "user" ? "sending" : "delivered",
    }

    setMessages((prev) => [...prev, newMessage])

    if (type === "user") {
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))
      }, 500)

      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      }, 1500)
    }

    if (callback) {
      setTimeout(callback, type === "user" ? 2000 : 500)
    }
  }

  const handleOption = (option: string, nextStep: ChatStep, dataField?: keyof ChatData) => {
    setShowOptions(false)
    setShowTextInput(false)
    addMessage("user", option)

    if (dataField && option !== "Cancelar atendimiento") {
      setChatData((prev) => ({ ...prev, [dataField]: option }))
    }

    setTimeout(() => {
      if (nextStep === "finalizado") {
        setCurrentStep(nextStep)
        if (option.includes("Cancelar")) {
          addMessage("bot", "Gracias por tu tiempo. ¡Hasta luego!")
        }
      } else {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          addBotMessage(nextStep)
          setCurrentStep(nextStep)
          setShowOptions(true)
        }, 1500)
      }
    }, 2000)
  }

  const addBotMessage = (step: ChatStep) => {
    let message = ""
    switch (step) {
      case "confirmar-obra":
        message = "Por favor indíquenos en qué obra se encuentra"
        break
      case "confirmar-sector":
        message = "Por favor indíquenos en qué sector de la obra se encuentra"
        break
      case "indicar-actividad":
        message = "Por favor indique qué actividad se está realizando"
        break
      case "progreso-actividad":
        message = "Por favor indique el progreso de la actividad en %"
        break
      case "registro-gastos":
        message = "Por favor, indique si hay algún gasto en materiales. Seleccione una opción o escriba los detalles:"
        break
    }
    if (message) {
      addMessage("bot", message)
    }
  }

  const handleTextInput = (text: string, nextStep: ChatStep, dataField: keyof ChatData) => {
    setShowOptions(false)
    setShowTextInput(false)
    addMessage("user", text)
    setChatData((prev) => ({ ...prev, [dataField]: text }))

    setTimeout(() => {
      if (nextStep === "finalizado") {
        const completedData = {
          ...chatData,
          [dataField]: text,
          horaFin: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        }
        setChatData(completedData)
        setCurrentStep(nextStep)
        saveToDashboard(completedData)
        setTimeout(() => {
          addMessage(
            "bot",
            "¡Perfecto! Hemos registrado toda la información. Gracias por completar el reporte diario. 📋✅",
          )
        }, 1500)
      } else {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          addBotMessage(nextStep)
          setCurrentStep(nextStep)
          setShowOptions(true)
        }, 1500)
      }
    }, 2000)
  }

  const showCustomTextInput = (placeholder: string) => {
    setShowOptions(false)
    setTextInputPlaceholder(placeholder)
    setTextInputValue("")
    setShowTextInput(true)
  }

  const sendCustomText = () => {
    if (!textInputValue.trim()) return

    const text = textInputValue.trim()
    let nextStep: ChatStep = "finalizado"
    let dataField: keyof ChatData = "gastos"

    switch (currentStep) {
      case "confirmar-obra":
        nextStep = "confirmar-sector"
        dataField = "obra"
        break
      case "confirmar-sector":
        nextStep = "indicar-actividad"
        dataField = "sector"
        break
      case "indicar-actividad":
        nextStep = "progreso-actividad"
        dataField = "actividad"
        break
      case "progreso-actividad":
        nextStep = "registro-gastos"
        dataField = "progreso"
        break
      case "registro-gastos":
        nextStep = "finalizado"
        dataField = "gastos"
        break
    }

    handleTextInput(text, nextStep, dataField)
    setTextInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendCustomText()
    }
  }

  const resetChat = () => {
    const demoCounter = Number.parseInt(localStorage.getItem(DEMO_COUNTER_KEY) || "0") + 1
    localStorage.setItem(DEMO_COUNTER_KEY, demoCounter.toString())

    const newSessionId = Date.now().toString()
    const resetData = {
      ...chatData,
      nombre: `Usuario Demo ${demoCounter}`,
      userId: `demo_${demoCounter}_${Date.now()}`,
      obra: "",
      sector: "",
      actividad: "",
      progreso: "",
      gastos: "",
      horaInicio: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      sessionId: newSessionId,
      fecha: new Date().toISOString().split("T")[0],
    }

    setChatData(resetData)
    setCurrentStep("inicio")
    setShowOptions(false)
    setShowTextInput(false)
    setMessages([])
    setIsTyping(false)
    setHasInitialized(false)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(MESSAGES_KEY)

    setTimeout(() => {
      initializeChat(resetData.nombre)
    }, 500)
  }

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
      default:
        return null
    }
  }

  const renderTypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border max-w-xs rounded-bl-md">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    if (!showOptions) return null

    const buttonClass =
      "w-full bg-[#25d366] hover:bg-[#20bd5a] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
    const outlineButtonClass =
      "w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium bg-white text-sm sm:text-base"

    switch (currentStep) {
      case "inicio":
        return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-[#f0f0f0]">
            <Button onClick={() => handleOption("Estoy en la obra", "confirmar-obra")} className={buttonClass}>
              🏗️ Estoy en la obra
            </Button>
            <Button
              onClick={() => handleOption("No me encuentro en servicio", "finalizado")}
              variant="outline"
              className={outlineButtonClass}
            >
              ❌ No me encuentro en servicio
            </Button>
          </div>
        )

      case "confirmar-obra":
        return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-[#f0f0f0]">
            {["🏢 Obra Centro Comercial", "🏠 Obra Residencial Norte", "🏭 Obra Industrial Sur"].map((obra) => (
              <Button key={obra} onClick={() => handleOption(obra, "confirmar-sector", "obra")} className={buttonClass}>
                {obra}
              </Button>
            ))}
            <Button
              onClick={() => showCustomTextInput("Escriba el nombre de la obra...")}
              className="w-full bg-[#34b7f1] hover:bg-[#2da5d9] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
            >
              ✏️ Escribir otra obra
            </Button>
            <Button
              onClick={() => handleOption("Cancelar atendimiento", "finalizado")}
              variant="outline"
              className={outlineButtonClass}
            >
              ❌ Cancelar atendimiento
            </Button>
          </div>
        )

      case "confirmar-sector":
        return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-[#f0f0f0]">
            {["📍 Sector A - Planta Baja", "📍 Sector B - Primer Piso", "📍 Sector C - Segundo Piso"].map((sector) => (
              <Button
                key={sector}
                onClick={() => handleOption(sector, "indicar-actividad", "sector")}
                className={buttonClass}
              >
                {sector}
              </Button>
            ))}
            <Button
              onClick={() => showCustomTextInput("Escriba el sector donde se encuentra...")}
              className="w-full bg-[#34b7f1] hover:bg-[#2da5d9] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
            >
              ✏️ Escribir otro sector
            </Button>
            <Button onClick={() => setCurrentStep("confirmar-obra")} variant="outline" className={outlineButtonClass}>
              ↩️ Corregir obra en proceso
            </Button>
            <Button
              onClick={() => handleOption("Cancelar atendimiento", "finalizado")}
              variant="outline"
              className={outlineButtonClass}
            >
              ❌ Cancelar atendimiento
            </Button>
          </div>
        )

      case "indicar-actividad":
        return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-[#f0f0f0]">
            {["🔨 Contrapiso", "🧱 Mampostería", "⚡ Instalación eléctrica", "🎨 Pintura", "🚿 Plomería"].map(
              (actividad) => (
                <Button
                  key={actividad}
                  onClick={() => handleOption(actividad, "progreso-actividad", "actividad")}
                  className={buttonClass}
                >
                  {actividad}
                </Button>
              ),
            )}
            <Button
              onClick={() => showCustomTextInput("Escriba la actividad que está realizando...")}
              className="w-full bg-[#34b7f1] hover:bg-[#2da5d9] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
            >
              ✏️ Escribir otra actividad
            </Button>
            <Button onClick={() => setCurrentStep("confirmar-sector")} variant="outline" className={outlineButtonClass}>
              ↩️ Corregir sector de la obra
            </Button>
            <Button onClick={() => setCurrentStep("inicio")} variant="outline" className={outlineButtonClass}>
              🔄 Corregir opciones anteriores
            </Button>
            <Button
              onClick={() => handleOption("Cancelar atendimiento", "finalizado")}
              variant="outline"
              className={outlineButtonClass}
            >
              ❌ Cancelar atendimiento
            </Button>
          </div>
        )

      case "progreso-actividad":
        return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-[#f0f0f0]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["10%", "25%", "50%", "75%", "90%", "100%"].map((percentage) => (
                <Button
                  key={percentage}
                  onClick={() => handleTextInput(percentage, "registro-gastos", "progreso")}
                  className="bg-[#34b7f1] hover:bg-[#2da5d9] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
                >
                  {percentage}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => showCustomTextInput("Escriba el porcentaje de progreso (ej: 35%)...")}
              className="w-full bg-[#9333ea] hover:bg-[#7c3aed] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
            >
              ✏️ Escribir porcentaje personalizado
            </Button>
            <Button
              onClick={() => setCurrentStep("indicar-actividad")}
              variant="outline"
              className={outlineButtonClass}
            >
              ↩️ Corregir actividad en proceso
            </Button>
            <Button onClick={() => setCurrentStep("inicio")} variant="outline" className={outlineButtonClass}>
              🔄 Corregir opciones anteriores
            </Button>
            <Button
              onClick={() => handleOption("Cancelar atendimiento", "finalizado")}
              variant="outline"
              className={outlineButtonClass}
            >
              ❌ Cancelar atendimiento
            </Button>
          </div>
        )

      case "registro-gastos":
        return (
          <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-[#f0f0f0]">
            <Button
              onClick={() => handleTextInput("💰 Cemento $40.000, Cal $30.000, Arena $25.000", "finalizado", "gastos")}
              className={buttonClass}
            >
              💰 Cemento $40.000, Cal $30.000, Arena $25.000
            </Button>
            <Button
              onClick={() => handleTextInput("✅ No hubo gastos hoy", "finalizado", "gastos")}
              className={buttonClass}
            >
              ✅ No hubo gastos hoy
            </Button>
            <Button
              onClick={() =>
                showCustomTextInput("Escriba los gastos en materiales (ej: Ladrillos $50.000, Cemento $30.000)...")
              }
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
            >
              ✏️ Escribir gastos personalizados
            </Button>
            <Button
              onClick={() => setCurrentStep("progreso-actividad")}
              variant="outline"
              className={outlineButtonClass}
            >
              ↩️ Corregir progreso de la actividad
            </Button>
            <Button onClick={() => setCurrentStep("inicio")} variant="outline" className={outlineButtonClass}>
              🔄 Corregir opciones anteriores
            </Button>
            <Button
              onClick={() => handleOption("Cancelar atendimiento", "finalizado")}
              variant="outline"
              className={outlineButtonClass}
            >
              ❌ Cancelar atendimiento
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const renderTextInput = () => {
    if (!showTextInput) return null

    return (
      <div className="p-3 sm:p-4 bg-[#f0f0f0] border-t border-gray-200">
        <div className="flex items-center space-x-2 bg-white rounded-full px-3 sm:px-4 py-2 shadow-sm">
          <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" />
          <Input
            ref={textInputRef}
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={textInputPlaceholder}
            className="flex-1 border-none focus:ring-0 focus:outline-none bg-transparent text-sm"
          />
          <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" />
          <Button
            onClick={sendCustomText}
            disabled={!textInputValue.trim()}
            className="bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-full p-2 h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            onClick={() => {
              setShowTextInput(false)
              setShowOptions(true)
            }}
            variant="ghost"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancelar y volver a opciones
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#e5ddd5] flex flex-col w-full max-w-md mx-auto">
      {/* Header - Más auténtico de WhatsApp */}
      <div className="bg-[#075e54] text-white p-3 sm:p-4 flex items-center justify-between shadow-lg sticky top-0 z-10">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <Link href="/dashboard" className="p-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs sm:text-sm">SG</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-sm sm:text-lg truncate">SE.G.O.C Bot</h1>
            <p className="text-xs sm:text-sm opacity-90">en línea</p>
          </div>
        </div>
        <div className="flex space-x-3 sm:space-x-4 flex-shrink-0">
          <Phone className="h-4 w-4 sm:h-5 sm:w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
          <Video className="h-4 w-4 sm:h-5 sm:w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
          <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm ${
                message.type === "user"
                  ? "bg-[#dcf8c6] text-gray-800 rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md border"
              }`}
            >
              <p className="text-sm leading-relaxed break-words">{message.text}</p>
              <div
                className={`flex items-center justify-end mt-1 space-x-1 ${
                  message.type === "user" ? "text-gray-600" : "text-gray-500"
                }`}
              >
                <span className="text-xs">{message.time}</span>
                {message.type === "user" && renderMessageStatus(message.status)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && renderTypingIndicator()}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="bg-[#f0f0f0] border-t border-gray-200">
        {currentStep !== "finalizado" ? (
          <>
            {renderCurrentStep()}
            {renderTextInput()}
          </>
        ) : (
          <div className="p-3 sm:p-4">
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#25d366] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCheck className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-green-800 mb-2">¡Reporte Completado!</h3>
                <p className="text-green-700 text-sm">Toda la información ha sido registrada exitosamente</p>
              </div>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm bg-white/50 rounded-xl p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">👤 Operario:</span>
                    <span className="text-gray-800 text-right break-words">{chatData.nombre}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">📱 Teléfono:</span>
                    <span className="text-gray-800 text-right break-all">{chatData.telefono}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">🏗️ Obra:</span>
                    <span className="text-gray-800 text-right break-words">{chatData.obra}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">📍 Sector:</span>
                    <span className="text-gray-800 text-right break-words">{chatData.sector}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">🔨 Actividad:</span>
                    <span className="text-gray-800 text-right break-words">{chatData.actividad}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">📊 Progreso:</span>
                    <span className="text-gray-800 font-semibold text-right">{chatData.progreso}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">💰 Gastos:</span>
                    <span className="text-gray-800 text-right break-words">{chatData.gastos}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">⏰ Inicio:</span>
                    <span className="text-gray-800 text-right">{chatData.horaInicio}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 flex-shrink-0 mr-2">🏁 Fin:</span>
                    <span className="text-gray-800 text-right">{chatData.horaFin || "En proceso"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
                <Button
                  onClick={resetChat}
                  className="w-full bg-[#25d366] hover:bg-[#20bd5a] text-white active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium shadow-sm text-sm sm:text-base"
                >
                  🔄 Nueva Simulación
                </Button>
                <Link href="/dashboard" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 active:scale-95 transition-all duration-200 rounded-2xl py-2.5 sm:py-3 font-medium bg-white text-sm sm:text-base"
                  >
                    📊 Ver Dashboard
                  </Button>
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200 text-center">
                <p className="text-xs text-gray-500">
                  Demo desarrollada por <span className="font-semibold text-green-700">SykoTech LTDA</span>
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
