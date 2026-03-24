"use client";

import { useState } from "react";
import { pokemonList } from "@/lib/pokemon";

export default function PokemonAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  function handleChange(e) {
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
        <div style={{
          position: "absolute",
          background: "white",
          border: "1px solid #ccc",
          width: "100%",
          zIndex: 10
        }}>
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