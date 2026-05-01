export interface ReceiverData {
  fullName: string
  email: string
  confirmEmail: string
}

export type PaymentMethod = "creditCard" | "pix" | "boleto"

export interface PaymentData {
  method: PaymentMethod
  pixQrCodeUrl?: string | null
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}

export interface SavedTicket {
  id: string | number
  ticketUniqueId: number
  title: string
  imageSrc: string
  categoryLabel: string
  location: string
  date: string
  status: "active" | "pending" | "cancelled" | "finished"
  type: string
  description?: string
}

// Interface para substituir o "any" no saveTicket
export interface SaveTicketParams {
  id: string | number
  title?: string
  imageSrc?: string
  img?: string
  categoryLabel?: string
  category?: string
  location?: string
  date?: string
  type?: string
  description?: string
}

export interface CheckoutContextType {
  receiverData: ReceiverData
  setReceiverData: (data: ReceiverData) => void
  paymentData: PaymentData
  setPaymentData: (data: PaymentData) => void
  currentStep: 1 | 2 | 3
  setCurrentStep: (step: 1 | 2 | 3) => void
  paymentStatus: "initial" | "processing" | "succeeded" | "pending" | "failed"
  setPaymentStatus: (
    status: "initial" | "processing" | "succeeded" | "pending" | "failed",
  ) => void
  saveTicket: (
    eventData: SaveTicketParams,
    statusOverride?: "succeeded" | "pending",
  ) => void
}
