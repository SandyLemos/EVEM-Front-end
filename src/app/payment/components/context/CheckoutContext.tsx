"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"
import {
  ReceiverData,
  PaymentData,
  SavedTicket,
  CheckoutContextType,
  SaveTicketParams,
} from "@/app/dashboard/types/checkout"

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
)

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error("useCheckout deve ser usado dentro de um CheckoutProvider")
  }
  return context
}

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [receiverData, setReceiverData] = useState<ReceiverData>({
    fullName: "",
    email: "",
    confirmEmail: "",
  })
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: "creditCard",
  })
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [paymentStatus, setPaymentStatus] = useState<
    "initial" | "processing" | "succeeded" | "pending" | "failed"
  >("initial")

  /**
   * Salva ou atualiza um ticket no localStorage.
   * A lógica de normalização (como tratar descrição e imagem) foi integrada aqui
   * para garantir a consistência na página de ingressos.
   */
  const saveTicket = (
    eventData: SaveTicketParams,
    statusOverride?: "succeeded" | "pending",
  ) => {
    if (typeof window === "undefined") return

    if (!eventData.id) {
      console.error("[Evem] Erro: Tentativa de salvar ticket sem ID.")
      return
    }

    const savedTickets: SavedTicket[] = JSON.parse(
      localStorage.getItem("@evem:tickets") || "[]",
    )

    // Lógica de status: succeeded vira 'active', qualquer outra coisa vira 'pending'
    const statusToUse =
      statusOverride ||
      (paymentStatus === "succeeded" || paymentStatus === "pending"
        ? paymentStatus
        : "pending")

    const finalStatus = statusToUse === "succeeded" ? "active" : "pending"

    const existingIndex = savedTickets.findIndex(
      (t) => String(t.id) === String(eventData.id),
    )

    // Normalização dos dados (Garante que campos de diferentes fontes funcionem)
    const normalizedDescription = Array.isArray(eventData.description)
      ? eventData.description[0]
      : eventData.description || "Ingresso adquirido via plataforma Evem."

    const normalizedImage =
      eventData.imageSrc ||
      eventData.img ||
      eventData.imageUrl ||
      ""

    if (existingIndex !== -1) {
      // Atualiza o ticket existente com os NOVOS dados do evento selecionado
      savedTickets[existingIndex] = {
        ...savedTickets[existingIndex], // mantém dados como ticketUniqueId
        title: eventData.title || savedTickets[existingIndex].title,
        imageSrc: normalizedImage || savedTickets[existingIndex].imageSrc,
        location: eventData.location || savedTickets[existingIndex].location,
        status: finalStatus, // Atualiza o status (active/pending)
      }
      localStorage.setItem("@evem:tickets", JSON.stringify(savedTickets))
    } else {
      // Cria um novo ticket
      const newTicket: SavedTicket = {
        id: eventData.id,
        ticketUniqueId: Date.now(),
        title: eventData.title || "Evento",
        imageSrc: normalizedImage,
        categoryLabel: eventData.categoryLabel || eventData.category || "Geral",
        location: eventData.location || "Local não informado",
        date: eventData.date || "Data a definir",
        type: eventData.type || "Entrada Geral",
        status: finalStatus,
        description: normalizedDescription,
      }

      localStorage.setItem(
        "@evem:tickets",
        JSON.stringify([newTicket, ...savedTickets]),
      )
    }
  }

  return (
    <CheckoutContext.Provider
      value={{
        receiverData,
        setReceiverData,
        paymentData,
        setPaymentData,
        currentStep,
        setCurrentStep,
        paymentStatus,
        setPaymentStatus,
        saveTicket,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}
