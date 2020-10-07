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
        map((res) => res['results'])
      );
  }

  getAll(): Observable<PokemonsPage[]> {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/').pipe(
      map((res) => res['results']),
      tap((res) => console.log(res))
    );
  }
}
