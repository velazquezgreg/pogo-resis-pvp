"use client";

import { useState } from "react";
import PokemonAutocomplete from "@/components/PokemonAutocomplete";
import pokemonData from "@/src/data/pokemon-es.json";
import { Pokemon, TeamPokemon } from "@/components/types";
import { db } from "@/src/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const allowedTypes = ["Hada", "Dragón", "Acero"];
const bannedPokemon = ["Mimikyu"];

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

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

  // 🔒 LOGIN ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <img
            src="https://i.ibb.co/DPSWzghL/fantasy-cup-icon.png"
            className="w-20 mx-auto"
          />

          <h1 className="text-2xl font-bold">
            Admin - Inscripción manual
          </h1>

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-zinc-800"
          />

          <button
            onClick={() => {
              if (password === "impidimp") setIsAdmin(true);
            }}
            className="bg-green-600 px-4 py-2 rounded font-bold"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  // ✅ validaciones
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

    if (bannedPokemon.includes(pokemon.baseName)) {
      setErrors([`❌ ${pokemon.name} está prohibido`]);
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

  const handleSubmit = async () => {
    const newErrors: string[] = [];

    if (!trainerName.trim()) newErrors.push("❌ Ingresá nombre");
    if (trainerCode.length !== 12)
      newErrors.push("❌ Código inválido");

    team.forEach((p, i) => {
      if (!p.name) newErrors.push(`❌ Pokémon ${i + 1} faltante`);
      if (!p.fastMove) newErrors.push(`❌ Pokémon ${i + 1} sin rápido`);
      if (!p.chargedMove1)
        newErrors.push(`❌ Pokémon ${i + 1} sin cargado`);

      if (p.cp === "" || p.cp <= 0 || p.cp > 1500) {
        newErrors.push(`❌ Pokémon ${i + 1} PC inválido`);
      }

      if (bannedPokemon.includes(p.baseName)) {
        newErrors.push(`❌ ${p.name} está prohibido`);
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

    } catch (error) {
      console.error(error);
      setErrors(["Error al guardar"]);
    } finally {
      setLoading(false);
    }
  };

  const getPokemonData = (name: string) =>
    pokemonData.find(p => p.name === name);

  // 🎉 SUCCESS
  if (savedPlayer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl text-green-400 font-bold">
            Inscripción cargada ✅
          </h1>

          <p>{savedPlayer.trainerName}</p>

          <button
            onClick={() => setSavedPlayer(null)}
            className="bg-zinc-700 px-4 py-2 rounded"
          >
            Cargar otro
          </button>
        </div>
      </div>
    );
  }

  // 🧩 FORM
  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="max-w-3xl mx-auto space-y-6">

        <div className="text-center space-y-3">
          <img
            src="https://i.ibb.co/DPSWzghL/fantasy-cup-icon.png"
            className="w-24 mx-auto"
          />

          <h1 className="text-3xl font-bold">
            Admin - Inscripción
          </h1>
        </div>

        <input
          placeholder="Nombre"
          value={trainerName}
          onChange={(e) => setTrainerName(e.target.value)}
          className="w-full p-2 bg-zinc-900 rounded"
        />

        <input
          placeholder="Código"
          value={trainerCode}
          onChange={(e) =>
            setTrainerCode(e.target.value.replace(/\D/g, ""))
          }
          maxLength={12}
          className="w-full p-2 bg-zinc-900 rounded"
        />

        {errors.length > 0 && (
          <div className="bg-red-900 p-3 rounded">
            {errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        )}

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

                {p.baseName && selectedPokemon && (
                  <div className="mt-3 space-y-2">

                    <input
                      placeholder="PC"
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

                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 p-3 rounded font-bold"
        >
          {loading ? "Guardando..." : "Registrar"}
        </button>

      </div>
    </div>
  );
}