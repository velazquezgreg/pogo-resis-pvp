"use client";

import { useState } from "react";
import { pokemonList, Pokemon } from "@/lib/pokemon";

type Props = {
  onSelect: (pokemon: Pokemon) => void;
};

export default function PokemonAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Pokemon[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    const filtered = pokemonList.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Buscar Pokémon"
        style={{ width: "100%", padding: "8px" }}
      />

      {results.length > 0 && (
        <div
  style={{
    position: "absolute",
    background: "#1f2937", // gris oscuro
    border: "1px solid #374151",
    width: "100%",
    zIndex: 10,
    borderRadius: "6px",
    marginTop: "4px"
  }}
>
          {results.map((p, i) => (
            <div
              key={i}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => {
                onSelect(p);
                setQuery(p.name);
                setResults([]);
              }}
            >
              {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}