"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "../evem-projeto/components/Navbar"
import { Ticket, MapPin, Calendar, Heart } from "lucide-react"
import { mockEvents as staticEvents } from "../dashboard/data/mockData"
import { EventDate } from "../dashboard/types/event"

interface LocationData {
  city: string
  state: string
  address?: string
  zipCode?: string
}

interface EventData {
  id: number | string
  title: string
  description: string
  imageUrl?: string
  imageSrc?: string
  location: string | LocationData 
  dates?: EventDate[]
  date?: string
  attendeeLimit?: number
  ticketsSold?: number
  tickets?: number | string
}

export default function FavoritesPage() {
  const [favoriteEvents, setFavoriteEvents] = useState<EventData[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Função de formatação interna ou importada
  const formatEventDate = (dateObj: EventDate): string => {
    if (!dateObj.startDate) return "Data a definir"
    const start = new Date(`${dateObj.startDate}T00:00:00`)
    const diaSemanaRaw = start.toLocaleDateString("pt-BR", { weekday: "long" })
    const diaSemana =
      diaSemanaRaw.charAt(0).toUpperCase() + diaSemanaRaw.split("-")[0].slice(1)
    const diaMes = start.getDate()
    const mes = start
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "")

    const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1)
    return `${diaSemana}, ${diaMes} ${mesFormatado} às ${dateObj.startTime}`
  }

  useEffect(() => {
    // Evita o erro de "setState" síncrono e garante que o localStorage só seja lido no Cliente
    const loadFavorites = () => {
      try {
        const storedEvents = JSON.parse(
          localStorage.getItem("@evem:events") || "[]",
        )
        const allEvents = [...storedEvents, ...staticEvents]
        const storedFavIds = JSON.parse(
          localStorage.getItem("@evem:favorites") || "[]",
        )

        const filtered = allEvents.filter((event) =>
          storedFavIds.includes(event.id),
        )

        // Remove duplicatas de forma eficiente
        const uniqueFavorites = filtered.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id),
        )

        setFavoriteEvents(uniqueFavorites)
        setIsLoaded(true)
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      }
    }

    loadFavorites()
  }, [])

  const removeFavorite = (id: number | string) => {
    const updatedEvents = favoriteEvents.filter((event) => event.id !== id)
    setFavoriteEvents(updatedEvents)

    const storedFavIds = JSON.parse(
      localStorage.getItem("@evem:favorites") || "[]",
    )
    const newFavIds = storedFavIds.filter(
      (favId: string | number) => favId !== id,
    )
    localStorage.setItem("@evem:favorites", JSON.stringify(newFavIds))
  }

  if (!isLoaded)
    return (
      <div className="min-h-screen bg-[#dae4f8] flex items-center justify-center">
        Carregando...
      </div>
    )

  return (
    <div className="min-h-screen bg-[#dae4f8] pb-10 flex flex-col items-center">
      <Navbar />
      <main className="w-[95%] max-w-[1200px] mt-8 px-4 md:px-0 bg-white/50 backdrop-blur-sm border border-white/60 rounded-[30px] p-6 md:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 border-[3px] border-[#3B82F6] rounded-[30px] pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <Ticket className="text-[#D32F2F] w-8 h-8 -rotate-12 fill-[#FFCDD2]" />
          <h1 className="text-3xl font-bold text-black font-serif">
            Eventos Favoritos
          </h1>
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          {favoriteEvents.length > 0 ? (
            favoriteEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-[25px] p-5 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-full md:w-[220px] h-[140px] flex-shrink-0 rounded-2xl overflow-hidden relative">
                  <img
                    src={
                      event.imageUrl || event.imageSrc || "/img/placeholder.jpg"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow text-center md:text-left w-full">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="w-full md:w-[350px] flex-shrink-0 flex flex-col justify-between pl-0 md:pl-6 border-l-0 md:border-l border-gray-100 gap-3">
                  <div className="flex flex-col gap-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#7b2cbf]" />
                      <span>
                        {typeof event.location === "object"
                          ? event.location.city
                          : event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#7b2cbf]" />
                      <span>
                        {event.dates
                          ? formatEventDate(event.dates[0])
                          : event.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="bg-[#F3F0FA] px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#7b2cbf]" />
                      <div className="flex flex-col leading-none">
                        <strong className="text-gray-800 text-sm">
                          {event.attendeeLimit &&
                          event.ticketsSold !== undefined
                            ? (
                                event.attendeeLimit - event.ticketsSold
                              ).toLocaleString("pt-BR")
                            : event.tickets || 0}
                        </strong>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">
                          Restantes
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFavorite(event.id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-[#d62f98]/10 border-[#d62f98] text-[#d62f98] border shadow-sm hover:scale-110 active:scale-95"
                    >
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg mb-4">
                Você ainda não tem eventos favoritos.
              </p>
              <Link
                href="/events"
                className="text-[#0085D7] font-bold hover:underline"
              >
                Explorar eventos
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
