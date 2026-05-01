"use client"

import React, { useState, useEffect, useRef } from "react"
// Importação CORRETA para React Router Dom
import Link from "next/link"
import { useRouter } from "next/navigation"

// --- Ícones (Mantidos do código anterior) ---

interface IconProps {
  className?: string
}

const IconUser: React.FC<IconProps> = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)
const IconMenu: React.FC<IconProps> = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
)
const IconAccount: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)
const IconTickets: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)
const IconHeart: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-.318-.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)
const IconLogout: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-3m0-8V5a3 3 0 013-3h7a3 3 0 013 3v3"
    />
  </svg>
)

// --------------------------------------------------------
// COMPONENTE PRINCIPAL (Navbar)
// --------------------------------------------------------

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Lógica de fechar o menu ao clicar fora (corrigido para usar o ref)
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

  const handleLogout = () => {
    // TODO: Implementar a limpeza do token/sessão
    setIsMenuOpen(false)
    router.push("/login")
  }

  return (
    // Usando grid ou flex justify-between com 3 colunas para alinhamento
    <nav className="flex items-center justify-between px-6 md:px-10 py-4 relative z-50">
      {/* 1. Espaçador/Bloco Esquerdo (Para alinhar a Logo no centro) */}
      {/* Ocupa o espaço à esquerda do menu */}
      <div className="w-[110px] hidden md:block flex-shrink-0"></div>

      {/* 2. Logo Centralizada (flex-grow para ocupar o espaço central) */}
      <div className="flex-grow flex justify-center">
        <Link href="/events">
          <img
            src="/img/logo-header.png"
            alt="Evem"
            className="h-[60px] md:h-[120px] w-auto object-contain"
          />
        </Link>
      </div>

      {/* 3. Ícone do Usuário (Menu Dropdown) - ALINHAMENTO CORRIGIDO */}
      {/* Mantido com largura fixa para centralização simétrica */}
      <div
        className="relative w-[110px] flex justify-end flex-shrink-0"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          // onBlur é mantido, mas o useEffect é mais robusto
          onBlur={() => setTimeout(() => setIsMenuOpen(false), 200)}
          // Estilo do botão: roxo/índigo com borda
          className="flex items-center space-x-2 rounded-full border-2 border-purple-200 p-1 bg-white shadow-md transition duration-200 hover:shadow-lg focus:outline-none"
          aria-expanded={isMenuOpen}
          aria-controls="user-menu"
        >
          {/* Ícone de Menu (Hamburger) */}
          <IconMenu className="w-6 h-6 text-indigo-500" />
          {/* Avatar - CORRIGIDO: Certifique-se de que o p-1 não esmague o ícone */}
          <IconUser className="w-8 h-8 text-white rounded-full bg-purple-600 p-1" />
        </button>

        {/* Dropdown Content */}
        {isMenuOpen && (
          <div
            id="user-menu"
            // Ajuste a posição para 'end-0' ou 'right-0'
            className="absolute end-0 mt-4 w-64 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-20"
          >
            {/* Informações do Usuário */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <IconUser className="w-10 h-10 mr-3 text-white rounded-full bg-purple-600 p-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-800">FULANO DE TAL</p>
                <p className="text-sm text-gray-500">fulanodetal@gmail.com</p>
              </div>
            </div>

            {/* Lista de Links (RRD) */}
            <nav className="py-1">
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition duration-150"
              >
                <IconAccount className="w-5 h-5 mr-3 text-indigo-500" /> Minha
                conta
              </Link>
              <Link
                href="/tickets"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition duration-150"
              >
                <IconTickets className="w-5 h-5 mr-3 text-indigo-500" /> Meus
                Ingressos
              </Link>
              <Link
                href="/favorites"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition duration-150"
              >
                <IconHeart className="w-5 h-5 mr-3 text-indigo-500" /> Favoritos
              </Link>

              {/* Link de Sair (Logout) */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 transition duration-150 border-t mt-1"
              >
                <IconLogout className="w-5 h-5 mr-3 text-red-600" /> Sair
              </button>
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}
