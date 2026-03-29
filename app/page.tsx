"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      <div className="max-w-2xl w-full text-center space-y-6">

        {/* 🏆 Logo Copa */}
        <img
          src="https://i.ibb.co/DPSWzghL/fantasy-cup-icon.png"
          alt="Copa Fantasía"
          className="w-28 mx-auto mb-2"
        />

        {/* 🏆 Título */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Copa Fantasía
        </h1>

        {/* 🤝 Organizadores */}
        <div className="space-y-2">
          <p className="text-zinc-400 text-sm">Organizan</p>

          <div className="flex justify-center items-center gap-6">
            <img
              src="https://i.ibb.co/QF7rnRQP/77-sin-t-tulo-20250109150417-2.png"
              alt="Pogo Resis"
              className="h-12 object-contain"
            />
            <img
              src="https://i.ibb.co/ZR2NfhJP/Logo-Sello.png"
              alt="OTK POP"
              className="h-12 object-contain"
            />
          </div>
        </div>

        {/* 📅 Info */}
        <p className="text-zinc-400 text-lg">
          Torneo PvP
        </p>

        <p className="text-zinc-500">
          📍 Resistencia, Chaco <br />
          Casa de las Culturas (Marcelo T. de Alvear 90)
          <br />
          📅 12 de Abril
        </p>

        {/* 📜 Reglas */}
        <div className="bg-zinc-900 border border-zinc-700 rounded p-4 text-left space-y-2">
          <h2 className="font-bold text-lg mb-2">Reglas</h2>

          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>Solo tipos: Hada, Dragón y Acero</li>
            <li>Máximo 1500 PC</li>
            <li>No se pueden cambiar los ataques de dichos Pokémon una vez inscriptos</li>
            <li>Se prohíben megaevoluciones</li>
            <li>Solo 1 Pokémon por especie</li>
            <li>Doble eliminación</li>
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