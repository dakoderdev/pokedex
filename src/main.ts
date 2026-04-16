type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
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

function renderPokemon(pokemon: Pokemon) {
  container.innerHTML = `
    <div class="relative flex flex-col sm:flex-row bg-neutral-800 gap-2 rounded-xl p-4 w-full text-center max-w-xl">
      <img 
        src="${pokemon.sprites.front_default}" 
        alt="${pokemon.name}"
        class="mx-auto h-60 w-60 max-w-70"
      />
      <span class="absolute top-4 bottom-auto sm:top-auto sm:bottom-4 left-4 text-2xl font-light">#${pokemon.id}</span>
      <div class="flex flex-col items-start w-full">
        <h2 class="text-4xl pb-2 font-semibold capitalize">${pokemon.name}</h2>
        <p class="text-sm text-neutral-400 pb-4">
          ${pokemon.types.map(t => t.type.name).join(", ")}
        </p>
        <div class="grid grid-cols-2 items-start w-full gap-2">
          <div class="text-sm text-neutral-400 bg-neutral-100/10 rounded-lg p-2">
            <p class="text-neutral-400 font-bold">Altura:</p>
            <p class="text-sm text-neutral-400">${pokemon.height / 10} m</p>
          </div>
          <div class="text-sm text-neutral-400 bg-neutral-100/10 rounded-lg p-2">
            <p class="text-neutral-400 font-bold">Peso:</p>
            <p class="text-sm text-neutral-400">${pokemon.weight > 10 ? pokemon.weight / 10 + " kg" : pokemon.weight + " g"}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

button.addEventListener("click", async () => {
  const value = input.value.trim();
  if (!value) return;

  container.innerHTML = `<p class="text-neutral-400">Cargando...</p>`;

  const pokemon = await fetchPokemon(value);

  if (!pokemon) {
    container.innerHTML = `<p class="text-red-400">No encontrado</p>`;
    return;
  }

  renderPokemon(pokemon);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});