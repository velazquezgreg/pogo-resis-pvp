"use client";

import { useState } from "react";
import PokemonAutocomplete from "@/components/PokemonAutocomplete";
import pokemonData from "@/src/data/pokemon-es.json";
import { Pokemon, TeamPokemon } from "@/components/types";
import { db } from "@/src/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const allowedTypes = ["Hada", "Dragón", "Acero"];

export default function Page() {
  const [trainerName, setTrainerName] = useState("");
  const [trainerCode, setTrainerCode] = useState("");

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

  const [errors, setErrors] = useState<string[]>([]);

  // ✅ validar tipo permitido
  const isValidType = (pokemon: Pokemon) => {
    return pokemon.types.some(t => allowedTypes.includes(t));
  };

  // ✅ validar especie duplicada
  const isDuplicateSpecies = (pokemon: Pokemon, index: number) => {
    return team.some(
      (p, i) => i !== index && p.baseName === pokemon.baseName
    );
  };

  const updateMove = (
    index: number,
    field: "fastMove" | "chargedMove1" | "chargedMove2",
    value: string
  ) => {
    const newTeam = [...team];

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
    // ❌ tipo inválido
    if (!isValidType(pokemon)) {
      setErrors([
        `❌ ${pokemon.name} no es válido para Copa Fantasía`
      ]);
      return;
    }

    // ❌ especie duplicada
    if (isDuplicateSpecies(pokemon, index)) {
      setErrors([
        `❌ No podés usar dos ${pokemon.baseName}`
      ]);
      return;
    }

    const newTeam = [...team];

    newTeam[index] = {
      ...newTeam[index],
      name: pokemon.name,
      baseName: pokemon.baseName,
      types: pokemon.types,
      fastMove: "",
      chargedMove1: "",
      chargedMove2: ""
    };

    setErrors([]);
    setTeam(newTeam);
  };

  const toggleShadow = (index: number, value: boolean) => {
    const newTeam = [...team];
    newTeam[index].isShadow = value;
    setTeam(newTeam);
  };

  const handleSubmit = async () => {
    // ❌ datos básicos
    if (!trainerName || !trainerCode) {
      setErrors(["❌ Completá nombre y código"]);
      return;
    }

    // ❌ equipo incompleto
    if (team.some(p => !p.name)) {
      setErrors(["❌ Tenés que completar los 6 Pokémon"]);
      return;
    }

    try {
      await addDoc(
        collection(db, "torneos", "copa-fantasia", "inscripciones"),
        {
          trainerName,
          trainerCode,
          team,
          createdAt: new Date()
        }
      );

      alert("Inscripción guardada ✅");

      // reset opcional
      setTrainerName("");
      setTrainerCode("");
      setTeam(
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
      setErrors([]);

    } catch (error) {
      console.error(error);
      setErrors(["❌ Error al guardar"]);
    }
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6 font-bold">
        🏆 Copa Fantasía
      </h1>

      {/* 👤 Datos del entrenador */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Nombre de entrenador"
          value={trainerName}
          onChange={(e) => setTrainerName(e.target.value)}
          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
        />

        <input
          type="text"
          placeholder="Código de entrenador (ej: 1234 5678 9012)"
          value={trainerCode}
          onChange={(e) => setTrainerCode(e.target.value)}
          className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
        />
      </div>

      {/* ❌ errores */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded">
          {errors.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}

      {/* 🧩 Equipo */}
      <div className="space-y-6">
        {team.map((p, index) => {
          const selectedPokemon = pokemonData.find(
            pk => pk.name === p.name
          );

          return (
            <div
              key={index}
              className="p-4 border border-zinc-700 rounded bg-zinc-900"
            >
              <h2 className="mb-2 font-bold">
                Pokémon {index + 1}
              </h2>

              <PokemonAutocomplete
                pokemonList={pokemonData}
                onSelect={(pokemon) =>
                  updatePokemon(index, pokemon)
                }
              />

              {p.name && (
                <div className="mt-3 space-y-2">

                  <div className="text-sm text-zinc-400">
                    {p.types.join(" / ")}
                  </div>

                  <select
                    value={p.fastMove}
                    onChange={(e) =>
                      updateMove(index, "fastMove", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
                  >
                    <option value="">Ataque rápido</option>
                    {selectedPokemon?.fastMoves.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={p.chargedMove1}
                    onChange={(e) =>
                      updateMove(index, "chargedMove1", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
                  >
                    <option value="">Ataque cargado 1</option>
                    {selectedPokemon?.chargedMoves.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={p.chargedMove2}
                    onChange={(e) =>
                      updateMove(index, "chargedMove2", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded"
                  >
                    <option value="">Ataque cargado 2</option>
                    {selectedPokemon?.chargedMoves
                      .filter(m => m !== p.chargedMove1)
                      .map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                  </select>

                  <label className="flex items-center gap-2 text-sm">
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

      {/* 🔥 BOTÓN */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold"
      >
        Registrar equipo
      </button>
    </div>
  );
}