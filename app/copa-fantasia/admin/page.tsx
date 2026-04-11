"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Player = {
  id: string;
  trainerName: string;
  trainerCode: string;
  team: any[];
};

export default function Page() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  // 🔥 fetch
  const fetchPlayers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "torneos", "copa-fantasia", "inscripciones")
      );

      const data: Player[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Player, "id">)
      }));

      setPlayers(data);
    } catch (error) {
      console.error("🔥 ERROR FIREBASE:", error);
      alert("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // 🔐 LOGIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="space-y-3 text-center">
          <input
            type="password"
            placeholder="Admin password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-zinc-800 text-white"
          />

          <button
            onClick={() => {
              if (password === "impidimp") setIsAdmin(true);
            }}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando inscripciones...
      </div>
    );
  }

  // 📋 export challonge
  const exportNames = () => {
    const names = players.map((p) => p.trainerName);
    const text = names.join(", ");

    navigator.clipboard.writeText(text);
    alert("Lista copiada para Challonge 🚀");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <img
            src="https://i.ibb.co/DPSWzghL/fantasy-cup-icon.png"
            className="w-20 mx-auto"
          />

          <h1 className="text-3xl font-bold">
            Panel Admin
          </h1>

          <p className="text-zinc-400">
            {players.length} inscriptos
          </p>
        </div>

        {/* EXPORT */}
        <button
          onClick={exportNames}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-bold"
        >
          Exportar a Challonge
        </button>

        {/* LISTA */}
        <div className="grid gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-zinc-900 border border-zinc-700 rounded p-4"
            >
              <div className="mb-3">
                <div className="font-bold text-lg">
                  {player.trainerName}
                </div>

                <div className="text-zinc-400 text-sm">
                  {player.trainerCode}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {player.team?.map((p, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 p-2 rounded text-xs"
                  >
                    <div className="font-semibold">
                      {p.name}
                    </div>

                    <div className="text-yellow-400">
                      PC {p.cp}
                    </div>

                    <div>⚡ {p.fastMove}</div>
                    <div>🔋 {p.chargedMove1}</div>

                    {p.chargedMove2 && (
                      <div>🔋 {p.chargedMove2}</div>
                    )}

                    {p.isShadow && (
                      <div className="text-purple-400">
                        Oscuro
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}