"use client";

import { useState } from "react";
import PokemonAutocomplete from "@/components/PokemonAutocomplete";
import { Pokemon } from "@/lib/pokemon";

export default function TorneoPage() {
  const [team, setTeam] = useState<Pokemon[]>([]);

  function addPokemon(pokemon: Pokemon) {
    if (team.length >= 6) {
      alert("Máximo 6 Pokémon");
      return;
    }

    // Tipos permitidos (Copa Fantasía)
    const allowedTypes = ["Fairy", "Dragon", "Steel"];

    const isValid = pokemon.types.some((t: string) =>
      allowedTypes.includes(t)
    );

    if (!isValid) {
      alert("Este Pokémon no está permitido en la Copa Fantasía");
      return;
    }

    // Evitar duplicados
    if (team.find((p: Pokemon) => p.name === pokemon.name)) {
      alert("No podés repetir Pokémon");
      return;
    }

    setTeam((prev: Pokemon[]) => [...prev, pokemon]);
  }

  function removePokemon(index: number) {
    setTeam((prev: Pokemon[]) =>
      prev.filter((_, i) => i !== index)
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Copa Fantasía</h1>
      <p>Seleccioná tus 6 Pokémon (tipo Hada, Dragón o Acero)</p>

      <div style={{ maxWidth: "400px" }}>
        <PokemonAutocomplete onSelect={addPokemon} />
      </div>

      <h3 style={{ marginTop: "2rem" }}>Tu equipo</h3>

      {team.length === 0 && <p>No agregaste Pokémon todavía</p>}

      <div style={{ marginTop: "1rem" }}>
        {team.map((p: Pokemon, i: number) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "6px"
            }}
          >
            <img src={p.sprite} alt={p.name} width={40} />

            <div>
              <strong>{p.name}</strong>
              <div style={{ fontSize: "12px" }}>
                {p.types.join(", ")}
              </div>
            </div>

            <button
              style={{ marginLeft: "auto" }}
              onClick={() => removePokemon(i)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}