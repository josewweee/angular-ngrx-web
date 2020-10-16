import { PokemonsPage } from '../../models/shared/pokemons-page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PokemonDataService extends DefaultDataService<PokemonsPage> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Pokemons', http, httpUrlGenerator);
  }

  getWithQuery(options): Observable<PokemonsPage[]> {
    return this.http
      .get(environment.pokemonApiPageBaseUrl(options.limit, options.id))
      .pipe(
        tap((res) => console.log(res['results'])),
        map((res) => res['results']),
        map((res: PokemonsPage[]) => {
          res.map((item: PokemonsPage) => {
            const lastSlashInUrl = item['url'].lastIndexOf('/');
            const lastLetterInUrl = item['url'].indexOf('n');
            const pokemonId = item['url'].slice(
              lastLetterInUrl + 2,
              lastSlashInUrl
            );
            let photo = environment.pokemonImage(pokemonId);
            item.photo = photo;
          });
          return res;
        })
      );
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
          let photo = environment.pokemonImage(pokemonId);
          item.photo = photo;
          if (
            item.name == 'bulbasaur' ||
            item.name == 'charmander' ||
            item.name == 'squirtle'
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
}
