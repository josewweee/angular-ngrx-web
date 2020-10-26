import { environment } from './../../../environments/environment';

export const initialValues = [
  {
    name: 'bulbasaur',
    url: `${environment.pokemonImage}1/`,
    photo: `${environment.pokemonImage}1.png`,
    isFavorite: true,
    id: 1
  },
  {
    name: 'charmander',
    url: `${environment.pokemonImage}4/`,
    photo: `${environment.pokemonImage}4.png`,
    isFavorite: true,
    id: 4
  },
  {
    name: 'squirtle',
    url: `${environment.pokemonImage}7/`,
    photo: `${environment.pokemonImage}7.png`,
    isFavorite: true,
    id: 7
  },
];
