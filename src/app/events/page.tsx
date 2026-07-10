"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  location: string | LocationData
  date?: string
  dates?: EventDate[]
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
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false) // Estado para controlar abertura do Dropdown customizado
  const carouselRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleFavorite = (id: number | string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    )
  }

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth > 768 ? 280 : 240
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

        const uniqueEvents = combined.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id),
        )

        setTimeout(() => {
          setAllEvents(uniqueEvents)
          const storedFavs = localStorage.getItem("@evem:favorites")
          if (storedFavs) {
            setFavorites(JSON.parse(storedFavs))
          }
        }, 0)
      } catch (error) {
        console.error("Erro ao carregar localStorage:", error)
        setAllEvents(staticEvents as EventData[])
      }
    }

    loadData()
  }, [])

  // Fechar o dropdown customizado se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (allEvents.length > 0 || favorites.length > 0) {
      localStorage.setItem("@evem:favorites", JSON.stringify(favorites))
    }
  }, [favorites, allEvents])

  const goToDetails = (id: number | string) => {
    router.push(`/events/${id}`)
  }

  const getEventCity = (event: EventData): string => {
    if (typeof event.location === "object" && event.location?.city) {
      return event.location.city
    }
    if (typeof event.location === "string") {
      return event.location.split("-")[0].trim()
    }
    return "Local a definir"
  }

  const availableCities = Array.from(
    new Set(
      allEvents
        .map((event) => getEventCity(event))
        .filter((city) => city && city !== "Local a definir"),
    ),
  )

  const filteredEvents = allEvents.filter((event) => {
    if (selectedCity === "all") return true
    return getEventCity(event).toLowerCase() === selectedCity.toLowerCase()
  })

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

      {/* --- SEÇÃO CARROSSEL DESTAQUES --- */}
      <section className="py-12 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-[#E2DDF8] to-white/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="text-[#d62f98] w-6 h-6" />
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#4B0082]">
                Destaques da{" "}
                <span className="text-[#eebb58] underline decoration-[#eebb58]">
                  Semana
                </span>
              </h2>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#4B0082] bg-white/90 px-5 py-2 text-sm font-semibold text-[#4B0082] shadow-sm transition hover:bg-[#4B0082] hover:text-white"
            >
              Voltar para a página principal
            </Link>
          </div>

          <div className="relative group px-1">
            <div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide py-3 px-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredEvents.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  onClick={() => goToDetails(event.id)}
                  className="min-w-[230px] sm:min-w-[250px] md:min-w-[260px] h-[340px] md:h-[360px] relative rounded-2xl overflow-hidden flex-shrink-0 shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="bg-white/90 text-black text-[10px] font-bold px-2.5 py-1 rounded-full w-fit mb-2 flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-[#d62f98]" />
                      {event.attendeeLimit && event.ticketsSold !== undefined
                        ? event.attendeeLimit - event.ticketsSold <= 0
                          ? "Esgotado"
                          : `${(event.attendeeLimit - event.ticketsSold).toLocaleString("pt-BR")} rest.`
                        : event.tickets === "Esgotado"
                          ? "Esgotado"
                          : `${(Number(event.tickets) || 0).toLocaleString("pt-BR")} rest.`}
                    </div>
                    <h3 className="text-base font-bold mb-1 leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-300 text-[11px]">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="truncate">
                        {typeof event.location === "object"
                          ? event.location.city
                          : event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="w-full text-center py-12 text-gray-500 text-sm font-medium">
                  Nenhum evento em destaque encontrado para esta região.
                </div>
              )}
            </div>

            {filteredEvents.length > 0 && (
              <>
                <button
                  onClick={() => scrollCarousel("left")}
                  className="absolute left-[-15px] top-1/2 -translate-y-1/2 bg-white border border-gray-100 p-2 rounded-full text-[#4B0082] shadow-md hover:bg-[#d62f98] hover:text-white transition opacity-0 group-hover:opacity-100 hidden md:block z-10"
                  aria-label="Voltar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="absolute right-[-15px] top-1/2 -translate-y-1/2 bg-white border border-gray-100 p-2 rounded-full text-[#4B0082] shadow-md hover:bg-[#d62f98] hover:text-white transition opacity-0 group-hover:opacity-100 hidden md:block z-10"
                  aria-label="Avançar"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DO FILTRO --- */}
      <header className="px-6 py-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 w-full md:w-auto items-center">
            <button className="bg-[#0085D7] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-[#006bb3] text-sm flex-shrink-0">
              Ativo
            </button>

            {/* DROPDOWN CUSTOMIZADO COM ACABAMENTO UI/UX MODERNIZADO */}
            <div ref={dropdownRef} className="relative z-30">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white rounded-full shadow-sm border border-gray-100 px-5 py-2.5 flex items-center gap-2.5 hover:border-[#d62f98] focus:border-[#d62f98] transition-all min-w-[180px] justify-between text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span className="font-bold text-gray-700 text-sm">
                    {selectedCity === "all" ? "Todos os locais" : selectedCity}
                  </span>
                </div>
                <span
                  className={`text-[10px] text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#d62f98]" : ""}`}
                >
                  ▼
                </span>
              </button>

              {/* LISTA DO DROPDOWN (MODAL DE SELEÇÃO ESTILIZADO) */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full min-w-[220px] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_25px_rgba(75,0,130,0.15)] border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setSelectedCity("all")
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                      selectedCity === "all"
                        ? "bg-[#4B0082]/10 text-[#4B0082]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                    }`}
                  >
                    <span>Todos os locais</span>
                    {selectedCity === "all" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4B0082]"></span>
                    )}
                  </button>

                  {availableCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city)
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                        selectedCity.toLowerCase() === city.toLowerCase()
                          ? "bg-[#4B0082]/10 text-[#4B0082]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity.toLowerCase() === city.toLowerCase() && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4B0082]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Busque evento, local, etc"
              className="w-full py-2.5 px-5 pr-12 rounded-full border border-[#d62f98] focus:ring-2 focus:ring-[#d62f98] text-sm shadow-sm text-gray-800"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
              🔍
            </span>
          </div>
        </div>
      </header>

      {/* --- LISTAGEM PRINCIPAL --- */}
      <main className="px-6 md:px-16 lg:px-24 flex flex-col gap-5 max-w-7xl mx-auto">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => goToDetails(event.id)}
            className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-center shadow-sm border border-gray-100 hover:border-[#0085D7] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-full md:w-[180px] lg:w-[220px] h-[130px] md:h-[140px] flex-shrink-0 rounded-xl overflow-hidden relative shadow-inner">
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
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-2 ${categoryColors[event.category as CategoryKeys] || defaultColor}`}
              >
                {event.categoryLabel || event.category}
              </span>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1.5 leading-tight">
                {event.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {event.description}
              </p>
            </div>

            <div className="w-full md:w-[230px] lg:w-[260px] flex-shrink-0 flex flex-col gap-2.5 pl-0 md:pl-5 border-l-0 md:border-l border-gray-100">
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <span className="text-purple-600 text-sm">📍</span>
                <span className="truncate">
                  {typeof event.location === "object"
                    ? `${event.location.city}, ${event.location.state}`
                    : event.location}
                </span>
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <span className="text-purple-600 text-sm">📅</span>
                <span>
                  {event.dates && event.dates.length > 0
                    ? formatEventDate(event.dates[0])
                    : event.date || "Data a definir"}
                </span>
              </div>

              <div className="flex justify-between items-center mt-1 bg-[#F3F0FA] p-2.5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-base">🎟️</span>
                  <div className="flex flex-col">
                    <strong className="text-gray-800 text-base leading-tight">
                      {event.attendeeLimit && event.ticketsSold !== undefined
                        ? (
                            event.attendeeLimit - event.ticketsSold
                          ).toLocaleString("pt-BR")
                        : (Number(event.tickets) || 0).toLocaleString("pt-BR")}
                    </strong>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                      Restantes
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(event.id)
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    favorites.includes(event.id)
                      ? "bg-[#d62f98]/10 border-[#d62f98] text-[#d62f98]"
                      : "bg-white border-gray-200 text-gray-400"
                  } border shadow-sm`}
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.includes(event.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
            Nenhum evento encontrado para a cidade selecionada.
          </div>
        )}
      </main>

      <footer className="mt-16 text-center border-t border-gray-300 pt-8 mx-6 md:mx-16 lg:mx-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-xs">
            © 2025 EVEM – Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
