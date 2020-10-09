import { EntityMetadataMap } from '@ngrx/data';
import { PokemonsPage } from '../models/pokemons-page';

export const entityMetadata: EntityMetadataMap = {
  Pokemons: {
    selectId: getPokemonId,
  },
  FetchedPokemons: {},
};

export function getPokemonId(pokemon: PokemonsPage): string {
  const lastSlashInUrl = pokemon.url.lastIndexOf('/');
  const firstSlashInUrl = pokemon.url.indexOf('/', lastSlashInUrl - 4);
  const pokemonId = pokemon.url.slice(firstSlashInUrl + 1, lastSlashInUrl);
  return pokemonId;
}
