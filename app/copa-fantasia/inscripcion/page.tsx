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
      isShadow: false,
      cp: ""
    }))
  );

  const [errors, setErrors] = useState<string[]>([]);

  const isValidType = (pokemon: Pokemon) =>
    pokemon.types.some(t => allowedTypes.includes(t));

  const isDuplicateSpecies = (pokemon: Pokemon, index: number) =>
    team.some((p, i) => i !== index && p.baseName === pokemon.baseName);

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
      chargedMove2: "",
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

  const handleSubmit = async () => {
    const newErrors: string[] = [];

    if (!trainerName.trim()) newErrors.push("❌ Ingresá nombre");
    if (trainerCode.length !== 12)
      newErrors.push("❌ Código inválido (12 números)");

    team.forEach((p, i) => {
      if (!p.name) newErrors.push(`❌ Pokémon ${i + 1} faltante`);
      if (!p.fastMove) newErrors.push(`❌ Pokémon ${i + 1} sin rápido`);
      if (!p.chargedMove1) newErrors.push(`❌ Pokémon ${i + 1} sin cargado`);

      if (p.cp === "" || p.cp <= 0 || p.cp > 1500) {
        newErrors.push(`❌ Pokémon ${i + 1} debe tener PC entre 1 y 1500`);
      }
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

      setSavedPlayer({ trainerName, trainerCode, team });

      alert("¡Inscripción exitosa!");

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
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">

      {savedPlayer ? (
        /* 🎉 SUCCESS SCREEN */
        <div className="w-full max-w-3xl space-y-6 text-center">

          <div className="space-y-3">
            <div className="text-6xl">🎉</div>

            <h1 className="text-3xl font-bold">
              ¡Inscripción confirmada!
            </h1>

            <p className="text-zinc-400">
              Nos vemos el <span className="text-white font-semibold">12 de Abril</span>
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-1">
              {savedPlayer.trainerName}
            </h2>

            <p className="text-zinc-400 text-sm mb-4">
              {savedPlayer.trainerCode}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {savedPlayer.team.map((p: any, i: number) => {
                const poke = getPokemonData(p.name);

                return (
                  <div
                    key={i}
                    className="bg-zinc-800 rounded-xl p-3 text-center border border-zinc-700"
                  >
                    {poke?.sprite && (
                      <img
                        src={poke.sprite}
                        className="w-16 h-16 mx-auto mb-2"
                      />
                    )}

                    <div className="font-semibold text-sm">
                      {p.name}
                    </div>

                    <div className="text-xs text-yellow-400">
                      PC {p.cp}
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

          <button
            onClick={() => setSavedPlayer(null)}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-lg"
          >
            Registrar otro equipo
          </button>
        </div>
      ) : (
        /* 🧾 FORM */
        <div className="w-full max-w-3xl space-y-6">

          <div className="text-center space-y-3">
            <img
              src="https://i.ibb.co/DPSWzghL/fantasy-cup-icon.png"
              className="w-20 mx-auto"
            />
            <h1 className="text-3xl font-bold">
              Inscripción Copa Fantasía
            </h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 space-y-6">

            <div className="space-y-3">
              <input
                placeholder="Nombre de entrenador"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-lg"
              />

              <input
                placeholder="Código (12 dígitos)"
                value={trainerCode}
                onChange={(e) =>
                  setTrainerCode(e.target.value.replace(/\D/g, ""))
                }
                maxLength={12}
                className="w-full p-3 bg-zinc-800 rounded-lg"
              />
            </div>

            {errors.length > 0 && (
              <div className="p-3 bg-red-900 rounded">
                {errors.map((e, i) => <div key={i}>{e}</div>)}
              </div>
            )}

            {/* equipo */}
            <div className="space-y-5">
              {team.map((p, index) => {
                const selectedPokemon = pokemonData.find(
                  pk => pk.name === p.name
                );

                return (
                  <div key={index} className="bg-zinc-800 p-4 rounded-xl space-y-3">
                    <h2 className="text-sm text-zinc-400">
                      Pokémon {index + 1}
                    </h2>

                    <PokemonAutocomplete
                      pokemonList={pokemonData}
                      onSelect={(pokemon) =>
                        updatePokemon(index, pokemon)
                      }
                    />

                    {p.name && (
                      <>
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
                          className="w-full p-2 bg-zinc-700 rounded"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 p-3 rounded-xl font-bold"
            >
              Registrar equipo
            </button>

          </div>
        </div>
      )}
    </div>
  );
}