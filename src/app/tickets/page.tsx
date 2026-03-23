"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "../evem-projeto/components/Navbar"
import {
  Ticket as TicketIcon, // Renomeado para não conflitar com a Interface
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
  Clock,
} from "lucide-react"

// 1. Definindo a Interface para acabar com o erro de "any"
interface TicketData {
  id: string | number
  status: "active" | "pending" | "cancelled" | "finished"
  title: string
  imageSrc?: string
  img?: string
  categoryLabel?: string
  category?: string
  description?: string
  location: string
  date: string
  type?: string
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

  // 2. Inicialização segura para o Next.js (Evita cascading renders)
  const [allTickets, setAllTickets] = useState<TicketData[]>([])

  useEffect(() => {
    // Só acessamos o localStorage dentro do useEffect para garantir que estamos no cliente
    const saved = localStorage.getItem("@evem:tickets")
    if (saved) {
      try {
        setAllTickets(JSON.parse(saved))
      } catch (error) {
        console.error("Erro ao carregar tickets:", error)
      }
    }
  }, [])

  const tabs = ["Ativos", "Pendentes", "Cancelados", "Encerrados"]

  const filteredTickets = allTickets.filter((ticket) => {
    if (activeTab === "Ativos") return ticket.status === "active"
    if (activeTab === "Pendentes") return ticket.status === "pending"
    if (activeTab === "Cancelados") return ticket.status === "cancelled"
    if (activeTab === "Encerrados") return ticket.status === "finished"
    return false
  })

  return (
    <div className="min-h-screen bg-[#dae4f8] pb-10 flex flex-col items-center">
      <Navbar />

      <main className="w-[95%] max-w-[1200px] mt-8">
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
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
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
              placeholder="Buscar pelo nome, email, ingresso ou pedido"
              className="w-full py-2.5 px-5 pr-10 rounded-full border border-[#d62f98] focus:outline-none focus:ring-2 focus:ring-[#d62f98] text-sm bg-white"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d62f98] w-4 h-4 cursor-pointer" />
          </div>
        </div>

        <div className="min-h-[300px]">
          {filteredTickets.length > 0 ? (
            <div className="flex flex-col gap-6">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl p-4 flex flex-col md:flex-row gap-6 items-center shadow-sm border-2 border-transparent hover:border-[#0085D7] hover:shadow-md transition-all duration-300"
                >
                  <div className="w-full md:w-[200px] h-[140px] flex-shrink-0 rounded-2xl overflow-hidden relative">
                    <img
                      src={
                        ticket.imageSrc ||
                        ticket.img ||
                        "/placeholder-event.png"
                      }
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow text-center md:text-left w-full">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold mb-2 bg-[#F3E5F5] text-[#7B1FA2]">
                      {ticket.categoryLabel || ticket.category || "Evento"}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto md:mx-0 mb-3">
                      {ticket.description ||
                        "Ingresso adquirido via plataforma Evem."}
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
                      {ticket.status === "active" ? (
                        <TicketIcon className="w-4 h-4 text-[#7b2cbf]" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                      <div className="text-right">
                        <span className="block text-xs font-bold text-gray-800">
                          {ticket.type || "Entrada Geral"}
                        </span>
                        <span
                          className={`block text-[10px] font-bold uppercase ${
                            ticket.status === "active"
                              ? "text-green-600"
                              : "text-yellow-600"
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
            <div className="bg-[#e8efff] rounded-3xl h-[400px] flex flex-col items-center justify-center gap-6 shadow-inner">
              <p className="text-gray-500 text-lg font-medium">
                Não há ingressos na categoria {activeTab}
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

        {/* Rodapé de Categorias */}
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
