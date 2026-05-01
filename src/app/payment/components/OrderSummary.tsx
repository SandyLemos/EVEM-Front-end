"use client"

import React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { eventDetails } from "@/app/dashboard/data/mockData"

const OrderSummary: React.FC = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get("id")

  // Busca o evento ou usa o Raphael Ghanem como padrão (fallback)
  const event =
    eventId && eventDetails[eventId]
      ? eventDetails[eventId]
      : eventDetails["default"]

  const displayImage = event.imageUrl || "/img/placeholder.png"
  const displayPrice =
    event.ticketPrice?.toLocaleString("pt-BR", {
       minimumFractionDigits: 2,
    }) || "0,00"

      // Tratamento para o campo location que no mock é um objeto
  const displayLocation =
    typeof event.location === "object"
        ? `${event.location.name} - ${event.location.city}`
        : event.location || "Local não informado"

  const displayDate =
    event.dates && event.dates.length > 0
        ? event.dates[0].startDate
        : "Data a definir"

  const GRADIENT_BORDER_CLASS =
    "p-[2px] bg-gradient-to-r from-[#4D53EA] to-[#CE00AD] rounded-xl"
  const SUMMARY_BAR_CLASS =
    "bg-[#058BD3] text-white py-1 px-4 font-semibold text-lg rounded-t-lg rounded-b-none"

  return (
    <div className="top-20 w-full">
      {/* 1. Ticket do Evento (Topo Dinâmico) */}
      <div
        className={`mb-4 shadow-lg bg-white ${GRADIENT_BORDER_CLASS} relative`}
      >
        <div className="bg-white rounded-[10px] p-4 flex items-start space-x-3">
          <div className="flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden">
            <Image
              src={displayImage}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-grow">
            <h4 className="text-base font-bold text-gray-900 leading-tight uppercase">
              {event.title}
            </h4>
            <p className="text-xs mt-1 flex items-center text-[#838383]">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {displayLocation}
            </p>
            <span className="mt-2 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
              {event.category || "Evento"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Resumo do Pedido Dinâmico */}
      <div
        className={`rounded-xl bg-white shadow-lg ${GRADIENT_BORDER_CLASS} p-[2px]`}
      >
        <div className="bg-white rounded-[10px] p-0 overflow-hidden">
          <h3 className={SUMMARY_BAR_CLASS}>Resumo do Pedido</h3>

          <div className="mt-4 space-y-2 px-4 pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">{displayDate}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ingresso</span>
              <span className="font-medium text-gray-900">Entrada geral</span>
            </div>

            <div className="flex justify-between font-bold text-xl border-t pt-4">
              <span className="text-gray-900">Total</span>
              <span className="text-[#CE00AD]">R$ {displayPrice}</span>
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-[#4D53EA] to-[#CE00AD] rounded-full mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary