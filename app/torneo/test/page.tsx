"use client";

import { useState } from "react";
import PokemonAutocomplete from "@/components/PokemonAutocomplete";

export default function TorneoPage() {
  const [team, setTeam] = useState([]);

  function addPokemon(pokemon) {
    if (team.length >= 6) return alert("Máximo 6 Pokémon");

    // Validación: tipo permitido
    const allowedTypes = ["Fairy", "Dragon", "Steel"];

    const isValid = pokemon.types.some(t => allowedTypes.includes(t));

    if (!isValid) {
      return alert("Este Pokémon no está permitido en la Copa Fantasía");
    }

    // Validación duplicados
    if (team.find(p => p.name === pokemon.name)) {
      return alert("No podés repetir Pokémon");
    }

    setTeam([...team, pokemon]);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Copa Fantasía</h1>

      <h3>Elegí tus 6 Pokémon</h3>

      <PokemonAutocomplete onSelect={addPokemon} />

      <div style={{ marginTop: "1rem" }}>
        {team.map((p, i) => (
          <div key={i}>
            {p.name} ({p.types.join(", ")})
          </div>
        ))}
      </div>
    </main>
  );
}