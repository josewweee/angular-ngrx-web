export interface PokemonsPage {
  name: string;
  url: string;
  photo?: string;
  isFavorite: boolean;
  id?: number;
}

export function getPokemonId(pokemon: PokemonsPage): number {
  const lastSlashInUrl = pokemon.url.lastIndexOf('/');
  const firstSlashInUrl = pokemon.url.indexOf('/', lastSlashInUrl - 4);
  const pokemonId = pokemon.url.slice(firstSlashInUrl + 1, lastSlashInUrl);

  return parseInt(pokemonId);
}
