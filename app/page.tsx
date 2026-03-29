"use client";

import { useState } from "react";
import PokemonAutocomplete from "@/components/PokemonAutocomplete";
import pokemonData from "@/src/data/pokemon-es.json";
import { Pokemon, TeamPokemon } from "@/components/types";

export default function Page() {
  const [team, setTeam] = useState<TeamPokemon[]>(
    Array(6).fill(null).map(() => ({
      name: "",
      baseName: "",
      types: [],
      fastMove: "",
      chargedMove1: "",
      chargedMove2: "",
      isShadow: false
    }))
  );

  const updateMove = (
    index: number,
    field: "fastMove" | "chargedMove1" | "chargedMove2",
    value: string
  ) => {
    const newTeam = [...team];

    // evitar duplicar charged moves
    if (
      field === "chargedMove2" &&
      value === newTeam[index].chargedMove1
    ) return;

    if (
      field === "chargedMove1" &&
      value === newTeam[index].chargedMove2
    ) return;

    newTeam[index][field] = value;
    setTeam(newTeam);
  };

  const updatePokemon = (index: number, pokemon: Pokemon) => {
    const newTeam = [...team];

    newTeam[index] = {
  ...newTeam[index],
  name: pokemon.name,
  baseName: pokemon.baseName, // 👈 clave
  types: pokemon.types,
  fastMove: "",
  chargedMove1: "",
  chargedMove2: ""
};

    setTeam(newTeam);
  };

  const toggleShadow = (index: number, value: boolean) => {
    const newTeam = [...team];
    newTeam[index].isShadow = value;
    setTeam(newTeam);
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-6">Registro Copa Fantasía</h1>

      <div className="space-y-6">
        {team.map((p, index) => {
          const selectedPokemon = pokemonData.find(
            pk => pk.name === p.name
          );

          return (
            <div key={index} className="p-4 border border-zinc-700 rounded">
              <h2 className="mb-2 font-bold">Pokémon {index + 1}</h2>

              <PokemonAutocomplete
                pokemonList={pokemonData}
                onSelect={(pokemon) => updatePokemon(index, pokemon)}
              />

              {p.name && (
                <div className="mt-3 space-y-2">

                  {/* Fast Move */}
                  <select
                    value={p.fastMove}
                    onChange={(e) =>
                      updateMove(index, "fastMove", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                  >
                    <option value="">Ataque rápido</option>
                    {selectedPokemon?.fastMoves.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* Charged 1 */}
                  <select
                    value={p.chargedMove1}
                    onChange={(e) =>
                      updateMove(index, "chargedMove1", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                  >
                    <option value="">Ataque cargado 1</option>
                    {selectedPokemon?.chargedMoves.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>

                  {/* Charged 2 */}
                  <select
                    value={p.chargedMove2}
                    onChange={(e) =>
                      updateMove(index, "chargedMove2", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                  >
                    <option value="">Ataque cargado 2</option>
                    {selectedPokemon?.chargedMoves
                      .filter(m => m !== p.chargedMove1)
                      .map((m, i) => (
                        <option key={i} value={m}>
                          {m}
                        </option>
                      ))}
                  </select>

                  {/* Shadow */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.isShadow}
                      onChange={(e) =>
                        toggleShadow(index, e.target.checked)
                      }
                    />
                    Oscuro
                  </label>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}