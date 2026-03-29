"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      {/* 🎯 Contenedor */}
      <div className="max-w-2xl w-full text-center space-y-6">

        {/* 🏆 Título */}
        <h1 className="text-4xl md:text-5xl font-bold">
          🏆 Copa Fantasía
        </h1>

        {/* 📅 Info */}
        <p className="text-zinc-400 text-lg">
          Torneo PvP - Formato Show 6 Pick 3
        </p>

        <p className="text-zinc-500">
          📍 Resistencia, Chaco <br />
          📅 12 de Abril
        </p>

        {/* 📜 Reglas */}
        <div className="bg-zinc-900 border border-zinc-700 rounded p-4 text-left space-y-2">
          <h2 className="font-bold text-lg mb-2">Reglas</h2>

          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>Solo tipos: Hada, Dragón y Acero</li>
            <li>Máximo 1500 PC</li>
            <li>Sin Pokémon repetidos</li>
            <li>Formato Show 6 - Pick 3</li>
          </ul>
        </div>

        {/* 🚀 Botones */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">

          <Link
            href="/copa-fantasia/inscripcion"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-bold text-center"
          >
            Inscribirse
          </Link>

          <Link
            href="/copa-fantasia/lobby"
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded font-bold text-center"
          >
            Ver participantes
          </Link>

        </div>

        {/* 👇 Footer */}
        <p className="text-xs text-zinc-600 mt-6">
          Comunidad PoGo Resis
        </p>

      </div>
    </div>
  );
}