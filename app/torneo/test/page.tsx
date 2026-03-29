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

  const isValidType = (pokemon: Pokemon) => {
    return pokemon.types.some(t => allowedTypes.includes(t));
  };

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
    const newErrors: string[] = [];

    if (!trainerName.trim()) {
      newErrors.push("❌ Ingresá nombre");
    }

    if (trainerCode.length !== 12) {
      newErrors.push("❌ Código inválido (12 números)");
    }

    team.forEach((p, i) => {
      if (!p.name) newErrors.push(`❌ Pokémon ${i + 1} faltante`);
      if (!p.fastMove) newErrors.push(`❌ Pokémon ${i + 1} sin rápido`);
      if (!p.chargedMove1) newErrors.push(`❌ Pokémon ${i + 1} sin cargado`);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
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

      // 🔥 guardar para mostrar card
      setSavedPlayer({
        trainerName,
        trainerCode,
        team
      });

      alert("¡Inscripción exitosa! Nos vemos el 12 de Abril.");

      setTrainerName("");
      setTrainerCode("");
      setErrors([]);

    } catch (error) {
      console.error(error);
      setErrors(["Error al guardar"]);
    }
  };
const getPokemonData = (name: string) =>
  pokemonData.find(p => p.name === name);
  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6 font-bold">
        🏆 Copa Fantasía
      </h1>

      {/* 👤 Datos */}
      <div className="mb-6 space-y-3">
        <input
          placeholder="Nombre de entrenador"
          value={trainerName}
          onChange={(e) => setTrainerName(e.target.value)}
          className="w-full p-2 bg-zinc-900 border rounded"
        />

        <input
          placeholder="Código (12 dígitos)"
          value={trainerCode}
          onChange={(e) =>
            setTrainerCode(e.target.value.replace(/\D/g, ""))
          }
          maxLength={12}
          className="w-full p-2 bg-zinc-900 border rounded"
        />
      </div>

      {/* ❌ errores */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-900 rounded">
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
            <div key={index} className="p-4 bg-zinc-900 rounded">
              <h2 className="font-bold mb-2">
                Pokémon {index + 1}
              </h2>

              <PokemonAutocomplete
                pokemonList={pokemonData}
                onSelect={(pokemon) =>
                  updatePokemon(index, pokemon)
                }
              />

              {p.name && (
                <div className="mt-2 space-y-2">

                  <div className="text-sm text-zinc-400">
                    {p.types.join(" / ")}
                  </div>

                  <select
                    value={p.fastMove}
                    onChange={(e) =>
                      updateMove(index, "fastMove", e.target.value)
                    }
                    className="w-full p-2 bg-zinc-800 rounded"
                  >
                    <option value="">Ataque rápido</option>
                    {selectedPokemon?.fastMoves.map((m, i) => (
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
                    {selectedPokemon?.chargedMoves.map((m, i) => (
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
                    {selectedPokemon?.chargedMoves
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
        className="mt-6 w-full bg-green-600 p-3 rounded font-bold"
      >
        Registrar equipo
      </button>

      {/* 👀 PREVIEW */}
{team.some(p => p.name) && (
  <div className="mt-8 p-4 bg-zinc-900 rounded">
    <h2 className="font-bold mb-4">Preview</h2>

    <div className="grid grid-cols-2 gap-3">
      {team.map((p, i) => {
        const poke = getPokemonData(p.name);

        return (
          <div key={i} className="bg-zinc-800 p-2 rounded text-sm flex gap-2 items-center">
            
            {poke?.sprite && (
              <img
                src={poke.sprite}
                alt={p.name}
                className="w-10 h-10"
              />
            )}

            <div>
              <div className="font-semibold">
                {p.name || "—"}
              </div>

              {p.name && (
                <>
                  <div>⚡ {p.fastMove || "-"}</div>
                  <div>🔋 {p.chargedMove1 || "-"}</div>
                  <div>🔋 {p.chargedMove2 || "-"}</div>
                </>
              )}
            </div>

          </div>
        );
      })}
    </div>
  </div>
)}


      {/* 🎴 PLAYER CARD */}
{savedPlayer && (
  <div className="mt-10 p-6 bg-zinc-900 rounded border border-zinc-700">
    <h2 className="text-xl font-bold">
      {savedPlayer.trainerName}
    </h2>

    <div className="text-sm text-zinc-400 mb-4">
      {savedPlayer.trainerCode}
    </div>

    <div className="grid grid-cols-3 gap-4">
      {savedPlayer.team.map((p: any, i: number) => {
        const poke = getPokemonData(p.name);

        return (
          <div
            key={i}
            className="bg-zinc-800 p-3 rounded text-center"
          >
            {poke?.sprite && (
              <img
                src={poke.sprite}
                alt={p.name}
                className="w-16 h-16 mx-auto mb-2"
              />
            )}

            <div className="font-semibold text-sm">
              {p.name}
            </div>

            <div className="text-xs mt-1">
              ⚡ {p.fastMove}
            </div>

            <div className="text-xs">
              🔋 {p.chargedMove1}
            </div>

            {p.chargedMove2 && (
              <div className="text-xs">
                🔋 {p.chargedMove2}
              </div>
            )}

            {p.isShadow && (
              <div className="text-xs text-purple-400 mt-1">
                Oscuro
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
    </div>
  );
}