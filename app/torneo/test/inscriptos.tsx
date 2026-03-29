"use client";

import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function InscriptosPage() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(
        collection(db, "torneos", "copa-fantasia", "inscripciones")
      );

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPlayers(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-6">Inscriptos</h1>

      <div className="space-y-4">
        {players.map((p) => (
          <div
            key={p.id}
            className="p-4 border border-zinc-700 rounded"
          >
            <h2 className="font-bold text-lg">
              {p.trainerName}
            </h2>
            <p className="text-sm text-zinc-400">
              {p.trainerCode}
            </p>

            <div className="mt-2 text-sm">
              {p.team.map((poke: any, i: number) => (
                <div key={i}>
                  {poke.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}