"use client"

import React, { useState } from "react"
import { useCheckout } from "./context/CheckoutContext"
import CreditCardForm from "./CreditCardForm"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { eventDetails } from "@/app/dashboard/data/mockData"

interface StepTwoProps {
  onBack: () => void
  onNext: () => void
}

const StepTwoPayment: React.FC<StepTwoProps> = ({ onBack, onNext }) => {
  const { paymentData, setPaymentStatus, saveTicket } = useCheckout()
  const searchParams = useSearchParams()
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false)

  const eventId = searchParams.get("id") || "1"
  const currentEvent = eventDetails[eventId] || eventDetails["default"]

 
  // ESTA FUNÇÃO RESOLVE O CONFLITO DE TIPAGEM
  const handleSaveTicket = (status: "succeeded" | "pending") => {
    // Montamos a string de endereço a partir do objeto location do mock
    const locationString =
      typeof currentEvent.location === "object"
        ? `${currentEvent.location.name} - ${currentEvent.location.city}, ${currentEvent.location.state}`
        : currentEvent.location

    // Pegamos a primeira data disponível no array de dates do mock
    const eventDate =
      currentEvent.dates && currentEvent.dates.length > 0
        ? currentEvent.dates[0].startDate
        : "Data a definir"

    saveTicket(
      {
        ...currentEvent,
        location: locationString, // Agora é uma string, o erro de "Type Location is not assignable to type string" some.
        date: eventDate, // Passamos a data extraída do array
        img: currentEvent.imageUrl, // Mapeamos imageUrl para img
      },
      status,
    )
  }

  const handlePaymentSubmit = async () => {
    if (paymentData.method === "creditCard") {
      const targetStatus = "succeeded"
      setPaymentStatus(targetStatus)
      handleSaveTicket(targetStatus)
      onNext()
      return
    }

    if (paymentData.method === "boleto") {
      const targetStatus = "pending"
      setPaymentStatus(targetStatus)
      handleSaveTicket(targetStatus)
      onNext()
      return
    }

    if (paymentData.method === "pix") {
      if (!qrCodeGenerated) {
        setQrCodeGenerated(true)
      } else {
        const targetStatus = "pending"
        setPaymentStatus(targetStatus)
        handleSaveTicket(targetStatus)
        onNext()
      }
    }
  }

  const handlePixConfirmed = () => {
    const targetStatus = "succeeded"
    setPaymentStatus(targetStatus)
    handleSaveTicket(targetStatus)
    onNext()
  }

  const getButtonText = () => {
    if (paymentData.method === "pix") {
      return qrCodeGenerated ? "Próximo" : "Gerar QR Code"
    }
    return "Finalizar Compra"
  }

  return (
    <div>
      <h3 className="mb-6 text-xl font-bold text-gray-800">
        Forma de pagamento
      </h3>

      {/* Preview do Evento para confirmar que o ID 5 carregou certo */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm">
          <Image
            src={currentEvent.imageUrl || "/img/placeholder.png"}
            alt={currentEvent.title}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-black text-indigo-900 uppercase tracking-tight">
            {currentEvent.title}
          </p>
          <p className="text-xs text-indigo-700 font-medium">
            R$ {currentEvent.ticketPrice?.toLocaleString("pt-BR")},00
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <PaymentOption method="creditCard" label="Cartão de Crédito/Débito" />
        <PaymentOption method="pix" label="PIX" />
        <PaymentOption method="boleto" label="Boleto" />
      </div>

      {/* Lógica do PIX */}
      {paymentData.method === "pix" && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex flex-col items-center">
          <p className="text-sm text-purple-700 mb-4 text-center">
            Escaneie o QR Code para pagar.
          </p>
          {qrCodeGenerated && (
            <>
              <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-md mb-4">
                <Image
                  src={paymentData.pixQrCodeUrl || "/qrCode.png"}
                  alt="Pix QR Code"
                  width={128}
                  height={128}
                />
              </div>
              <button
                onClick={handlePixConfirmed}
                className="text-xs text-green-600 hover:underline"
              >
                (Simular Confirmação)
              </button>
            </>
          )}
        </div>
      )}

      {paymentData.method === "creditCard" && (
        <CreditCardForm onSubmit={handlePaymentSubmit} />
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Voltar
        </button>
        <button
          onClick={handlePaymentSubmit}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  )
}

// Sub-componente mantido
const PaymentOption: React.FC<{
  method: "creditCard" | "pix" | "boleto"
  label: string
}> = ({ method, label }) => {
  const { paymentData, setPaymentData } = useCheckout()
  const active = paymentData.method === method
  return (
    <div
      onClick={() => setPaymentData({ ...paymentData, method })}
      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all 
      ${active ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}
    >
      <div
        className={`w-4 h-4 rounded-full border-2 mr-3 ${active ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}
      />
      <span
        className={`font-semibold ${active ? "text-indigo-900" : "text-gray-600"}`}
      >
        {label}
      </span>
    </div>
  )
}

export default StepTwoPayment
