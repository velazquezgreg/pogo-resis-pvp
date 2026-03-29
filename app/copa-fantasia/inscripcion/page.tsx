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
  const [savedPlayer, setSavedPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [team, setTeam] = useState<TeamPokemon[]>(
    Array(6).fill(null).map(() => ({
      name: "",
      baseName: "",
      types: [],
      fastMove: "",
      chargedMove1: "",
      chargedMove2: "",
      isShadow: false,
      cp: ""
    }))
  );

  const [errors, setErrors] = useState<string[]>([]);

  // ✅ validaciones
  const isValidType = (pokemon: Pokemon) =>
    pokemon.types.some(t => allowedTypes.includes(t));

  const isDuplicateSpecies = (pokemon: Pokemon, index: number) =>
    team.some((p, i) => i !== index && p.baseName === pokemon.baseName);

  // 🔄 moves
  const updateMove = (
    index: number,
    field: "fastMove" | "chargedMove1" | "chargedMove2",
    value: string
  ) => {
    const newTeam = [...team];

    if (field === "chargedMove2" && value === newTeam[index].chargedMove1) return;
    if (field === "chargedMove1" && value === newTeam[index].chargedMove2) return;

    newTeam[index][field] = value;
    setTeam(newTeam);
  };

  // 🧩 seleccionar pokemon
  const updatePokemon = (index: number, pokemon: Pokemon) => {
    if (!isValidType(pokemon)) {
      setErrors([`❌ ${pokemon.name} no es válido`]);
      return;
    }

    if (isDuplicateSpecies(pokemon, index)) {
      setErrors([`❌ No podés usar dos ${pokemon.baseName}`]);
      return;
    }

    const newTeam = [...team];

    newTeam[index] = {
      name: pokemon.name,
      baseName: pokemon.baseName,
      types: pokemon.types,
      fastMove: "",
      chargedMove1: "",
      chargedMove2: "",
      isShadow: false,
      cp: ""
    };

    setErrors([]);
    setTeam(newTeam);
  };

  const toggleShadow = (index: number, value: boolean) => {
    const newTeam = [...team];
    newTeam[index].isShadow = value;
    setTeam(newTeam);
  };

  // 🚀 submit
  const handleSubmit = async () => {
    const newErrors: string[] = [];

    if (!trainerName.trim()) newErrors.push("❌ Ingresá nombre");
    if (trainerCode.length !== 12)
      newErrors.push("❌ Código inválido (12 números)");

    team.forEach((p, i) => {
      if (!p.name) newErrors.push(`❌ Pokémon ${i + 1} faltante`);
      if (!p.fastMove) newErrors.push(`❌ Pokémon ${i + 1} sin rápido`);
      if (!p.chargedMove1)
        newErrors.push(`❌ Pokémon ${i + 1} sin cargado`);

      if (p.cp === "" || p.cp <= 0 || p.cp > 1500) {
        newErrors.push(
          `❌ Pokémon ${i + 1} debe tener PC entre 1 y 1500`
        );
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "torneos", "copa-fantasia", "inscripciones"),
        {
          trainerName,
          trainerCode,
          team,
          createdAt: new Date()
        }
      );

      setSavedPlayer({ trainerName, trainerCode, team });

      setTrainerName("");
      setTrainerCode("");
      setErrors([]);

    } catch (error) {
      console.error(error);
      setErrors(["Error al guardar"]);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonData = (name: string) =>
    pokemonData.find(p => p.name === name);

  // 🟣 SUCCESS SCREEN
  if (savedPlayer) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

        <div className="max-w-xl w-full text-center space-y-6">

          <h1 className="text-3xl font-bold text-green-400">
            ✅ Inscripción exitosa
          </h1>

          <p className="text-zinc-400">
            Nos vemos el 12 de Abril 🔥
          </p>

          <div className="bg-zinc-900 p-4 rounded border border-zinc-700">
            <h2 className="font-bold text-lg">
              {savedPlayer.trainerName}
            </h2>

            <div className="text-zinc-400 text-sm mb-4">
              {savedPlayer.trainerCode}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {savedPlayer.team.map((p: any, i: number) => {
                const poke = getPokemonData(p.name);

                return (
                  <div key={i} className="bg-zinc-800 p-2 rounded text-xs">

                    {poke?.sprite && (
                      <img
                        src={poke.sprite}
                        className="w-12 h-12 mx-auto"
                      />
                    )}

                    <div className="font-semibold mt-1">
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
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setSavedPlayer(null)}
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            Nueva inscripción
          </button>

        </div>
      </div>
    );
  }

  // 🧩 FORM
  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-3xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          🏆 Copa Fantasía
        </h1>

        {/* DATOS */}
        <div className="space-y-3">
          <input
            placeholder="Nombre de entrenador"
            value={trainerName}
            onChange={(e) => setTrainerName(e.target.value)}
            className="w-full p-2 bg-zinc-900 rounded"
          />

          <input
            placeholder="Código (12 dígitos)"
            value={trainerCode}
            onChange={(e) =>
              setTrainerCode(e.target.value.replace(/\D/g, ""))
            }
            maxLength={12}
            className="w-full p-2 bg-zinc-900 rounded"
          />
        </div>

        {/* ERRORES */}
        {errors.length > 0 && (
          <div className="bg-red-900 p-3 rounded">
            {errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        )}

        {/* TEAM */}
        <div className="space-y-4">
          {team.map((p, index) => {
            const selectedPokemon = pokemonData.find(
              pk => pk.name === p.name
            );

            return (
              <div key={index} className="bg-zinc-900 p-4 rounded">

                <h2 className="font-bold mb-2">
                  Pokémon {index + 1}
                </h2>

                <PokemonAutocomplete
                  pokemonList={pokemonData}
                  onSelect={(pokemon) =>
                    updatePokemon(index, pokemon)
                  }
                />

                {/* 🔥 USAMOS baseName → evita bug */}
                {p.baseName && selectedPokemon && (
                  <div className="mt-3 space-y-2">

                    <div className="text-sm text-zinc-400">
                      {p.types.join(" / ")}
                    </div>

                    {/* CP */}
                    <input
                      placeholder="PC (≤1500)"
                      value={p.cp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const num = Number(value);
                        if (num > 1500) return;

                        const newTeam = [...team];
                        newTeam[index].cp = value === "" ? "" : num;
                        setTeam(newTeam);
                      }}
                      className="w-full p-2 bg-zinc-800 rounded"
                    />

                    {/* MOVES */}
                    <select
                      value={p.fastMove}
                      onChange={(e) =>
                        updateMove(index, "fastMove", e.target.value)
                      }
                      className="w-full p-2 bg-zinc-800 rounded"
                    >
                      <option value="">Ataque rápido</option>
                      {selectedPokemon.fastMoves.map((m, i) => (
                        <option key={i}>{m}</option>
                      ))}
                    </select>

                    <select
                      value={p.chargedMove1}
                      onChange={(e) =>
                        updateMove(index, "chargedMove1", e.target.value)
                      }
                      className="w-full p-2 bg-zinc-800 rounded"
                    >
                      <option value="">Ataque cargado</option>
                      {selectedPokemon.chargedMoves.map((m, i) => (
                        <option key={i}>{m}</option>
                      ))}
                    </select>

                    <select
                      value={p.chargedMove2}
                      onChange={(e) =>
                        updateMove(index, "chargedMove2", e.target.value)
                      }
                      className="w-full p-2 bg-zinc-800 rounded"
                    >
                      <option value="">Segundo cargado</option>
                      {selectedPokemon.chargedMoves
                        .filter(m => m !== p.chargedMove1)
                        .map((m, i) => (
                          <option key={i}>{m}</option>
                        ))}
                    </select>

                    <label className="text-sm">
                      <input
                        type="checkbox"
                        checked={p.isShadow}
                        onChange={(e) =>
                          toggleShadow(index, e.target.checked)
                        }
                      />{" "}
                      Oscuro
                    </label>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTÓN */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Registrar equipo"}
        </button>

      </div>
    </div>
  );
}