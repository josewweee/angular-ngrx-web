// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  initialFavoritePokemonImages: [
    'https://raw.githubusercontent.com/PokeAPI/sprites/' +
      '146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/1.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/' +
      '146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/4.png',
    'https://raw.githubusercontent.com/PokeAPI/sprites/' +
      '146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/7.png',
  ],
  initialFavoritePokemonsBaseUrl: [
    'https://pokeapi.co/api/v2/pokemon/1/',
    'https://pokeapi.co/api/v2/pokemon/4/',
    'https://pokeapi.co/api/v2/pokemon/7/',
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
