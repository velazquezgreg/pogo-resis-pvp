"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">

      <div className="max-w-2xl w-full text-center space-y-8">

        {/* 🏆 Logo */}
        <img
          src="https://i.ibb.co/DPSWzghL/fantasy-cup-icon.png"
          alt="Copa Fantasía"
          className="w-32 mx-auto drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
        />

        {/* 🏆 Título */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Copa Fantasía
          </h1>
          <p className="text-purple-400 text-lg mt-2">
            Torneo PvP • Show 6 Pick 3
          </p>
        </div>

        {/* 🤝 Organizadores */}
        <div className="space-y-3">
          <p className="text-zinc-400 text-sm uppercase tracking-widest">
            Organizan
          </p>

          <div className="flex justify-center items-center gap-8">
            <img
              src="https://i.ibb.co/QF7rnRQP/77-sin-t-tulo-20250109150417-2.png"
              alt="Pogo Resis"
              className="h-12 opacity-80 hover:opacity-100 transition"
            />
            <img
              src="https://i.ibb.co/ZR2NfhJP/Logo-Sello.png"
              alt="OTK POP"
              className="h-12 opacity-80 hover:opacity-100 transition"
            />
          </div>
        </div>

        {/* 📍 Info */}
        <div className="text-zinc-400 space-y-1">
          <p className="text-lg">📍 Resistencia, Chaco</p>
          <p className="text-sm">
            Casa de las Culturas (Marcelo T. de Alvear 90)
          </p>
          <p className="text-purple-400 font-semibold text-lg mt-2">
            📅 12 de Abril
          </p>
        </div>

        {/* 📜 Reglas */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 text-left space-y-3 shadow-lg">
          <h2 className="font-bold text-lg">Reglas</h2>

          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>Solo tipos: Hada, Dragón y Acero</li>
            <li>Máximo 1500 PC</li>
            <li>No se pueden cambiar ataques luego de inscribirse</li>
            <li>Megaevoluciones prohibidas</li>
            <li>1 Pokémon por especie</li>
            <li>Formato doble eliminación</li>
          </ul>
        </div>

        {/* 🚀 Botones */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">

          <Link
            href="/copa-fantasia/inscripcion"
            className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-bold shadow-lg"
          >
            Inscribirse
          </Link>

          <Link
            href="/copa-fantasia/lobby"
            className="bg-zinc-800 hover:bg-zinc-700 transition px-6 py-3 rounded-xl font-bold border border-zinc-600"
          >
            Ver participantes
          </Link>

        </div>

        {/* 👇 Footer */}
        <p className="text-xs text-zinc-600 pt-4">
          Comunidad PoGo Resis <br />
          Desarrollado por boonju
        </p>

      </div>
    </div>
  );
}