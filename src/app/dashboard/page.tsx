"use client"
import "./styles/globals.css"

import { v4 as uuidv4 } from "uuid"
import { useState, useEffect } from "react"
import {
  Plus,
  Calendar,
  LayoutGrid,
  List,
  LayoutDashboard,
  Users,
  Activity as ActivityIcon,
} from "lucide-react"
import {
  Event,
  EventFormData,
  Attendee,
  Activity,
  ActivityFormData,
} from "./types/event"
import { EventCard } from "./components/EventCard"
import { EventForm } from "./components/EventForm"
import { EventDetails } from "./components/EventDetails"
import { EventFiltersComponent, EventFilters } from "./components/EventFilters"
import { Dashboard } from "./components/Dashboard"
import { AttendeesView } from "./components/AttendeesView"
import { ActivitiesView } from "./components/ActivitiesView"
import { Button } from "./components/ui/button"
import { Badge } from "./components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Toaster, toast } from "sonner"
import {
  updateEventWithFormData,
  filterEvents,
  sortEvents,
  updateEventStatuses,
} from "./utils/eventUtils"
import { mockEvents, mockAttendees, mockActivities } from "./data/mockData"

export default function App() {
 const [events, setEvents] = useState<Event[]>(() => {
   if (typeof window !== "undefined") {
     const saved = localStorage.getItem("@evem:events")
     return saved ? JSON.parse(saved) : mockEvents
   }
   return mockEvents
 })
 const [attendees, setAttendees] = useState<Attendee[]>(() => {
   if (typeof window !== "undefined") {
     const saved = localStorage.getItem("@evem:attendees")
     return saved ? JSON.parse(saved) : mockAttendees
   }
   return mockAttendees
 })
 const [activities, setActivities] = useState<Activity[]>(() => {
   if (typeof window !== "undefined") {
     const saved = localStorage.getItem("@evem:activities")
     return saved ? JSON.parse(saved) : mockActivities
   }
   return mockActivities
 })
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [attendeesViewEvent, setAttendeesViewEvent] = useState<Event | null>(
    null,
  )
  const [sortBy, setSortBy] = useState<"date" | "title" | "created">("date")
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid")

  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    category: "all",
    status: "all",
    dateRange: "all",
  })

  // 1. Salvar sempre que houver mudanças nos dados
  useEffect(() => {
    localStorage.setItem("@evem:events", JSON.stringify(events))
    localStorage.setItem("@evem:attendees", JSON.stringify(attendees))
    localStorage.setItem("@evem:activities", JSON.stringify(activities))
  }, [events, attendees, activities])

  // 2. Atualização Automática de Status (Usa o updateEventStatuses importado)
  useEffect(() => {
    const checkStatuses = () => {
      setEvents((prevEvents) => {
        const updated = updateEventStatuses(prevEvents)
        // Só atualiza o estado se algo realmente mudou para evitar re-renders infinitos
        return JSON.stringify(updated) === JSON.stringify(prevEvents)
          ? prevEvents
          : updated
      })
    }

    checkStatuses()
    const intervalId = setInterval(checkStatuses, 60000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredAndSortedEvents = sortEvents(
    filterEvents(events, filters),
    sortBy,
  )

  const handleCreateEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      ...eventData, // Aqui já vem title, description, category, dates e o objeto location completo
      id: uuidv4(),

      // CAMPOS OBRIGATÓRIOS QUE NÃO ESTÃO NO FORM (Valores padrão)
      registeredAttendees: 0,
      status: "active",
      acceptingRegistrations: eventData.acceptingRegistrations ?? true,
      ticketsSold: 0,

      // METADADOS
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Atualiza o estado
    setEvents((prev) => [newEvent, ...prev])

    // Fecha o modal e limpa estados de edição
    setShowEventForm(false)
    setEditingEvent(null)

    toast.success("Evento criado com sucesso!")
  }

  const handleUpdateEvent = (eventData: EventFormData) => {
    if (!editingEvent) return

    const updatedEvent = updateEventWithFormData(editingEvent, eventData)
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    )
    setEditingEvent(null)
    setShowEventForm(false)
    toast.success("Evento atualizado com sucesso!")
  }

  const handleDeleteEvent = (eventId: string) => {
    // Deleta o evento
    setEvents((prev) => prev.filter((event) => event.id !== eventId))

    // Deleta os participantes relacionados ao evento.
    // Isso utiliza 'setAttendees'
    setAttendees((prev) =>
      prev.filter((attendee) => attendee.eventId !== eventId),
    )

    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null)
    }
    if (editingEvent?.id === eventId) {
      setEditingEvent(null)
      setShowEventForm(false)
    }
    if (attendeesViewEvent?.id === eventId) {
      setAttendeesViewEvent(null)
    }
    toast.success("Evento excluído com sucesso!")
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventForm(true)
    setSelectedEvent(null)
    setAttendeesViewEvent(null)
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      dateRange: "all",
    })
  }

  const handleViewAttendees = (event: Event) => {
    setAttendeesViewEvent(event)
    setActiveTab("attendees")
  }

  const handleExportAttendees = () => {
    toast.success("Exportação iniciada! O arquivo CSV será baixado em breve.")
  }

  // Activity handlers
  const handleCreateActivity = (activityData: ActivityFormData) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      ...activityData,
      registeredAttendees: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setActivities((prev) => [...prev, newActivity])
    toast.success("Atividade criada com sucesso!")
  }

  const handleUpdateActivity = (
    activityId: string,
    activityData: ActivityFormData,
  ) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              ...activityData,
              updatedAt: new Date().toISOString(),
            }
          : activity,
      ),
    )
    toast.success("Atividade atualizada com sucesso!")
  }

  const handleDeleteActivity = (activityId: string) => {
    setActivities((prev) =>
      prev.filter((activity) => activity.id !== activityId),
    )
    toast.success("Atividade excluída com sucesso!")
  }

  const getEventCounts = () => {
    const active = events.filter((e) => e.status === "active").length
    const inactive = events.filter((e) => e.status === "inactive").length
    return { active, inactive, total: events.length }
  }

  const eventCounts = getEventCounts()

  const eventAttendeesMap = attendeesViewEvent
    ? attendees.filter((a) => a.eventId === attendeesViewEvent.id)
    : []
  
  if (!isMounted) {
    return null // Ou um <div className="min-h-screen bg-background" /> para não ficar totalmente branco
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="mb-2">Gerenciamento de Eventos</h1>
            <p className="text-muted-foreground">
              Organize e gerencie seus eventos de forma eficiente
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {eventCounts.total} Total
              </Badge>
              <Badge className="bg-green-100 text-green-800 gap-1">
                {eventCounts.active} Ativos
              </Badge>
              {eventCounts.inactive > 0 && (
                <Badge className="bg-gray-100 text-gray-800 gap-1">
                  {eventCounts.inactive} Inativos
                </Badge>
              )}
            </div>

            <Button
              onClick={() => {
                setEditingEvent(null)
                setShowEventForm(true)
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        </div>

        {showEventForm ? (
          <EventForm
            event={editingEvent || undefined}
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={() => {
              setEditingEvent(null)
              setShowEventForm(false)
            }}
          />
        ) : attendeesViewEvent ? (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setAttendeesViewEvent(null)}
              className="mb-4"
            >
              ← Voltar
            </Button>
            <AttendeesView
              event={attendeesViewEvent}
              attendees={eventAttendeesMap}
            />
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="h-4 w-4" />
                Eventos
              </TabsTrigger>
              <TabsTrigger value="activities" className="gap-2">
                <ActivityIcon className="h-4 w-4" />
                Atividades
              </TabsTrigger>
              <TabsTrigger value="attendees" className="gap-2">
                <Users className="h-4 w-4" />
                Participantes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard
                events={events}
                onCreateEvent={() => {
                  setEditingEvent(null)
                  setShowEventForm(true)
                }}
                onEditEvent={handleEditEvent}
                onViewEvent={handleViewEvent}
                onViewAttendees={handleViewAttendees}
                onExportAttendees={handleExportAttendees}
              />
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              {/* Filtros e Controladores */}
              <div className="space-y-4">
                <EventFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={handleClearFilters}
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {filteredAndSortedEvents.length} evento
                      {filteredAndSortedEvents.length !== 1 ? "s" : ""}{" "}
                      encontrado
                      {filteredAndSortedEvents.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value: "date" | "title" | "created") =>
                        setSortBy(value)
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Ordenar por Data</SelectItem>
                        <SelectItem value="title">
                          Ordenar por Título
                        </SelectItem>
                        <SelectItem value="created">
                          Ordenar por Criação
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex border rounded-md">
                      <Button
                        variant={layoutMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLayoutMode("grid")}
                        className="rounded-r-none"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={layoutMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLayoutMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Events Display */}
              {filteredAndSortedEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">Nenhum evento encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.search ||
                    filters.category !== "all" ||
                    filters.status !== "all" ||
                    filters.dateRange !== "all"
                      ? "Tente ajustar seus filtros ou termos de busca."
                      : "Crie seu primeiro evento para começar."}
                  </p>
                  {filters.search ||
                  filters.category !== "all" ||
                  filters.status !== "all" ||
                  filters.dateRange !== "all" ? (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Limpar Filtros
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditingEvent(null)
                        setShowEventForm(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Evento
                    </Button>
                  )}
                </div>
              ) : (
                <div
                  className={
                    layoutMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAndSortedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                      onView={handleViewEvent}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <ActivitiesView
                events={events}
                activities={activities}
                onCreateActivity={handleCreateActivity}
                onUpdateActivity={handleUpdateActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            </TabsContent>

            <TabsContent value="attendees" className="space-y-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">Selecione um Evento</h3>
                <p className="text-muted-foreground mb-6">
                  Escolha um evento para visualizar seus participantes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {events.map((event) => (
                    <Button
                      key={event.id}
                      variant="outline"
                      onClick={() => handleViewAttendees(event)}
                      className="h-auto p-4 flex flex-col items-start gap-2"
                    >
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {attendees.filter((a) => a.eventId === event.id).length}{" "}
                        participantes
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  )
}
