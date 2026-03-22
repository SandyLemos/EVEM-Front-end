"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "../evem-projeto/components/Navbar"

import {
  Calendar,
  MapPin,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react"

// 1. Definição do Mapa de Cores
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

type ListEvent = {
  id: number
  title: string
  description: string
  category: CategoryKeys
  categoryLabel: string
  location: string
  date: string
  tickets: number | string // Permitir "Esgotado"
  imageSrc: string
}

// --- DADOS ---
const featuredEvents = [
  {
    id: 1,
    title: "Raphael Ghanem",
    location: "Salvador - BA",
    image: "/img/poster-raphael.jpg",
    date: "15 a 23 Out",
    tickets: 15,
  },
  {
    id: 2,
    title: "Show Extra",
    location: "São Paulo - SP",
    image: "/img/poster-raphael.jpg",
    date: "25 Out",
    tickets: 40,
  },
  {
    id: 3,
    title: "Final Tour",
    location: "Rio de Janeiro",
    image: "/img/poster-raphael.jpg",
    date: "30 Out",
    tickets: "Esgotado",
  },
  {
    id: 4,
    title: "Encerramento",
    location: "Belo Horizonte",
    image: "/img/poster-raphael.jpg",
    date: "05 Nov",
    tickets: 100,
  },
  {
    id: 5,
    title: "Especial de Natal",
    location: "Curitiba - PR",
    image: "/img/poster-raphael.jpg",
    date: "20 Dez",
    tickets: 50,
  },
]

const listEvents: ListEvent[] = [
  {
    id: 101,
    title: "Festival de delícias culinárias",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
    category: "gastronomy",
    categoryLabel: "Gastronomia e bebidas",
    location: "The Plaza, San Francisco, CA",
    date: "Quarta, 15 a 23 de Out - 13:00",
    tickets: 115,
    imageSrc: "/img/breakfast.jpg",
  },
  {
    id: 103,
    title: "Raphael Ghanem - Se é que você me entende!",
    description:
      "Espetáculo de Stand up Comedy imperdível repleto de interações.",
    category: "entertainment",
    categoryLabel: "Stand up comedy",
    location: "BeFly Minascentro",
    date: "Sexta às 22h00",
    tickets: 15,
    imageSrc: "/img/poster-raphael.jpg",
  },
]

export default function EventsPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
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

  // Função para navegar para detalhes
  const goToDetails = (id: number) => {
    router.push(`/events/${id}`)
  }

  const defaultColor = "bg-gray-200 text-gray-700"

  return (
    <div className="min-h-screen bg-[#E2DDF8] pb-10">
      <Navbar />

      {/* --- CARROSSEL --- */}
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
            {featuredEvents.map((event) => (
              // Card do Carrossel clicável
              <div
                key={event.id}
                onClick={() => goToDetails(event.id)}
                className="min-w-[280px] h-[400px] relative rounded-3xl overflow-hidden flex-shrink-0 shadow-xl transition-transform hover:scale-105 cursor-pointer"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 flex items-center gap-1">
                    <Ticket className="w-3 h-3 text-[#d62f98]" />
                    {event.tickets === "Esgotado"
                      ? "Esgotado"
                      : `${event.tickets} rest.`}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-300 text-xs">
                    <MapPin className="w-3 h-3" /> {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botões do Carrossel */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-[#4B0082] shadow-lg hover:bg-[#d62f98] hover:text-white transition hidden md:block cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-[#4B0082] shadow-lg hover:bg-[#d62f98] hover:text-white transition hidden md:block cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* --- FILTROS --- */}
      <header className="px-6 py-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <button className="bg-[#0085D7] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-[#006bb3] transition cursor-pointer">
              Ativo
            </button>
            <div className="bg-white px-5 py-2.5 rounded-full font-bold text-gray-700 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50">
              📍 Catu ▼
            </div>
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Busque evento, local, etc"
              className="w-full py-3 px-5 pr-12 rounded-full border border-[#d62f98] focus:outline-none focus:ring-2 focus:ring-[#d62f98] text-sm shadow-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d62f98]">
              🔍
            </span>
          </div>
          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button className="bg-white text-gray-700 px-5 py-2.5 rounded-full font-semibold hover:bg-white transition cursor-pointer">
              Filtros ▼
            </button>
          </div>
        </div>
        <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {["Negócios", "Entretenimento", "Shows e Festas"].map((tag) => (
            <button
              key={tag}
              className="bg-white whitespace-nowrap px-6 py-2 rounded-full font-bold text-sm text-gray-700 shadow-sm hover:-translate-y-0.5 transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      {/* --- LISTA DE EVENTOS --- */}
      <main className="px-6 md:px-16 flex flex-col gap-6">
        {listEvents.map((event) => (
          // CARD INTEIRO CLICÁVEL AQUI
          <div
            key={event.id}
            onClick={() => goToDetails(event.id)} // Navegação no clique do card
            className="bg-white rounded-3xl p-4 flex flex-col md:flex-row gap-6 items-center shadow-sm border-2 border-transparent hover:border-[#0085D7] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            {/* Imagem */}
            <div className="w-full md:w-[240px] h-[160px] flex-shrink-0 rounded-2xl overflow-hidden relative shadow-inner">
              <img
                src={event.imageSrc}
                alt={event.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Informações Centrais */}
            <div className="flex-grow text-center md:text-left w-full">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3 ${
                  // 3. APLICAÇÃO CORRIGIDA DA LÓGICA
                  categoryColors[event.category] || defaultColor
                }`}
              >
                {event.categoryLabel}
              </span>

              <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight hover:text-[#0085D7] transition-colors">
                {event.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0 line-clamp-2">
                {event.description}
              </p>
            </div>

            {/* Meta Dados (Direita) */}
            <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-3 pl-0 md:pl-6 border-l-0 md:border-l border-gray-100">
              <div className="text-sm text-gray-600 flex items-center gap-3 justify-center md:justify-start">
                <span className="text-purple-600 w-5 text-center">📍</span>{" "}
                {event.location}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-3 justify-center md:justify-start">
                <span className="text-purple-600 w-5 text-center">📅</span>{" "}
                {event.date}
              </div>

              <div className="flex justify-between items-center mt-2 bg-[#F3F0FA] p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 text-lg">🎟️</span>
                  <div className="flex flex-col leading-none">
                    <strong className="text-gray-800 text-lg">
                      {event.tickets}
                    </strong>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                      Restantes
                    </span>
                  </div>
                </div>

                {/* Botão Favorito com stopPropagation (não ativa o clique do card) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(event.id)
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm border z-10 ${
                    favorites.includes(event.id)
                      ? "bg-[#d62f98]/10 border-[#d62f98] text-[#d62f98]"
                      : "bg-white border-gray-200 text-gray-400 hover:text-[#d62f98] hover:border-[#d62f98]"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(event.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div className="mt-16 text-center border-t border-gray-300 pt-8 mx-16">
        <p className="text-gray-500 text-sm">
          © 2025 EVEM – Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
