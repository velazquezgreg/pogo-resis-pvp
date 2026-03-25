"use client";

import { useState } from "react";

type Pokemon = {
  name: string;
  types: string[];
  fastMoves: string[];
  chargedMoves: string[];
};

type Props = {
  onSelect: (pokemon: Pokemon) => void;
  data: Pokemon[];
};

export default function PokemonAutocomplete({ onSelect, data }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Pokemon[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = data.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered.slice(0, 10));
  };

  return (
    <div className="relative">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Buscar Pokémon..."
        className="w-full p-2 border rounded bg-zinc-900 text-white"
      />

      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-zinc-800 border mt-1 rounded max-h-60 overflow-y-auto">
          {results.map(p => (
            <li
              key={p.name}
              onClick={() => {
                onSelect(p);
                setQuery(p.name);
                setResults([]);
              }}
              className="p-2 hover:bg-zinc-700 cursor-pointer"
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-400">
                {p.types.join(" / ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}