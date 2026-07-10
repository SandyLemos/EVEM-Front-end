"use client"

import React, { useState, useRef, useEffect } from "react"
import { useEvents } from "@/hooks/useEvents"
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
import { useParams, useRouter } from "next/navigation" // Certifique-se de importar o useRouter
// --- Componentes Auxiliares ---

// Header Transparente
const Header = () => (
  <header className="absolute top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-center px-8 py-4 bg-transparent">
    <div className="flex items-center">
      <img
        src="/img/logo-header.png"
        alt="Evem"
        className="h-32 w-auto object-contain brightness-0 invert"
      />
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

// Dados das Categorias Atualizados e Mapeados Corretamente
const categories = [
  {
    key: "musicalShows",
    label: "Shows e Festas",
    icon: Music,
    color: "text-purple-400",
    glow: "hover:shadow-purple-500/10 hover:border-purple-500/30",
  },
  {
    key: "courses",
    label: "Cursos e Workshops",
    icon: MonitorPlay,
    color: "text-blue-400",
    glow: "hover:shadow-blue-500/10 hover:border-blue-500/30",
  },
  {
    key: "teather",
    label: "Teatro e Cultura",
    icon: Drama,
    color: "text-pink-400",
    glow: "hover:shadow-pink-500/10 hover:border-pink-500/30",
  },
  {
    key: "sports",
    label: "Esportes e Bem-estar",
    icon: Dumbbell,
    color: "text-orange-400",
    glow: "hover:shadow-orange-500/10 hover:border-orange-500/30",
  },
  {
    key: "business",
    label: "Negócios e Carreira",
    icon: Briefcase,
    color: "text-indigo-400",
    glow: "hover:shadow-indigo-500/10 hover:border-indigo-500/30",
  },
  {
    key: "technology",
    label: "Tecnologia e Inovação",
    icon: Rocket,
    color: "text-cyan-400",
    glow: "hover:shadow-cyan-500/10 hover:border-cyan-500/30",
  },
  {
    key: "gastronomy",
    label: "Gastronomia e Bebidas",
    icon: Utensils,
    color: "text-lime-400",
    glow: "hover:shadow-lime-500/10 hover:border-lime-500/30",
  },
  {
    key: "religious",
    label: "Religião e Espiritualidade",
    icon: BookOpen,
    color: "text-amber-400",
    glow: "hover:shadow-amber-500/10 hover:border-amber-500/30",
  },
  {
    key: "kidsAndFamily",
    label: "Infantil e Família",
    icon: Baby,
    color: "text-rose-400",
    glow: "hover:shadow-rose-500/10 hover:border-rose-500/30",
  },
]
export default function LandingPage() {
  const router = useRouter() // <-- Adicione isso
  const { events: rawEvents } = useEvents()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const carouselRef = useRef<HTMLDivElement>(null)

  // <-- Adicione a função aqui:
  const goToDetails = (id: string | number) => {
    router.push(`/events/${id}`)
  }

  // Filtra primeiro pela categoria selecionada, se houver uma ativa
  const filteredEvents = rawEvents.filter((event) => {
    if (selectedCategory === "all") return true
    return event.category === selectedCategory
  })

  // Ordena os eventos filtrados por data
  const events = [...filteredEvents].sort((a, b) => {
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

  // Automação do Carrossel (reinicia ou se adapta sempre que a quantidade de eventos mudar)
  useEffect(() => {
    if (events.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % events.length
        scrollCarouselTo(next)
        return next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [events.length])

  // Lógica ao clicar nas categorias
  const handleCategoryClick = (categoryKey: string) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory("all") // Limpa se clicar na mesma
    } else {
      setSelectedCategory(categoryKey)
    }
    setCurrentSlide(0) // Reseta o slide para o começo
    if (carouselRef.current) carouselRef.current.scrollLeft = 0
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="bg-[#0d001a] text-white min-h-screen font-sans overflow-x-hidden">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/fundo-hero1.png"
            alt="Background"
            className="w-full h-full object-cover opacity-80 filter brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d001a]/60 via-[#0d001a]/40 to-[#0d001a]/70"></div>
        </div>

        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-gradient-to-b from-[#d62f98] to-[#7b2cbf] opacity-30 blur-[40px] z-0"></div>
        <div className="absolute bottom-[20%] left-[15%] w-[150px] h-[150px] rounded-full border-[3px] border-[#d62f98] opacity-80 z-0"></div>
        <div className="absolute top-[40%] right-[20%] w-[80px] h-[80px] rounded-full bg-gradient-to-r from-[#d62f98] to-[#ff6b6b] opacity-80 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <img
            src="/img/logo-header.png"
            alt="Evem"
            className="h-36 w-auto object-contain brightness-0 invert mb-6"
          />

          <div className="flex flex-col sm:flex-row justify-center gap-6">
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
        <div className="lg:w-1/2 mb-12 lg:mb-0 z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Bem-Vindo ao{" "}
            <span className="text-[#eebb58] underline decoration-[#eebb58]">
              EVEM
            </span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiorimod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <div className="h-[2px] w-[100px] bg-gradient-to-r from-[#7b2cbf] to-transparent"></div>
        </div>

        <div className="lg:w-1/2 relative h-[500px] w-full max-w-[500px] flex justify-center items-center">
          <div className="absolute w-[350px] h-[350px] md:w-[400px] md:h-[400px] bg-[#7b2cbf] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

          <div className="absolute bottom-0 left-[10%] w-[180px] h-[360px] md:w-[200px] md:h-[380px] rounded-[100px] overflow-hidden shadow-2xl z-10 border-4 border-[#0d001a]">
            <img
              src="/img/aa.jpg"
              alt="Plateia"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-[10%] right-[10%] w-[150px] h-[260px] md:w-[170px] md:h-[280px] rounded-[100px] overflow-hidden shadow-2xl z-20 border-4 border-[#0d001a]">
            <img
              src="/img/bb.jpg"
              alt="Evento"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- SEÇÃO CATEGORIAS PREMIUM E FUNCIONAL --- */}
      <section className="py-16 px-6 md:px-16 lg:px-24 bg-[#0d001a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#d62f98]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#eebb58] font-serif tracking-wide">
                Categorias
              </h2>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Explore os segmentos abaixo para atualizar as recomendações de
                destaques instantaneamente.
              </p>
            </div>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs text-[#d62f98] font-bold hover:underline transition-all"
              >
                Ver todas as categorias ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key
              return (
                <div
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3.5 border transition-all duration-300 cursor-pointer h-[155px] relative group overflow-hidden ${
                    isActive
                      ? "bg-white/[0.07] border-[#eebb58] shadow-[0_8px_25px_rgba(238,187,88,0.12)] scale-[1.02]"
                      : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] " +
                        cat.glow
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#eebb58] via-[#d62f98] to-[#eebb58]" />
                  )}

                  <cat.icon
                    className={`w-9 h-9 transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? "text-[#eebb58] drop-shadow-[0_0_8px_rgba(238,187,88,0.4)]"
                        : cat.color
                    }`}
                  />
                  <span
                    className={`font-bold text-xs md:text-sm tracking-wide transition-colors leading-tight ${
                      isActive
                        ? "text-[#eebb58]"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- SEÇÃO CARROSSEL DESTAQUES --- */}
      <section className="py-16 px-6 md:px-16 lg:px-24 bg-[#0d001a] relative overflow-hidden">
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
      {/* --- FOOTER --- */}
      <div className="bg-[#e6e6e6] text-[#333]">
        <div
          onClick={scrollToTop}
          className="flex justify-center items-center gap-2 py-4 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition font-bold text-[#4B0082]"
        >
          <ArrowUp className="w-5 h-5" /> De volta ao topo
        </div>

        <footer className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">Sobre nós</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              A EVEM é uma plataforma de gerenciamento de eventos que conecta
              pessoas a experiências únicas. Nossa missão é simplificar a
              organização e a participação em eventos de todos os tipos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-black">
              Contato e Redes
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

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
