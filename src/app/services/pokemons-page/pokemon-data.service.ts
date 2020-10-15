import { PokemonsPage } from '../../models/pokemons-page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonDataService extends DefaultDataService<PokemonsPage> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Pokemons', http, httpUrlGenerator);
  }

  getWithQuery(options): Observable<PokemonsPage[]> {
    return this.http
      .get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${options.limit}&offset=${options.id}`
      )
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
            let photo = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
            item.photo = photo;
          });
          return res;
        })
      );
  }

  getAll(): Observable<PokemonsPage[]> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/').pipe(
      map((res) => res['results']),
      map((res: PokemonsPage[]) => {
        res.map((item: PokemonsPage) => {
          const lastSlashInUrl = item['url'].lastIndexOf('/');
          const lastLetterInUrl = item['url'].indexOf('n');
          const pokemonId = item['url'].slice(
            lastLetterInUrl + 2,
            lastSlashInUrl
          );
          let photo = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
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
