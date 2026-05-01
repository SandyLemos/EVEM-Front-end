"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Menu,
  User,
  PenLine,
  Trash2,
  ArrowLeft,
  CreditCard,
  Ticket,
  Heart,
  LogOut,
} from "lucide-react"

export default function AccountPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Dados simulados do usuário
  const [userData, setUserData] = useState({
    name: "Fulana de Tal",
    email: "Fulanadetal@gmail.com",
    password: "************",
  })

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleEdit = (field: string) => {
    alert(`Editar ${field} (Funcionalidade em desenvolvimento)`)
  }

  const handleLogout = () => {
    // Lógica de logout aqui
    router.push("/")
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#1a0b2e] bg-[url('/img/fundo-hero.png')] bg-cover bg-center pb-10">
      {/* --- CABEÇALHO FLUTUANTE (BRANCO) --- */}
      <header className="w-[95%] max-w-[1200px] mt-6 px-6 py-3  shadow-lg grid grid-cols-[1fr_auto_1fr] items-center relative z-50">
        {/* Espaçador Esquerdo */}
        <div></div>

        {/* Logo Central */}
        <div className="flex justify-center">
          <Link href="/events">
            <img
              src="/img/logo-header.png"
              alt="Evem"
              className="h-[80px] md:h-[100px] w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* Menu Perfil (Direita) */}
        <div className="flex justify-end relative" ref={dropdownRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-[#f0f0f0] border-none py-1.5 px-2 pr-1.5 pl-4 rounded-full flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Menu className="w-5 h-5 text-[#0085D7]" />
            <div className="w-9 h-9 bg-[#0d001a] text-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-2">
                <div className="w-10 h-10 bg-[#0085D7] text-white rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <strong className="text-sm text-black truncate">
                    {userData.name}
                  </strong>
                  <span className="text-xs text-gray-500 truncate">
                    {userData.email}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 p-2.5 text-gray-700 bg-gray-50 rounded-lg font-medium"
                  >
                    <CreditCard className="w-4 h-4" /> Minha conta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tickets"
                    className="flex items-center gap-3 p-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Ticket className="w-4 h-4" /> Meus Ingressos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 p-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Heart className="w-4 h-4" /> Favoritos
                  </Link>
                </li>
              </ul>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium text-left"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- CARTÃO DE DADOS DA CONTA --- */}
      <main className="flex-grow flex items-center justify-center w-full p-6 mt-8">
        <div className="bg-white w-full max-w-[500px] p-8 md:p-10 rounded-3xl shadow-2xl">
          <h2 className="text-[#333] text-2xl font-bold mb-8 text-center md:text-left">
            Dados da Conta
          </h2>

          <div className="flex flex-col gap-6">
            {/* Campo Nome */}
            <div className="space-y-2">
              <label className="text-[#4B0082] font-bold text-sm ml-1">
                Nome
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={userData.name}
                  readOnly
                  className="w-full py-3 px-4 pr-10 border border-[#7b2cbf] rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-[#7b2cbf]/20 bg-white"
                />
                <PenLine
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0085D7] w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleEdit("Nome")}
                />
              </div>
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label className="text-[#4B0082] font-bold text-sm ml-1">
                E-mail
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full py-3 px-4 pr-10 border border-[#7b2cbf] rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-[#7b2cbf]/20 bg-white"
                />
                <PenLine
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0085D7] w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleEdit("E-mail")}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label className="text-[#4B0082] font-bold text-sm ml-1">
                Senha
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={userData.password}
                  readOnly
                  className="w-full py-3 px-4 pr-10 border border-[#7b2cbf] rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-[#7b2cbf]/20 bg-white"
                />
                <PenLine
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0085D7] w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleEdit("Senha")}
                />
              </div>
            </div>

            {/* Rodapé do Form */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-500">
                  Gerenciamento de conta
                </span>
                <button className="flex items-center gap-2 text-[#0085D7] font-bold text-sm hover:text-red-500 hover:underline transition-colors w-fit">
                  Excluir a conta
                </button>
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="text-center mt-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-[#d62f98] font-bold hover:underline transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para Eventos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
