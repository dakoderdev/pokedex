type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  species: {
    url: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
};

type PokemonSpecies = {
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
};

const input = document.getElementById("searchInput") as HTMLInputElement;
const button = document.getElementById("searchBtn") as HTMLButtonElement;
const container = document.getElementById("pokemonContainer") as HTMLDivElement;

async function fetchPokemon(name: string): Promise<Pokemon | null> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!res.ok) throw new Error("Not found");
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchSpecies(url: string): Promise<PokemonSpecies | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Species not found");
    return await res.json();
  } catch {
    return null;
  }
}

function getAbilities(abilities: { ability: { name: string } }[]) {
  return abilities.map((a) => a.ability.name.replaceAll("-", " "));
}

function getSpecies(speciesData: PokemonSpecies | null) {
  return speciesData?.genera.find((g) => g.language.name === "es")?.genus.replace("Pokémon", "") || "Desconocido";
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
  };
  return colors[type] || "#777777";
}

function renderAbilities(abilities: string[]) {
  let spans = "";
  abilities.map((a) => {
    spans += `<span class="text-xs capitalize bg-neutral-900/10 rounded-md py-0.5 px-1">${a}</span>`;
  });
  return `<div class="flex justify-center flex-wrap gap-1">${spans}</div>`;
}

function renderTypes(types: { name: string; label: string }[]) {
  let spans = "";
  types.map((t) => {
    spans += `<span class="text-sm capitalize text-white rounded-full py-0.5 px-4 font-medium inset-ring inset-ring-white/30" style="background:${getTypeColor(t.name)}">${t.label}</span>`;
  });
  return `<div class="flex flex-wrap gap-1 mb-4">${spans}</div>`;
}

async function renderPokemon(pokemon: Pokemon) {
  const map: Record<string, string> = {
    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"
  };

  const translatedTypes = pokemon.types.map((t) => ({
    name: t.type.name,
    label: map[t.type.name] || t.type.name
  }));

  const speciesData = await fetchSpecies(pokemon.species.url);
  const genus = getSpecies(speciesData);
  const image = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
  const abilities = getAbilities(pokemon.abilities);
  const renderedAbilities = renderAbilities(abilities);
  const renderedTypes = renderTypes(translatedTypes);
  const height = `${pokemon.height / 10} m`;
  const weight = pokemon.weight >= 10 ? `${pokemon.weight / 10} kg` : `${pokemon.weight * 100} g`;

  container.innerHTML = `
    <div class="relative flex flex-col mt-4 sm:flex-row items-center gap-4 p-4 w-full rounded-xl text-center bg-linear-to-t from-[#508cc5] to-[#7EBBE7] inset-shadow-xs inset-shadow-[#3E6B95]/40">
      <img loading="eager" src="${image}" alt="${pokemon.name}" class="mx-auto h-50 w-50 object-contain p-2"/>
      <span class="absolute top-4 left-4 text-2xl font-semibold text-neutral-950 sm:top-auto sm:bottom-4">#${pokemon.id}</span>
      <div class="flex flex-col items-start w-full text-neutral-950">
        <h2 class="text-4xl font-semibold capitalize pb-0.5">${pokemon.name}</h2>
        ${renderedTypes}
        <div class="grid grid-cols-2 gap-2 w-full">
          <div class="rounded-lg bg-white/90 p-2 text-center">
            <p class="font-bold text-sm">Altura</p>
            <p class="text-sm">${height}</p>
          </div>
          <div class="rounded-lg bg-white/90 p-2 text-center">
            <p class="font-bold text-sm">Peso</p>
            <p class="text-sm">${weight}</p>
          </div>
          <div class="rounded-lg bg-white/90 p-2 text-center capitalize text-balance">
            <p class="font-bold text-sm">Habilidad</p>
            <p class="text-xs leading-relaxed">${renderedAbilities}</p>
          </div>
          <div class="rounded-lg bg-white/90 p-2 text-center">
            <p class="font-bold text-sm">Categoría</p>
            <p class="text-sm">${genus}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function searchPokemon() {
  const value = input.value.trim();
  if (!value) return;

  container.innerHTML = `<p class="text-red-900 text-center py-4">Cargando...</p>`;

  const pokemon = await fetchPokemon(value);

  if (!pokemon) {
    container.innerHTML = `<p class="text-red-900 text-center py-4">No encontrado</p>`;
    return;
  }

  await renderPokemon(pokemon);
}

button.addEventListener("click", searchPokemon);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchPokemon();
});