"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navbar } from "../evem-projeto/components/Navbar"
import {
  Ticket as TicketIcon,
  Search,
  MapPin,
  Calendar,
  Music,
  MonitorPlay,
  Drama,
  Dumbbell,
  Briefcase,
  Rocket,
  Utensils,
  BookOpen,
  Baby,
} from "lucide-react"

// Interface para tipagem (Boa prática que você valoriza no planejamento)
interface EventTicket {
  id: string | number
  ticketUniqueId?: string
  title: string
  description: string
  categoryLabel: string
  location: string
  date: string
  imageSrc: string
  status: "active" | "pending" | "canceled"
  type: string
}

const categories = [
  { icon: Music, label: "Shows e Festas", slug: "shows" },
  { icon: MonitorPlay, label: "Cursos e Workshops", slug: "cursos" },
  { icon: Drama, label: "Teatro e Cultura", slug: "teatro" },
  { icon: Dumbbell, label: "Esportes e Bem-estar", slug: "esportes" },
  { icon: Briefcase, label: "Negócios e Carreira", slug: "negocios" },
  { icon: Rocket, label: "Tecnologia e Inovação", slug: "tecnologia" },
  { icon: Utensils, label: "Gastronomia e Bebidas", slug: "gastronomia" },
  { icon: BookOpen, label: "Religião e Espiritualidade", slug: "religiao" },
  { icon: Baby, label: "Infantil e Família", slug: "infantil" },
]

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState("Ativos")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs = ["Ativos", "Pendentes", "Cancelados", "Esgotados"]

  const [tickets] = useState<EventTicket[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("@evem:tickets")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Lógica de Filtragem: Aba + Busca
  const filteredTickets = tickets.filter((t) => {
    // 1. Filtro por Aba
    const matchTab =
      (activeTab === "Ativos" && t.status === "active") ||
      (activeTab === "Pendentes" && t.status === "pending") ||
      (activeTab === "Cancelados" && t.status === "canceled")

    // 2. Filtro por Busca (Nome do evento ou localização)
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchTab && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#dae4f8] pb-10 pt-24 flex flex-col items-center relative">
      <div className="absolute inset-x-0 top-4 z-50">
        <Navbar />
      </div>

      <main className="w-[95%] max-w-[1200px] mt-8 px-4 md:px-0">
        <div className="flex items-center gap-3 mb-8">
          <TicketIcon className="text-[#0085D7] w-8 h-8 -rotate-45" />
          <h1 className="text-3xl font-bold text-black font-serif">
            Ingressos
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${
                  activeTab === tab
                    ? "bg-black text-white border-black"
                    : "bg-white text-[#333] border-gray-300 hover:-translate-y-1 shadow-sm"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pelo nome ou local"
              className="w-full py-2.5 px-5 pr-10 rounded-full border border-[#d62f98] focus:outline-none focus:ring-2 focus:ring-[#d62f98] text-sm bg-white"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d62f98] w-4 h-4" />
          </div>
        </div>

        <div className="min-h-[300px]">
          {filteredTickets.length > 0 ? (
            <div className="flex flex-col gap-6">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.ticketUniqueId || ticket.id}
                  className="bg-white rounded-3xl p-4 flex flex-col md:flex-row gap-6 items-center shadow-sm border-2 border-transparent hover:border-[#0085D7] hover:shadow-md transition-all duration-300"
                >
                  <div className="w-full md:w-[200px] h-[140px] flex-shrink-0 rounded-2xl overflow-hidden relative">
                    <img
                      src={ticket.imageSrc}
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow text-center md:text-left w-full">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-2 bg-[#F3E5F5] text-[#7B1FA2]">
                      {ticket.categoryLabel}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto md:mx-0 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#7b2cbf]" />{" "}
                        {ticket.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7b2cbf]" />{" "}
                        {ticket.date}
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex-shrink-0 flex flex-col items-center md:items-end gap-3 px-4">
                    <div className="bg-[#F3F0FA] px-4 py-2 rounded-lg flex items-center gap-2">
                      <TicketIcon className="w-4 h-4 text-[#7b2cbf]" />
                      <div className="text-right">
                        <span className="block text-xs font-bold text-gray-800">
                          {ticket.type}
                        </span>
                        <span
                          className={`block text-[10px] font-bold uppercase ${
                            ticket.status === "active"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          {ticket.status === "active"
                            ? "Confirmado"
                            : "Pendente"}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/events/${ticket.id}`}
                      className="text-xs font-bold text-[#0085D7] hover:underline"
                    >
                      Ver detalhes do evento
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#e8efff] rounded-3xl h-[400px] flex flex-col items-center justify-center gap-6 shadow-inner text-center px-4">
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery
                  ? `Nenhum resultado para "${searchQuery}" em ${activeTab}`
                  : `Não há ingressos na categoria ${activeTab}`}
              </p>
              <Link
                href="/events"
                className="bg-[#0085D7] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#006bb3] transition transform hover:-translate-y-1"
              >
                ENCONTRAR EVENTOS
              </Link>
            </div>
          )}
        </div>

        {/* --- RODAPÉ DE CATEGORIAS --- */}
        <section className="mt-16 mb-10">
          <h2 className="text-2xl font-bold text-[#eebb58] mb-8 border-b-2 border-[#eebb58] inline-block pb-1 font-serif">
            Navegue por Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/events?category=${cat.slug}`}
                className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group h-[120px]"
              >
                <cat.icon className="w-8 h-8 text-[#7b2cbf] group-hover:scale-110 transition-transform" />
                <span className="text-gray-800 font-bold text-xs leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
