export interface Pokemon {
  name: string;
  baseName: string;
  types: string[];
  fastMoves: string[];
  chargedMoves: string[];
  sprite: string; 
}

export interface TeamPokemon {
  name: string;
  baseName: string;
  types: string[];
  fastMove: string;
  chargedMove1: string;
  chargedMove2: string;
  isShadow: boolean;
}