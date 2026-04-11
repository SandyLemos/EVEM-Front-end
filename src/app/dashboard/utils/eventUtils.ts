import { Event, EventDate, EventFormData } from "../types/event"
import { v4 as uuidv4 } from 'uuid';
import { EventFilters } from "../components/EventFilters"

// Generate unique ID
// Create event from form data
export const createEventFromFormData = (formData: EventFormData): Event => {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    title: formData.title,
    description: formData.description,
    dates: formData.dates,
    location: formData.location,
    category: formData.category,
    attendeeLimit: formData.attendeeLimit,
    registeredAttendees: 0,
    status: "active",
    acceptingRegistrations: formData.acceptingRegistrations ?? true,
    createdAt: now,
    updatedAt: now,
    ticketPrice: formData.ticketPrice,
    ticketsSold: 0,
  }
}

// Update event with form data
export const updateEventWithFormData = (
  event: Event,
  formData: EventFormData
): Event => {
  return {
    ...event,
    title: formData.title,
    description: formData.description,
    dates: formData.dates,
    location: formData.location,
    category: formData.category,
    attendeeLimit: formData.attendeeLimit,
    ticketPrice: formData.ticketPrice,
    acceptingRegistrations:
      formData.acceptingRegistrations ?? event.acceptingRegistrations,
    updatedAt: new Date().toISOString(),
  }
}

// Get next date from event dates array
export const getNextEventDate = (
  event: Event
): EventDate | null => {
  const now = new Date()
  const sortedDates = [...event.dates].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  for (const eventDate of sortedDates) {
    const eventStart = new Date(`${eventDate.startDate}T${eventDate.startTime}`)
    if (eventStart >= now) {
      return eventDate
    }
  }

  // If no future dates, return the last date
  return sortedDates[sortedDates.length - 1] || null
}

// Filter events based on filters
export const filterEvents = (
  events: Event[],
  filters: EventFilters
): Event[] => {
  return events.filter((event) => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const title = (event.title || "").toLowerCase()
      const description = (event.description || "").toLowerCase()
      const locationStr = String(event.location || "").toLowerCase()

      const matchesSearch =
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        locationStr.includes(searchTerm)

      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.category !== "all" && event.category !== filters.category) {
      return false
    }

    // Status filter
    if (filters.status !== "all" && event.status !== filters.status) {
      return false
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const nextDate = getNextEventDate(event)
      if (!nextDate) return false

      const eventDate = new Date(nextDate.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      switch (filters.dateRange) {
        // Adicionadas chaves { } nos cases que declaram constantes
        case "today": {
          const todayEnd = new Date(today)
          todayEnd.setDate(today.getDate() + 1)
          if (eventDate < today || eventDate >= todayEnd) return false
          break
        }

        case "this-week": {
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 7)
          if (eventDate < weekStart || eventDate >= weekEnd) return false
          break
        }

        case "this-month": {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)
          if (eventDate < monthStart || eventDate >= monthEnd) return false
          break
        }

        case "next-month": {
          const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
          const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 1)
          if (eventDate < nextMonthStart || eventDate >= nextMonthEnd) return false
          break
        }
      }
    }

    return true
  })
}

// Sort events by date and time
export const sortEvents = (
  events: Event[],
  sortBy: "date" | "title" | "created" = "date"
): Event[] => {
  return [...events].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "date":
      default: {
        // Adicionadas chaves aqui também
        const nextDateA = getNextEventDate(a)
        const nextDateB = getNextEventDate(b)

        if (!nextDateA && !nextDateB) return 0
        if (!nextDateA) return 1
        if (!nextDateB) return -1

        const dateA = new Date(`${nextDateA.startDate}T${nextDateA.startTime}`)
        const dateB = new Date(`${nextDateB.startDate}T${nextDateB.startTime}`)
        return dateA.getTime() - dateB.getTime()
      }
    }
  })
}

// Backward compatibility - keep this for existing code
export const updateEventStatuses = (events: Event[]): Event[] => {
  // Since status is now manual (active/inactive), we don't auto-update it
  return events
}

export const formatEventDate = (dateObj: EventDate | undefined ) : string => {
  if (!dateObj || !dateObj.startDate) return "Data a definir"

  // Criamos objetos Date (ajustando o fuso horário para evitar que a data mude)
  const start = new Date(dateObj.startDate + "T00:00:00")
  const end = dateObj.endDate ? new Date(dateObj.endDate + "T00:00:00") : null

  const diaSemana = start.toLocaleDateString("pt-BR", { weekday: "long" })
  const diaMes = start.getDate()
  const mes = start.toLocaleDateString("pt-BR", { month: "short" })

  // Capitaliza a primeira letra (quarta -> Quarta)
  const diaSemanaFormatado =
    diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1).split("-")[0]

  // Caso 1: Evento de vários dias (Ex: 15 a 23 Out)
  if (end && dateObj.startDate !== dateObj.endDate) {
    const diaFim = end.getDate()
    return `${diaSemanaFormatado}, ${diaMes} a ${diaFim} ${mes.replace(".", "")} - ${dateObj.startTime}`
  }

  // Caso 2: Evento de um dia só (Ex: Sexta às 22:00)
  return `${diaSemanaFormatado} às ${dateObj.startTime}`
}