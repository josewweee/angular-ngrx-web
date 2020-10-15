import { environment } from './../../../environments/environment';

export const initialValues = [
  {
    name: 'bulbasaur',
    url: environment.initialFavoritePokemonsBaseUrl[0],
    photo: environment.initialFavoritePokemonImages[0],
    isFavorite: true,
  },
  {
    name: 'charmander',
    url: environment.initialFavoritePokemonsBaseUrl[1],
    photo: environment.initialFavoritePokemonImages[1],
    isFavorite: true,
  },
  {
    name: 'squirtle',
    url: environment.initialFavoritePokemonsBaseUrl[2],
    photo: environment.initialFavoritePokemonImages[2],
    isFavorite: true,
  },
];
