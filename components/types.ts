export interface Pokemon {
  name: string;
  types: string[];
  fastMoves: string[];
  chargedMoves: string[];
}

export interface TeamPokemon {
  name: string;
  types: string[];
  fastMove: string;
  chargedMove1: string;
  chargedMove2: string;
  isShadow: boolean;
}