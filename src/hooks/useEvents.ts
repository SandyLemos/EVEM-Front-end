import { useState, useEffect } from "react"
import { Event } from "../app/dashboard/types/event"
import { mockEvents } from "../app/dashboard/data/mockData"

export interface EventContextData {
  events: Event[]
  selectedEvent: Event | null // Adicione esta linha
  setEvents: (newEvents: Event[]) => void
  setSelectedEvent: (event: Event | null) => void // Adicione esta linha se necessário
}


export function useEvents() {
  // 1. Inicializamos o estado com uma função (Lazy Initializer)
  // Isso roda apenas UMA vez na criação do componente.
  const [events, setEvents] = useState<Event[]>(() => {
    // Como o localStorage não existe no servidor (SSR), verificamos se estamos no browser
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("evem_events")
      if (saved) return JSON.parse(saved)

      // Se não houver nada, inicializa com o mock
      localStorage.setItem("evem_events", JSON.stringify(mockEvents))
    }
    return mockEvents
  })

  // 2. Opcional: Sincronizar abas (se você abrir o Dashboard e a página Events em abas diferentes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "evem_events" && e.newValue) {
        setEvents(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents)
    localStorage.setItem("evem_events", JSON.stringify(newEvents))
  }

  return { events, setEvents: saveEvents }
}
