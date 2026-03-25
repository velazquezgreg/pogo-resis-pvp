"use client";

import { useState } from "react";
import PokemonAutocomplete from "@/components/PokemonAutocomplete";
import pokemonData from "@/src/data/pokemon-es.json";

type Pokemon = {
  name: string;
  types: string[];
  fastMoves: string[];
  chargedMoves: string[];
};

type TeamPokemon = {
  name: string;
  types: string[];
  fastMove: string;
  chargedMove1: string;
  chargedMove2: string;
};

export default function Page() {
  const [team, setTeam] = useState<TeamPokemon[]>([]);

  const addPokemon = (p: Pokemon) => {
    if (team.length >= 6) return;

    // evitar duplicados
    if (team.some(tp => tp.name === p.name)) return;

    setTeam([
      ...team,
      {
        name: p.name,
        types: p.types,
        fastMove: "",
        chargedMove1: "",
        chargedMove2: ""
      }
    ]);
  };

  const updateMove = (
    index: number,
    field: "fastMove" | "chargedMove1" | "chargedMove2",
    value: string
  ) => {
    const newTeam = [...team];
    newTeam[index][field] = value;
    setTeam(newTeam);
  };

  const removePokemon = (index: number) => {
    const newTeam = [...team];
    newTeam.splice(index, 1);
    setTeam(newTeam);
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-4">Registro Copa Fantasía</h1>

      <PokemonAutocomplete
        data={pokemonData}
        onSelect={addPokemon}
      />

      <div className="mt-6 space-y-4">
        {team.map((p, i) => (
          <div key={i} className="border p-4 rounded bg-zinc-900">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg">{p.name}</h2>
                <p className="text-sm text-gray-400">
                  {p.types.join(" / ")}
                </p>
              </div>
              <button onClick={() => removePokemon(i)}>❌</button>
            </div>

            {/* FAST MOVE */}
            <select
              value={p.fastMove}
              onChange={e =>
                updateMove(i, "fastMove", e.target.value)
              }
              className="mt-2 w-full bg-zinc-800 p-2 rounded"
            >
              <option value="">Ataque rápido</option>
              {pokemonData
                .find(pk => pk.name === p.name)
                ?.fastMoves.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>

            {/* CHARGED 1 */}
            <select
              value={p.chargedMove1}
              onChange={e =>
                updateMove(i, "chargedMove1", e.target.value)
              }
              className="mt-2 w-full bg-zinc-800 p-2 rounded"
            >
              <option value="">Ataque cargado 1</option>
              {pokemonData
                .find(pk => pk.name === p.name)
                ?.chargedMoves.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>

            {/* CHARGED 2 */}
            <select
              value={p.chargedMove2}
              onChange={e =>
                updateMove(i, "chargedMove2", e.target.value)
              }
              className="mt-2 w-full bg-zinc-800 p-2 rounded"
            >
              <option value="">Ataque cargado 2</option>
              {pokemonData
                .find(pk => pk.name === p.name)
                ?.chargedMoves.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}