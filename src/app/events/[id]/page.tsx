"use client"

import React, { useEffect } from "react"
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

type EventScheduleItem = {
  day: string
  month: string
  title: string
  time: string
}

type EventData = {
  id: number
  title: string
  category: string
  imageHero: string
  dateRange: string
  fullDate: string
  time: string
  locationName: string
  address: string
  price: string
  description: string[]
  organizer: string
  schedule: EventScheduleItem[]
}

type EventDetailsMock = {
  [key: string]: EventData
  default: EventData
}

// Dados simulados detalhados (Mock) com a tipagem aplicada
const eventDetailsMock: EventDetailsMock = {
  "1": {
    id: 1,
    title: "RAPHAEL GHANEM - SE É QUE VOCÊ ME ENTENDE!",
    category: "Stand Up Comedy",
    imageHero: "/img/poster-raphael.jpg",
    dateRange: "27 a 29 de Novembro",
    fullDate: "Sexta, 27 de Novembro de 2025",
    time: "22:00",
    locationName: "BeFly Minascentro",
    address: "Av. Augusto de Lima, 785 - Centro, Belo Horizonte - MG",
    price: "80,00",
    description: [
      'Com texto, interpretação e direção de Raphael Ghanem, "Se é que você me entende" é um espetáculo de Stand up Comedy, repleto de interações e improvisações, feito com texto 100% autoral e sem auxílio de figurinos, perucas e adereços.',
      "O show que tem a duração de 1h20 min, conta com as histórias de vida do artista, além de suas análises de relacionamento, causos rotineiros, e uma perspectiva um tanto quanto exagerada do cotidiano.",
    ],
    organizer: "Non Stop Produções",
    schedule: [
      {
        day: "27",
        month: "NOV",
        title: "Sessão Extra",
        time: "19:00 (Abertura: 18:00)",
      },
      {
        day: "27",
        month: "NOV",
        title: "Sessão Principal",
        time: "22:00 (Abertura: 21:00)",
      },
      {
        day: "28",
        month: "NOV",
        title: "Sessão Final",
        time: "21:00 (Abertura: 20:00)",
      },
    ],
  },
  "103": {
    id: 103,
    title: "RAPHAEL GHANEM - SE É QUE VOCÊ ME ENTENDE!",
    category: "Stand Up Comedy",
    imageHero: "/img/poster-raphael.jpg",
    dateRange: "27 a 29 de Novembro",
    fullDate: "Sexta, 27 de Novembro de 2025",
    time: "22:00",
    locationName: "BeFly Minascentro",
    address: "Av. Augusto de Lima, 785 - Centro, Belo Horizonte - MG",
    price: "80,00",
    description: [
      'Com texto, interpretação e direção de Raphael Ghanem, "Se é que você me entende" é um espetáculo de Stand up Comedy, repleto de interações e improvisações.',
    ],
    organizer: "Non Stop Produções",
    schedule: [],
  },
  "101": {
    id: 101,
    title: "Festival de delícias culinárias",
    category: "Gastronomia",
    imageHero: "/img/breakfast.jpg",
    dateRange: "15 a 23 de Outubro",
    fullDate: "Quarta, 15 de Outubro de 2025",
    time: "13:00",
    locationName: "The Plaza",
    address: "San Francisco, CA",
    price: "150,00",
    description: [
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
      "Venha provar os melhores pratos da região!",
    ],
    organizer: "Chef Eventos",
    schedule: [],
  },
  default: {
    id: 0,
    title: "Evento Exemplo",
    category: "Categoria",
    imageHero: "/img/breakfast.jpg",
    dateRange: "Data a definir",
    fullDate: "Data a definir",
    time: "00:00",
    locationName: "Local a definir",
    address: "Endereço do evento",
    price: "0,00",
    description: ["Descrição detalhada do evento aparecerá aqui."],
    organizer: "Organizador",
    schedule: [],
  },
} as const

export default function EventDetailsPage() {
  const params = useParams()
  const id = params.id as string | undefined

  const event: EventData =
    eventDetailsMock[id ?? "default"] || eventDetailsMock["default"]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="min-h-screen bg-[#f4f4f8] text-[#333]">
      <Navbar />

      {/* --- HERO SECTION (Banner Escuro) --- */}
      <div className="bg-[#0d001a] text-white py-12 px-6 md:px-16 relative overflow-hidden">
        {/* Botão Voltar */}
        <div className="max-w-6xl mx-auto mb-6 relative z-20">
          <Link
            // Usando 'href' do Next.js
            href="/events"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit"
          >
            <ChevronLeft className="w-5 h-5" /> Voltar para eventos
          </Link>
        </div>

        {/* Círculos Decorativos */}
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] rounded-full bg-[#7b2cbf] opacity-20 blur-[50px]"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-[#d62f98] opacity-20 blur-[40px]"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center relative z-10">
          {/* Imagem do Evento */}
          <div className="w-full md:w-[400px] h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 flex-shrink-0 group">
            <img
              src={event.imageHero}
              alt={event.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
            />
          </div>

          {/* Informações Principais */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#eebb58] text-[#eebb58] text-sm font-bold mb-4">
              {event.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-col gap-3 text-gray-300">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Calendar className="text-[#d62f98] w-5 h-5" />
                <span className="text-lg">{event.dateRange}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="text-[#d62f98] w-5 h-5" />
                <span className="text-lg">{event.time}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <MapPin className="text-[#d62f98] w-5 h-5" />
                <span className="text-lg">
                  {event.locationName} - {event.address}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center md:justify-start">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white text-sm font-semibold border border-white/10">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white text-sm font-semibold border border-white/10">
                <Heart className="w-4 h-4" /> Salvar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL (Grid) --- */}
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLUNA DA ESQUERDA */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 border-b-4 border-[#d62f98] inline-block pb-1">
              Sobre este evento
            </h2>
            <div className="text-gray-600 leading-relaxed text-base space-y-4">
              {event.description.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 bg-[#fff4e5] border-l-4 border-orange-400 p-4 rounded-r-lg">
              <p className="text-orange-800 text-sm font-medium flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>
                  <strong>Classificação Indicativa:</strong> 16 anos. Menores de
                  16 anos somente acompanhados dos pais ou responsáveis legais.
                </span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-6 border-b-4 border-[#d62f98] inline-block pb-1">
              Cronograma
            </h2>

            {event.schedule && event.schedule.length > 0 ? (
              <ul className="space-y-4">
                {/* O loop agora usa o tipo EventScheduleItem */}
                {event.schedule.map((item: EventScheduleItem, idx: number) => (
                  <li
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="bg-[#f3e5f5] text-[#7b1fa2] p-3 rounded-lg text-center min-w-[70px]">
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
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                {event.organizer.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-800">{event.organizer}</p>
                <button className="text-[#0085D7] text-sm font-medium hover:underline">
                  Entre em contato
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* COLUNA DA DIREITA (Card Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-6">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 mb-1">A partir de</p>
                <h3 className="text-3xl font-bold text-[#d62f98]">
                  R$ {event.price}
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
                <span>Cancelamento até 48h antes</span>
              </div>
            </div>

            <Link
              // Usando 'href' do Next.js
              href="/payment"
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
          © 2025 EVEM – Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
