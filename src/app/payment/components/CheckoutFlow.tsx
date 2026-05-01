"use client"

import React from "react"
import { useCheckout } from "./context/CheckoutContext"
import StepOneReceiver from "./StepOneReceiver"
import StepTwoPayment from "./StepTwoPayment"
import OrderSummary from "./OrderSummary"
import { useEvents } from "../../../hooks/useEvents"
import Image from "next/image"
import Link from "next/link"

const CheckoutFlow: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    paymentData,
    paymentStatus,
    saveTicket,
  } = useCheckout()

  // Pegamos o evento selecionado para poder salvar os dados corretos no localStorage
  const { selectedEvent } = useEvents()

  // Estilo dinâmico das abas laterais
  const getStepClass = (step: 1 | 2 | 3) =>
    `py-3 px-4 text-left border-l-4 font-semibold cursor-pointer transition-colors duration-200 ${
      currentStep === step
        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
        : "border-purple-200 text-gray-600 hover:bg-purple-100"
    }`

  // Função central para finalizar o processo
  const handleFinishPayment = () => {
    if (selectedEvent) {
      saveTicket(selectedEvent) // Salva no localStorage via Context
    }
    setCurrentStep(3) // Avança para a tela de confirmação
  }

const renderStepContent = () => {
  switch (currentStep) {
    case 1:
      return <StepOneReceiver onNext={() => setCurrentStep(2)} />;

    case 2:
      return (
        <StepTwoPayment
          onBack={() => setCurrentStep(1)}
          onNext={handleFinishPayment} // Aciona a gravação dos dados
        />
      );

    case 3: { // Bloco isolado para evitar erros de declaração léxica
      const isPending = paymentStatus === "pending";
      const isSucceeded = paymentStatus === "succeeded";
      const isPix = paymentData.method === "pix";

      return (
        <div className="flex flex-col space-y-4">
          <h3
            className={`text-xl font-bold flex items-center ${
              isSucceeded ? "text-green-600" : "text-orange-600"
            }`}
          >
            {isSucceeded
              ? "✅ Pagamento recebido com sucesso!"
              : "⏳ Pagamento aguardando confirmação"}
          </h3>

          {isPix && isPending && (
            <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-gray-50">
              <p className="text-lg font-medium text-gray-800">
                Escaneie o QR Code para completar o pagamento:
              </p>
              <div className="relative w-48 h-48 border-2 border-indigo-500 rounded-lg p-2 bg-white">
                <Image
                  src={paymentData.pixQrCodeUrl || "/qrCode.png"}
                  alt="QR Code Pix"
                  fill
                  className="object-contain"
                />
              </div>
              <button className="text-indigo-600 font-semibold hover:underline">
                Copiar Código PIX
              </button>
            </div>
          )}

          <p className="text-gray-700">
            {isSucceeded
              ? "Seu ingresso foi gerado e já está disponível na sua conta."
              : "Seu ingresso ficará ativo assim que a confirmação do pagamento for recebida."}
          </p>

          <Link href="/tickets">
            <button className="mt-4 w-full md:w-48 rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition">
              Ver Meus Ingressos
            </button>
          </Link>
        </div>
      );
    } // Fim do bloco case 3

    default:
      return null;
  }
};

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Coluna Principal: Passos do Checkout */}
      <div className="lg:w-2/3 space-y-4">
        <div
          className={getStepClass(1)}
          onClick={() => currentStep > 1 && setCurrentStep(1)}
        >
          1. Recebimento do ingresso
        </div>
        {currentStep === 1 && (
          <div className="rounded-lg bg-white p-6 shadow-md border border-purple-300">
            {renderStepContent()}
          </div>
        )}

        <div
          className={getStepClass(2)}
          onClick={() => currentStep > 2 && setCurrentStep(2)}
        >
          2. Forma de pagamento
        </div>
        {currentStep === 2 && (
          <div className="rounded-lg bg-white p-6 shadow-md border border-purple-300">
            {renderStepContent()}
          </div>
        )}

        <div className={getStepClass(3)}>3. Confirmação</div>
        {currentStep === 3 && (
          <div className="rounded-lg bg-white p-6 shadow-md border border-purple-300">
            {renderStepContent()}
          </div>
        )}
      </div>

      {/* Coluna Lateral: Resumo */}
      <div className="lg:w-1/3">
        <OrderSummary />
      </div>
    </div>
  )
}

export default CheckoutFlow
