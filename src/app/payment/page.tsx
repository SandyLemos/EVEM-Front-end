"use client"

import { useSearchParams } from "next/navigation"
import CheckoutFlow from "./components/CheckoutFlow"
import { CheckoutProvider } from "./components/context/CheckoutContext"
import Header from "./components/Header"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
// Importamos a fonte da verdade para os dados
import { eventDetails } from "@/app/dashboard/data/mockData"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get("id") // Pega o ID da URL

  // Busca o evento diretamente do mock centralizado usando o ID da URL
  // Se não encontrar o ID ou não houver ID, usa o evento "default"
  const currentEvent = eventId ? eventDetails[eventId] : eventDetails["default"]
  const selectedEventName = currentEvent?.title || "Evento Selecionado"

  return (
    <CheckoutProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="mb-6">
              <Link
                href={`/events/${eventId || ""}`}
                className="flex items-center gap-1 text-gray-500 hover:text-purple-600 transition-colors w-fit group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">
                  Voltar para o evento
                </span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Finalizar Compra
            </h1>
            {/* Agora o nome será exibido corretamente conforme o ID da URL */}
            <p className="text-purple-600 font-medium">{selectedEventName}</p>
          </div>

          <div className="rounded-xl bg-purple-50 p-6 shadow-lg lg:p-10">
            <CheckoutFlow />
          </div>
        </main>
      </div>
    </CheckoutProvider>
  )
}
