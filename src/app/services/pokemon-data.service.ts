import { PokemonsPage } from './../models/pokemons-page';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';

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
            const firstSlashInUrl = item['url'].indexOf(
              '/',
              lastSlashInUrl - 4
            );
            const pokemonId = item['url'].slice(
              firstSlashInUrl + 1,
              lastSlashInUrl
            );
            let photo = `https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/${pokemonId}.png`;
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
          const firstSlashInUrl = item['url'].indexOf('/', lastSlashInUrl - 4);
          const pokemonId = item['url'].slice(
            firstSlashInUrl + 1,
            lastSlashInUrl
          );
          let photo = `https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/${pokemonId}.png`;
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
