"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "../../evem-projeto/components/Navbar"
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  Heart,
  Info,
  CheckCircle,
  Ticket,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react"
import { mockEvents as staticEvents } from "../../dashboard/data/mockData"

interface LocationData {
  name?: string
  city: string
  state: string
  street?: string
  neighborhood?: string
  zipCode?: string
}

interface EventScheduleItem {
  day: string
  month: string
  title: string
  time: string
}

interface EventDateItem {
  id?: string | number
  date: string
  startDate?: string
  startTime: string
  endTime: string
}

interface EventData {
  id: number | string
  title: string
  category: string
  categoryLabel?: string
  description: string | string[]
  location: string | LocationData
  date?: string
  dates?: EventDateItem[]
  time?: string
  price?: string | number
  ticketPrice?: number
  image?: string
  imageSrc?: string
  imageUrl?: string
  imageHero?: string
  organizer?: string
  schedule?: EventScheduleItem[]
}

export default function EventDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    const loadEvent = () => {
      try {
        const stored = localStorage.getItem("@evem:events")
        const dashboardEvents: EventData[] = stored ? JSON.parse(stored) : []
        const allEvents = [
          ...dashboardEvents,
          ...(staticEvents as unknown as EventData[]),
        ]

        const found = allEvents.find((e) => String(e.id) === id)
        setEvent(found || null)

        // Verifica se este evento já está nos favoritos
        if (found) {
          const storedFavIds: (string | number)[] = JSON.parse(
            localStorage.getItem("@evem:favorites") || "[]",
          )
          setIsFavorite(storedFavIds.includes(found.id))
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  // Função para adicionar/remover dos favoritos
  const toggleFavorite = () => {
    if (!event) return

    try {
      const storedFavIds: (string | number)[] = JSON.parse(
        localStorage.getItem("@evem:favorites") || "[]",
      )

      let updatedFavIds: (string | number)[]

      if (storedFavIds.includes(event.id)) {
        // Se já for favorito, remove
        updatedFavIds = storedFavIds.filter((favId) => favId !== event.id)
        setIsFavorite(false)
      } else {
        // Se não for, adiciona
        updatedFavIds = [...storedFavIds, event.id]
        setIsFavorite(true)
      }

      localStorage.setItem("@evem:favorites", JSON.stringify(updatedFavIds))
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#f4f4f8] flex items-center justify-center font-bold">
        Carregando...
      </div>
    )

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f4f4f8] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Evento não encontrado</h1>
        <Link href="/events" className="text-blue-600 underline">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  // --- TRATAMENTO DE DADOS ---
  const displayImage =
    event.imageHero ||
    event.imageUrl ||
    event.imageSrc ||
    event.image ||
    "/img/placeholder.jpg"

  const displayLocation =
    typeof event.location === "object"
      ? `${event.location.name ? event.location.name + " - " : ""}${event.location.street ? event.location.street + ", " : ""}${event.location.city} / ${event.location.state}`
      : event.location

  const displayPrice =
    event.ticketPrice !== undefined
      ? event.ticketPrice === 0
        ? "Gratuito"
        : event.ticketPrice.toFixed(2)
      : event.price || "A combinar"

  let displayDate = event.date || "Data a definir"
  let displayTime = event.time || "Horário a definir"

  if (event.dates && event.dates.length > 0) {
    const firstDateObj = event.dates[0]
    const rawDate = firstDateObj.date || firstDateObj.startDate
    if (rawDate) {
      displayDate = new Date(`${rawDate}T00:00:00`).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      )
    }
    if (firstDateObj.startTime) {
      displayTime = `${firstDateObj.startTime} às ${firstDateObj.endTime || ""}`
    }
  }

  const displayDescription = Array.isArray(event.description)
    ? event.description
    : [event.description]

  return (
    <div className="min-h-screen bg-[#f4f4f8] text-[#333]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="bg-[#0d001a] text-white py-12 px-6 md:px-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto mb-6 relative z-20">
          <Link
            href="/events"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit"
          >
            <ChevronLeft className="w-5 h-5" /> Voltar para eventos
          </Link>
        </div>

        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] rounded-full bg-[#7b2cbf] opacity-20 blur-[50px]"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-[#d62f98] opacity-20 blur-[40px]"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="w-full md:w-[400px] h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0 group">
            <img
              src={displayImage}
              alt={event.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#eebb58] text-[#eebb58] text-sm font-bold mb-4 capitalize">
              {event.categoryLabel || event.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-col gap-3 text-gray-300">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Calendar className="text-[#d62f98] w-5 h-5 flex-shrink-0" />
                <span className="text-lg">{displayDate}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="text-[#d62f98] w-5 h-5 flex-shrink-0" />
                <span className="text-lg">{displayTime}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <MapPin className="text-[#d62f98] w-5 h-5 flex-shrink-0" />
                <span className="text-lg">{displayLocation}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center md:justify-start">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white text-sm font-semibold border border-white/10">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>

              {/* Botão Salvar Favorito Atualizado Dinamicamente */}
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition text-sm font-semibold border ${
                  isFavorite
                    ? "bg-[#d62f98] border-[#d62f98] text-white hover:bg-[#b5227f]"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/10"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "Salvo" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 border-b-4 border-[#d62f98] inline-block pb-1">
              Sobre este evento
            </h2>
            <div className="text-gray-600 leading-relaxed text-base space-y-4">
              {displayDescription.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 bg-[#fff4e5] border-l-4 border-orange-400 p-4 rounded-r-lg">
              <p className="text-orange-800 text-sm font-medium flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>
                  <strong>Classificação Indicativa:</strong> Verifique as
                  especificidades de cada lote de ingressos ou cronograma local.
                  Menores apenas acompanhados dos pais.
                </span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-6 border-b-4 border-[#d62f98] inline-block pb-1">
              Programação das Datas
            </h2>

            {event.dates && event.dates.length > 0 ? (
              <ul className="space-y-4">
                {event.dates.map((item, idx) => {
                  const itemDate = new Date(
                    `${item.date || item.startDate}T00:00:00`,
                  )
                  const day = itemDate.getDate().toString().padStart(2, "0")
                  const month = itemDate
                    .toLocaleDateString("pt-BR", { month: "short" })
                    .replace(".", "")

                  return (
                    <li
                      key={item.id || idx}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="bg-[#f3e5f5] text-[#7b1fa2] p-3 rounded-lg text-center min-w-[70px] uppercase">
                        <span className="block text-2xl font-bold leading-none">
                          {day}
                        </span>
                        <span className="text-xs font-bold">{month}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">
                          Sessão {idx + 1}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {item.startTime} -{" "}
                          {item.endTime}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : event.schedule && event.schedule.length > 0 ? (
              <ul className="space-y-4">
                {event.schedule.map((item: EventScheduleItem, idx: number) => (
                  <li
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="bg-[#f3e5f5] text-[#7b1fa2] p-3 rounded-lg text-center min-w-[70px] uppercase">
                      <span className="block text-2xl font-bold leading-none">
                        {item.day}
                      </span>
                      <span className="text-xs font-bold">{item.month}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic bg-white p-4 rounded-lg border border-gray-100">
                Cronograma detalhado não disponível no momento.
              </p>
            )}
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Organizado por</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl uppercase">
                {(event.organizer || "E").charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {event.organizer || "Produtor Independente"}
                </p>
                <button className="text-[#0085D7] text-sm font-medium hover:underline">
                  Entre em contato
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* --- STICKY CARD LATERAL --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-6">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">A partir de</p>
                <h3 className="text-3xl font-bold text-[#d62f98]">
                  {typeof displayPrice === "number"
                    ? `R$ ${displayPrice}`
                    : displayPrice}
                </h3>
              </div>
              <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                <Ticket className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Ingresso digital instantâneo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancelamento descomplicado</span>
              </div>
            </div>

            <Link
              href={`/payment?id=${event.id}`}
              className="block w-full bg-[#0085D7] hover:bg-[#006bb3] text-white text-center font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Comprar Ingresso
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Pagamento 100% seguro</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#e6e6e6] text-center py-8 mt-10 border-t border-gray-300">
        <p className="text-gray-500 text-sm">
          © 2026 EVEM – Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
