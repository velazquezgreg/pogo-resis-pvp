const axios = require("axios");
const cheerio = require("cheerio");

async function scrapePokemon() {
  const url = "https://pokemondb.net/go/pokedex";
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const pokemon = [];

  $("table tbody tr").each((i, el) => {
    const name = $(el).find("a.ent-name").text();
const form = $(el).find("small").text();

if (form.toLowerCase().includes("mega")) return;

    if (!name) return;

    // ❌ ignorar megas
    if (name.toLowerCase().includes("mega")) return;

    // Tipos
    const types = [];
    $(el).find(".type-icon").each((i, t) => {
      types.push($(t).text());
    });

   const fastMovesText = $(el).find("td").eq(7).text();
const chargedMovesText = $(el).find("td").eq(8).text();

const cleanMoves = (text) =>
  text
    .split("\n")
    .map(m => m.trim())
    .filter(m =>
      m &&
      !m.includes("Frustration") &&
      !m.includes("Return")
    );

const fastMoves = cleanMoves(fastMovesText);
const chargedMoves = cleanMoves(chargedMovesText);

    pokemon.push({
      name,
      types,
      fastMoves,
      chargedMoves
    });
  });
  console.log(JSON.stringify(pokemon, null, 2));
}

scrapePokemon();