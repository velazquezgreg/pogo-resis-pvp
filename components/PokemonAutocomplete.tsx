import { useState } from "react";
import { Pokemon } from "./types";
import Image from "next/image";

interface Props {
  pokemonList: Pokemon[];
  onSelect: (pokemon: Pokemon) => void;
}

export default function PokemonAutocomplete({ pokemonList, onSelect }: Props) {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState<Pokemon[]>([]);
  const [show, setShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!value) {
      setFiltered([]);
      return;
    }

    const result = pokemonList
      .filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      )
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(value.toLowerCase());
        const bStarts = b.name.toLowerCase().startsWith(value.toLowerCase());
        return Number(bStarts) - Number(aStarts);
      });

    setFiltered(result);
    setShow(true);
  };

  const handleSelect = (pokemon: Pokemon) => {
    setInput(pokemon.name);
    setShow(false);
    onSelect(pokemon);
  };

  return (
    <div className="relative">
      <input
        value={input}
        onChange={handleChange}
        onFocus={() => setShow(true)}
        className="w-full p-2 bg-zinc-900 text-white border border-zinc-700 rounded"
        placeholder="Buscar Pokémon..."
      />

      {show && filtered.length > 0 && (
        <div className="absolute z-10 w-full bg-zinc-800 border border-zinc-700 rounded mt-1 max-h-60 overflow-y-auto">
          {filtered.map((p, i) => (
            <div
              key={i}
              onClick={() => handleSelect(p)}
              className="p-2 hover:bg-zinc-700 cursor-pointer"
            >
              <div className="flex items-center gap-3">
  <Image
    src={p.sprite}
    alt={p.name}
    width={40}
    height={40}
  />

  <div>
    <div className="font-semibold">{p.name}</div>
    <div className="text-sm text-zinc-400">
      {p.types.join(" / ")}
    </div>
  </div>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}