"use client"

import React, { useState, useRef, useEffect } from "react"
import { useEvents } from "@/hooks/useEvents" // hook
import Link from "next/link"
import {
  Search,
  MapPin,
  Calendar,
  Ticket,
  Music,
  MonitorPlay,
  Drama,
  Dumbbell,
  Briefcase,
  Rocket,
  Utensils,
  BookOpen,
  Baby,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from "lucide-react"

// --- Componentes Auxiliares ---

// Header Transparente
const Header = () => (
  <header className="absolute top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-center px-8 py-4 bg-transparent">
    <div className="flex items-center">
      {/* Ajuste o width conforme necessário para o seu logo */}
      <img
        src="/img/logo-header.png"
        alt="Evem"
        className="h-32 w-auto object-contain brightness-0 invert"
      />
      {/* brightness-0 invert deixa o logo branco se ele for preto, ajuste se necessário */}
    </div>

    <div className="relative w-full max-w-lg mx-8 my-4 md:my-0">
      <input
        type="text"
        placeholder="Buscar eventos"
        className="w-full bg-[#2a1540]/80 border border-[#7b2cbf] rounded-full py-3 px-6 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-[#d62f98] focus:ring-1 focus:ring-[#d62f98] transition-all"
      />
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d62f98] h-5 w-5" />
    </div>

    <nav className="flex gap-8 text-white font-medium">
      <Link href="/events" className="hover:text-[#d62f98] transition-colors">
        Eventos
      </Link>
      <a href="#sobre" className="hover:text-[#d62f98] transition-colors">
        Sobre
      </a>
    </nav>
  </header>
)

// Dados das Categorias
const categories = [
  { icon: Music, label: "Shows e Festas", color: "text-purple-500" },
  { icon: MonitorPlay, label: "Cursos e Workshops", color: "text-blue-500" },
  { icon: Drama, label: "Teatro e Cultura", color: "text-pink-500" },
  { icon: Dumbbell, label: "Esportes e Bem-estar", color: "text-orange-500" },
  { icon: Briefcase, label: "Negócios e Carreira", color: "text-indigo-500" },
  { icon: Rocket, label: "Tecnologia e Inovação", color: "text-cyan-500" },
  { icon: Utensils, label: "Gastronomia e Bebidas", color: "text-lime-500" },
  {
    icon: BookOpen,
    label: "Religião e Espiritualidade",
    color: "text-amber-500",
  },
  { icon: Baby, label: "Infantil e Família", color: "text-rose-500" },
]


