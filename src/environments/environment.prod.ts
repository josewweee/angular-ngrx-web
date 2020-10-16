export const environment = {
  production: true,
  initialFavoritePokemonImages: [
    `https://raw.githubusercontent.com/PokeAPI/sprites/
    146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/1.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/
    146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/4.png`,
    `https://raw.githubusercontent.com/PokeAPI/sprites/
    146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/7.png`,
  ],
  initialFavoritePokemonsBaseUrl: [
    'https://pokeapi.co/api/v2/pokemon/1/',
    'https://pokeapi.co/api/v2/pokemon/4/',
    'https://pokeapi.co/api/v2/pokemon/7/',
  ],
  pokemonsBaseUrl: 'https://pokeapi.co/api/v2/pokemon/',
  pokemonApiPageBaseUrl: (limit, offset): string =>
    `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`,
  pokemonImage: (pokemonId): string =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
};
