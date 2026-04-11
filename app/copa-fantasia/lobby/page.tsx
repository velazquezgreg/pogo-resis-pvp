
 /* const unlockDate = new Date("2026-04-12T00:00:00-03:00"); // Argentina

const now = new Date();

if (now < unlockDate) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold mb-4">
          ¡Volvé más adelante!
        </h1>

        <p className="text-zinc-400">
          Los equipos serán revelados el día del torneo.
        </p>

        <p className="mt-2 text-zinc-500">
          Disponible el 12 de abril
        </p>
      </div>
    </div>
  );
}
*/

"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import pokemonData from "@/src/data/pokemon-es.json";

export default function CopaFantasiaPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // ✅ hook arriba

  const getPokemonData = (name: string) =>
    pokemonData.find(p => p.name === name);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "torneos", "copa-fantasia", "inscripciones"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPlayers(data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔎 filtro seguro
  const filteredPlayers = players.filter(p =>
    p.trainerName?.toLowerCase().includes(search.toLowerCase())
  );

  // ⛔ loading
  if (loading) {
    return (
      <div className="p-6 text-white bg-black min-h-screen">
        Cargando inscripciones...
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        🏆 Copa Fantasía - Participantes
      </h1>

      {players.length === 0 && (
        <div>No hay inscripciones todavía</div>
      )}

      {/* 🔍 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar entrenador..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-2 mb-2 bg-zinc-900 rounded border border-zinc-700"
      />

      <p className="text-zinc-400 mb-6 text-sm">
        {filteredPlayers.length} resultado(s)
      </p>

      {/* 🧩 GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player, idx) => (
          <div
            key={idx}
            className="bg-zinc-900 p-5 rounded border border-zinc-700"
          >
            {/* Trainer */}
            <h2 className="text-lg font-bold">
              {player.trainerName}
            </h2>

            <div className="text-sm text-zinc-400 mb-4">
              {player.trainerCode}
            </div>

            {/* Team */}
            <div className="grid grid-cols-3 gap-3">
              {player.team.map((p: any, i: number) => {
                const poke = getPokemonData(p.name);

                return (
                  <div
                    key={i}
                    className="bg-zinc-800 p-2 rounded text-center"
                  >
                    {poke?.sprite && (
                      <img
                        src={poke.sprite}
                        alt={p.name}
                        className="w-14 h-14 mx-auto mb-1"
                      />
                    )}

                    <div className="text-xs font-semibold">
                      {p.name}
                    </div>

                    <div className="text-[10px] text-yellow-400">
                      PC {p.cp}
                    </div>

                    <div className="text-[10px]">
                      ⚡ {p.fastMove}
                    </div>

                    <div className="text-[10px]">
                      🔋 {p.chargedMove1}
                    </div>

                    {p.chargedMove2 && (
                      <div className="text-[10px]">
                        🔋 {p.chargedMove2}
                      </div>
                    )}

                    {p.isShadow && (
                      <div className="text-[10px] text-purple-400">
                        Oscuro
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}