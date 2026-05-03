"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui viria a lógica de autenticação
    console.log("Login enviado")
    router.push("/events") // Simula o redirecionamento
  }

  return (
    // Container Principal com Imagem de Fundo
    <div className="min-h-screen w-full flex items-center justify-center bg-[linear-gradient(rgba(13,0,26,0.92),rgba(13,0,26,0.92)),url('/img/fundo-hero.png')] bg-cover bg-center p-4 md:p-8">
      {/* Card de Login (Efeito de Vidro) */}
      <div className="w-full max-w-[380px] p-8 rounded-xl border border-white/10 bg-[#1e0a32]/80 backdrop-blur-md shadow-2xl text-center text-white">
        <h2 className="text-3xl font-bold mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="text-left flex flex-col gap-5">
          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              className="w-full h-10 px-3 rounded bg-white text-[#333] text-sm outline-none focus:ring-2 focus:ring-[#d62f98] transition"
            />
          </div>

          {/* Input Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="******"
              required
              className="w-full h-10 px-3 rounded bg-white text-[#333] text-sm outline-none focus:ring-2 focus:ring-[#d62f98] transition"
            />
          </div>

          {/* Opções (Lembrar / Esqueci senha) */}
          <div className="flex justify-between items-center text-xs text-gray-300">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" className="accent-[#d62f98]" /> Lembrar de
              mim
            </label>
            <a
              href="#"
              className="text-[#eebb58] font-semibold hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            className="w-full h-10 mt-2 bg-[#d62f98] hover:bg-[#b0247a] text-white rounded font-bold transition duration-300 cursor-pointer shadow-lg"
          >
            Login
          </button>

          {/* Links de Rodapé */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Não tem uma conta?{" "}
            <Link
              href="/signup"
              className="text-[#eebb58] font-semibold hover:underline"
            >
              Cadastre-se
            </Link>
          </div>

          <Link
            href="/"
            className="block mt-2 text-center text-xs text-gray-500 hover:text-white transition"
          >
            ← Voltar para o site
          </Link>
        </form>
      </div>
    </div>
  )
}
