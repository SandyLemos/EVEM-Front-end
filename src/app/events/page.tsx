"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "../evem-projeto/components/Navbar"
import { mockEvents as staticEvents } from "../dashboard/data/mockData"
import { formatEventDate } from "../dashboard/utils/eventUtils"
import { EventDate } from "../dashboard/types/event"

import {
  Calendar,
  MapPin,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react"

const categoryColors = {
  business: "bg-blue-100 text-blue-800",
  social: "bg-yellow-100 text-yellow-800",
  sports: "bg-orange-100 text-orange-800",
  education: "bg-purple-100 text-purple-800",
  entertainment: "bg-pink-100 text-pink-800",
  musicalShows: "bg-purple-900/10 text-purple-900",
  courses: "bg-orange-100 text-orange-800",
  teather: "bg-rose-100 text-pink-400",
  technology: "bg-blue-900/10 text-blue-600",
  gastronomy: "bg-lime-100 text-lime-800",
  religious: "bg-amber-100 text-amber-800",
  kidsAndFamily: "bg-fuchsia-800/10 text-fuchsia-800",
  other: "bg-cyan-100 text-cyan-800",
}

type CategoryKeys = keyof typeof categoryColors

// Tipagem para garantir consistência
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
  category: CategoryKeys
  categoryLabel?: string
  location: string | LocationData // Tipagem rigorosa: string ou objeto específico
  date?: string
  dates?: EventDate[] // Ajustado para refletir o objeto real
  tickets?: number | string
  ticketsSold?: number
  attendeeLimit?: number 
  image?: string
  imageUrl?: string
  imageSrc?: string
}

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<EventData[]>([])
  const [favorites, setFavorites] = useState<(number | string)[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleFavorite = (id: number | string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    )
  }

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320
      const newScrollPosition =
        direction === "left"
          ? carouselRef.current.scrollLeft - scrollAmount
          : carouselRef.current.scrollLeft + scrollAmount
      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem("@evem:events")
        const dashboardEvents = stored ? JSON.parse(stored) : []

        const combined = [...dashboardEvents, ...staticEvents]

        // Filtramos duplicatas
        const uniqueEvents = combined.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id),
        )

        // IMPORTANTE: Envolvemos em um timeout de 0ms ou verificamos se os dados mudaram
        // Isso joga a execução para o final da fila de tarefas, evitando o erro de sincronia
        setTimeout(() => {
          setAllEvents(uniqueEvents)

          const storedFavs = localStorage.getItem("@evem:favorites")
          if (storedFavs) {
            setFavorites(JSON.parse(storedFavs))
          }
        }, 0)
      } catch (error) {
        console.error("Erro ao carregar localStorage:", error)
        // Fallback para os estáticos em caso de erro
        setAllEvents(staticEvents as EventData[])
      }
    }

    loadData()
  }, []) // Array de dependências vazio para rodar apenas uma vez
  // 2. Persistência de favoritos (sempre que mudar)
  useEffect(() => {
    // Só salva se houver algo carregado para não sobrescrever o storage com vazio no init
    if (allEvents.length > 0 || favorites.length > 0) {
      localStorage.setItem("@evem:favorites", JSON.stringify(favorites))
    }
  }, [favorites, allEvents])

  const goToDetails = (id: number | string) => {
    router.push(`/events/${id}`)
  }

  const defaultColor = "bg-gray-200 text-gray-700"

  if (allEvents.length === 0 && staticEvents.length === 0) {
    return (
      <div className="min-h-screen bg-[#E2DDF8] flex items-center justify-center">
        Carregando eventos...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E2DDF8] pb-10">
      <Navbar />

      <section className="py-10 px-6 md:px-16 bg-gradient-to-b from-[#E2DDF8] to-white/50">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-[#d62f98] w-6 h-6" />
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#4B0082]">
            Destaques da{" "}
            <span className="text-[#eebb58] underline decoration-[#eebb58]">
              Semana
            </span>
          </h2>
        </div>

        <div className="relative group">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                onClick={() => goToDetails(event.id)}
                className="min-w-[280px] h-[400px] relative rounded-3xl overflow-hidden flex-shrink-0 shadow-xl transition-transform hover:scale-105 cursor-pointer"
              >
                <img
                  src={
                    event.imageUrl ||
                    event.image ||
                    event.imageSrc ||
                    "/img/placeholder.jpg"
                  }
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 flex items-center gap-1">
                    <Ticket className="w-3 h-3 text-[#d62f98]" />
                    {event.tickets === "Esgotado"
                      ? "Esgotado"
                      : `${event.tickets || 0} rest.`}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-300 text-xs">
                    <MapPin className="w-3 h-3" />
                    {typeof event.location === "object"
                      ? event.location.city
                      : event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-[#4B0082] shadow-lg hover:bg-[#d62f98] hover:text-white transition hidden md:block z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-[#4B0082] shadow-lg hover:bg-[#d62f98] hover:text-white transition hidden md:block z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      <header className="px-6 py-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <button className="bg-[#0085D7] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-[#006bb3]">
              Ativo
            </button>
            <div className="bg-white px-5 py-2.5 rounded-full font-bold text-gray-700 shadow-sm flex items-center gap-2">
              📍 Local ▼
            </div>
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Busque evento, local, etc"
              className="w-full py-3 px-5 pr-12 rounded-full border border-[#d62f98] focus:ring-2 focus:ring-[#d62f98] text-sm shadow-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              🔍
            </span>
          </div>
        </div>
      </header>

      <main className="px-6 md:px-16 flex flex-col gap-6">
        {allEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => goToDetails(event.id)}
            className="bg-white rounded-3xl p-4 flex flex-col md:flex-row gap-6 items-center shadow-sm border-2 border-transparent hover:border-[#0085D7] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-full md:w-[240px] h-[160px] flex-shrink-0 rounded-2xl overflow-hidden relative shadow-inner">
              <img
                src={
                  event.imageUrl ||
                  event.imageSrc ||
                  event.image ||
                  "/img/placeholder.jpg"
                }
                alt={event.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="flex-grow text-center md:text-left w-full">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3 ${categoryColors[event.category as CategoryKeys] || defaultColor}`}
              >
                {event.categoryLabel || event.category}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {event.description}
              </p>
            </div>

            <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-3 pl-0 md:pl-6 border-l-0 md:border-l border-gray-100">
              <div className="text-sm text-gray-600 flex items-center gap-3">
                <span className="text-purple-600 w-5">📍</span>
                {typeof event.location === "object"
                  ? `${event.location.city}, ${event.location.state}`
                  : event.location}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-3">
                <span className="text-purple-600 w-5">📅</span>
                {event.dates && event.dates.length > 0
                  ? formatEventDate(event.dates[0])
                  : event.date || "Data a definir"}
              </div>

              <div className="flex justify-between items-center mt-2 bg-[#F3F0FA] p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-lg">🎟️</span>
                  <div className="flex flex-col">
                    <strong className="text-gray-800 text-lg">
                      {/* Lógica: Limite total - Ingressos vendidos */}
                      {event.attendeeLimit && event.ticketsSold !== undefined
                        ? (
                            event.attendeeLimit - event.ticketsSold
                          ).toLocaleString("pt-BR")
                        : (Number(event.tickets) || 0).toLocaleString("pt-BR")}
                    </strong>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                      Restantes
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(event.id)
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    favorites.includes(event.id)
                      ? "bg-[#d62f98]/10 border-[#d62f98] text-[#d62f98]"
                      : "bg-white border-gray-200 text-gray-400"
                  } border shadow-sm`}
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.includes(event.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-16 text-center border-t border-gray-300 pt-8 mx-16">
        <p className="text-gray-500 text-sm">
          © 2025 EVEM – Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
