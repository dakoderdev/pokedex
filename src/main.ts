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
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );

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

async function renderPokemon(pokemon: Pokemon) {
  const translatedTypes = pokemon.types.map((t) => {
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
      fairy: "Hada",
    };

    return map[t.type.name] || t.type.name;
  });

  const speciesData = await fetchSpecies(pokemon.species.url);

  const genus =
    speciesData?.genera.find((g) => g.language.name === "es")?.genus ||
    speciesData?.genera.find((g) => g.language.name === "en")?.genus ||
    "Desconocido";

  const image =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  const types = translatedTypes.join(", ");

  const abilities = pokemon.abilities
    .map((a) => a.ability.name.replaceAll("-", " "))
    .join(", ");

  const height = `${pokemon.height / 10} m`;

  const weight =
    pokemon.weight >= 10
      ? `${pokemon.weight / 10} kg`
      : `${pokemon.weight * 100} g`;

  container.innerHTML = `
    <img 
      src="/imagenes/ojos.png" 
      alt="Ojos de Rotom"
      class="w-35 h-16 object-cover mb-2"
    />

    <div class="relative flex flex-col sm:flex-row gap-4 p-4 w-full rounded-xl text-center bg-linear-to-t from-[#508cc5] to-[#7EBBE7] inset-shadow-xs inset-shadow-[#3E6B95]/40">

      <img 
        src="${image}" 
        alt="${pokemon.name}"
        class="mx-auto h-50 w-50 object-contain p-2"
      />

      <span class="absolute top-4 left-4 text-2xl font-semibold text-neutral-950 sm:top-auto sm:bottom-4">
        #${pokemon.id}
      </span>

      <div class="flex flex-col items-start w-full text-neutral-950">

        <h2 class="text-4xl font-semibold capitalize pb-0.5">
          ${pokemon.name}
        </h2>

        <span class="text-sm capitalize bg-white/90 rounded-full py-0.5 px-4 mb-4">
          ${types}
        </span>

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
            <p class="text-sm">${abilities}</p>
          </div>

          <div class="rounded-lg bg-white/90 p-2 text-center">
            <p class="font-bold text-sm">Especie</p>
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

  container.innerHTML = `
    <p class="text-neutral-600 text-center py-4">
      Cargando...
    </p>
  `;

  const pokemon = await fetchPokemon(value);

  if (!pokemon) {
    container.innerHTML = `
      <p class="text-red-600 text-center py-4">
        No encontrado
      </p>
    `;
    return;
  }

  await renderPokemon(pokemon);
}

button.addEventListener("click", searchPokemon);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchPokemon();
});