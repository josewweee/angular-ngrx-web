import { Pokemon } from '../../models/shared/pokemon';
import { Injectable } from '@angular/core';
import { PokemonsPage } from '../../models/shared/pokemons-page';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<PokemonsPage[]> {
    return this.http.get(environment.pokemonsBaseUrl).pipe(
      map((res) => res['results']),
      map((res: PokemonsPage[]) => {
        res.map((item: PokemonsPage) => {
          const lastSlashInUrl = item['url'].lastIndexOf('/');
          const lastLetterInUrl = item['url'].indexOf('n');
          const pokemonId = item['url'].slice(
            lastLetterInUrl + 2,
            lastSlashInUrl
          );
          item.id = parseInt(pokemonId);
          let photo = `${environment.pokemonImage}${pokemonId}.png`;
          item.photo = photo;
          if (
            item.name === 'bulbasaur' ||
            item.name === 'charmander' ||
            item.name === 'squirtle'
          ) {
            item.isFavorite = true;
          } else {
            item.isFavorite = false;
          }
        });
        return res;
      })
    );
  }

  getWithQuery(offset: string): Observable<PokemonsPage[]> {
    const pageUrl = `${environment.pokemonsBaseUrl}?limit=$20&offset=${offset}`
    return this.http
      .get(pageUrl)
      .pipe(
        map((res) => res['results']),
        map((res: PokemonsPage[]) => {
          res.map((item: PokemonsPage) => {
            const lastSlashInUrl = item['url'].lastIndexOf('/');
            const lastLetterInUrl = item['url'].indexOf('n');
            const pokemonId = item['url'].slice(
              lastLetterInUrl + 2,
              lastSlashInUrl
            );
            item.id = parseInt(pokemonId);
            let photo = `${environment.pokemonImage}${pokemonId}.png`;
            item.photo = photo;
          });
          return res;
        })
      );
  }
}