export default function LandingPage() {
  //  hook para pegar os eventos reais (do localStorage)
  const { events: rawEvents } = useEvents()
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const events = [...rawEvents].sort((a, b) => {
    const dateA = new Date(a.dates?.[0]?.startDate || "9999-12-31").getTime()
    const dateB = new Date(b.dates?.[0]?.startDate || "9999-12-31").getTime()
    return dateA - dateB
  })

  const scrollCarouselTo = (index: number) => {
    if (carouselRef.current) {
      const scrollAmount = 320
      carouselRef.current.scrollTo({
        left: index * scrollAmount,
        behavior: "smooth",
      })
      setCurrentSlide(index)
    }
  }

  const scrollCarousel = (direction: "left" | "right") => {
    if (events.length === 0) return
    const nextSlide =
      direction === "right"
        ? (currentSlide + 1) % events.length
        : (currentSlide - 1 + events.length) % events.length
    scrollCarouselTo(nextSlide)
  }

  // useEffect para Automação do Carrossel
  // CORREÇÃO DO INTERVALO (Automação)
  useEffect(() => {
    if (events.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % events.length // CORRIGIDO: Usa events.length
        scrollCarouselTo(next)
        return next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [events.length]) // Executa apenas na montagem

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-[#0d001a] text-white min-h-screen font-sans overflow-x-hidden">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        {/* Imagem de fundo com overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/fundo-hero.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80 filter brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d001a]/60 via-[#0d001a]/40 to-[#0d001a]/70"></div>
        </div>

        {/* Elementos Decorativos (Círculos) */}
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-gradient-to-b from-[#d62f98] to-[#7b2cbf] opacity-30 blur-[40px] z-0"></div>
        <div className="absolute bottom-[20%] left-[15%] w-[150px] h-[150px] rounded-full border-[3px] border-[#d62f98] opacity-80 z-0"></div>
        <div className="absolute top-[40%] right-[20%] w-[80px] h-[80px] rounded-full bg-gradient-to-r from-[#d62f98] to-[#ff6b6b] opacity-80 z-0"></div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 max-w-4xl mx-auto">

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link
              href="/signup"
              className="px-10 py-3 rounded-full border border-[#d62f98] text-white font-bold text-lg hover:bg-[#d62f98]/20 transition-all transform hover:scale-105"
            >
              Cadastre-se
            </Link>
            <Link
              href="/login"
              className="px-10 py-3 rounded-full border border-[#7b2cbf] text-white font-bold text-lg hover:bg-[#7b2cbf]/20 transition-all transform hover:scale-105"
            >
              Entrar
            </Link>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO BEM-VINDO (SOBRE) --- */}
      <section
        id="sobre"
        className="py-20 px-6 md:px-16 flex flex-col lg:flex-row items-center justify-between relative bg-[#0d001a]"
      >
        {/* Texto */}
        <div className="lg:w-1/2 mb-12 lg:mb-0 z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Bem-Vindo ao{" "}
            <span className="text-[#eebb58] underline decoration-[#eebb58]">
              EVEM
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          {/* Linha decorativa */}
          <div className="h-[2px] w-[100px] bg-gradient-to-r from-[#7b2cbf] to-transparent"></div>
        </div>

        {/* Visuais (Círculo Roxo + Imagens em Pílula) */}
        <div className="lg:w-1/2 relative h-[500px] w-full max-w-[500px] flex justify-center items-center">
          {/* Círculo Roxo Fundo */}
          <div className="absolute w-[350px] h-[350px] md:w-[400px] md:h-[400px] bg-[#7b2cbf] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

          {/* Imagem Pílula Esquerda (Maior) */}
          <div className="absolute bottom-0 left-[10%] w-[180px] h-[360px] md:w-[200px] md:h-[380px] rounded-[100px] overflow-hidden shadow-2xl z-10 border-4 border-[#0d001a]">
            <img
              src="/img/aa.jpg"
              alt="Plateia"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Imagem Pílula Direita (Menor) */}
          <div className="absolute top-[10%] right-[10%] w-[150px] h-[260px] md:w-[170px] md:h-[280px] rounded-[100px] overflow-hidden shadow-2xl z-20 border-4 border-[#0d001a]">
            <img
              src="/img/bb.jpg"
              alt="Evento"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- SEÇÃO CATEGORIAS --- */}
      <section className="py-16 px-6 md:px-16 bg-[#0d001a]">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#eebb58] border-b-2 border-[#eebb58] inline-block pb-2 font-serif">
          Categorias
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={`/events?category=${cat.label}`}
              className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-transform hover:-translate-y-2 cursor-pointer group h-[160px]"
            >
              <cat.icon
                className={`w-10 h-10 ${cat.color} group-hover:scale-110 transition-transform`}
              />
              <span className="text-gray-800 font-bold text-sm leading-tight group-hover:text-[#7b2cbf] transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- SEÇÃO DESTAQUES --- */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-[#0d001a] to-[#1a0b2e]">
        <div className="flex items-center gap-4 mb-10">
          <Calendar className="text-[#d62f98] w-8 h-8" />
          <h2 className="text-3xl md:text-4xl font-bold font-serif">
            Próximos eventos em{" "}
            <span className="text-[#eebb58] underline decoration-[#eebb58]">
              destaque
            </span>
          </h2>
        </div>

        <div className="relative group">
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-8 px-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/event-details/${event.id}`}
                className="min-w-[300px] h-[450px] relative rounded-3xl overflow-hidden flex-shrink-0 shadow-xl transition-transform hover:scale-105"
              >
                <img
                  src={event.imageUrl || "/img/poster-raphael.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 flex items-center gap-1">
                    <Ticket className="w-3 h-3 text-[#d62f98]" />
                    {event.ticketPrice ? `R$ ${event.ticketPrice}` : "Gratuito"}
                  </div>

                  <h3 className="text-2xl font-bold mb-1">{event.title}</h3>

                  {/* LOCALIZAÇÃO: Agora tipada corretamente usando sua interface Location */}
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <MapPin className="w-4 h-4" />
                    {event.location?.city && event.location?.state
                      ? `${event.location.city} - ${event.location.state}`
                      : "Local a definir"}
                  </div>

                  {/* DATA: Acessando o array de EventDate[] com segurança */}
                  <div className="flex items-center gap-2 text-[#eebb58] text-sm mt-1 font-semibold">
                    <Calendar className="w-4 h-4" />
                    {event.dates && event.dates.length > 0
                      ? new Date(event.dates[0].startDate).toLocaleDateString(
                          "pt-BR",
                        )
                      : "Data a definir"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {events.length > 0 && (
            <>
              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-[#d62f98] transition hidden md:block"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-[#d62f98] transition hidden md:block"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <div className="bg-[#e6e6e6] text-[#333]">
        {/* Botão Voltar ao Topo */}
        <div
          onClick={scrollToTop}
          className="flex justify-center items-center gap-2 py-4 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition font-bold text-[#4B0082]"
        >
          <ArrowUp className="w-5 h-5" /> De volta ao topo
        </div>

        <footer className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Coluna 1 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">Sobre nós</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              A EVEM é uma plataforma de gerenciamento de eventos que conecta
              pessoas a experiências únicas. Nossa missão é simplificar a
              organização e a participação em eventos de todos os tipos.
            </p>
          </div>

          {/* Coluna 2 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">
              Contato e Redes
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Coluna 3 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">Navegue</h3>
            <ul className="space-y-2 text-sm text-gray-600 font-medium">
              <li>
                <Link href="/" className="hover:text-[#7b2cbf]">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#7b2cbf]">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#7b2cbf]">
                  Cadastro
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#7b2cbf]">
                  Lista de Eventos
                </Link>
              </li>
            </ul>
          </div>
        </footer>

        <div className="text-center py-6 border-t border-gray-300 text-sm text-gray-500 font-semibold">
          © 2025 EVEM – Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
