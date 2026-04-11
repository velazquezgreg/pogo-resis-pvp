"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

type Player = {
  id: string;
  trainerName: string;
  trainerCode: string;
  team: any[];
  createdAt?: any;
};

export default function Page() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  // 🔥 fetch + orden
  const fetchPlayers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "torneos", "copa-fantasia", "inscripciones")
      );

      const data: Player[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Player, "id">)
      }));

      // 🔥 ordenar: nombre → fecha
      data.sort((a, b) => {
        const nameCompare = a.trainerName.localeCompare(b.trainerName);
        if (nameCompare !== 0) return nameCompare;

        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;

        return dateA - dateB;
      });

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

  // 🗑 borrar
  const deletePlayer = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar inscripción?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "torneos", "copa-fantasia", "inscripciones", id)
      );

      // 🔥 actualizar UI sin recargar
      setPlayers(prev => prev.filter(p => p.id !== id));

    } catch (error) {
      console.error(error);
      alert("Error al borrar");
    }
  };

  // 📋 export challonge
  const exportNames = () => {
    const names = players.map(p => p.trainerName);
    const text = names.join(", ");

    navigator.clipboard.writeText(text);
    alert("Lista copiada para Challonge 🚀");
  };

  // 🔐 login
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando inscripciones...
      </div>
    );
  }

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

        {/* BOTONES */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={exportNames}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-bold"
          >
            Exportar a Challonge
          </button>

          <button
            onClick={fetchPlayers}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded font-bold"
          >
            Refrescar
          </button>
        </div>

        {/* LISTA */}
        <div className="grid gap-4">

          {players.map((player) => {

            const date = player.createdAt?.seconds
              ? new Date(player.createdAt.seconds * 1000)
              : null;

            return (
              <div
                key={player.id}
                className="bg-zinc-900 border border-zinc-700 rounded p-4"
              >

                {/* HEADER PLAYER */}
                <div className="flex justify-between items-start mb-3">

                  <div>
                    <div className="font-bold text-lg">
                      {player.trainerName}
                    </div>

                    <div className="text-zinc-400 text-sm">
                      {player.trainerCode}
                    </div>

                    {date && (
                      <div className="text-xs text-zinc-500 mt-1">
                        {date.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Eliminar
                  </button>

                </div>

                {/* TEAM */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                  {player.team.map((p, i) => (
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
            );
          })}

        </div>

      </div>
    </div>
  );
}