import { Pokemon } from '../../models/shared/pokemon';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { forkJoin, from, Observable } from 'rxjs';
import { map, mergeMap, subscribeOn, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FetchedPokemonsDataService extends DefaultDataService<Pokemon> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Pokemons', http, httpUrlGenerator);
  }

  request(url: string) {
    return this.http.get(url);
  }

  getById(url: string): Observable<Pokemon> {
    return this.request(url).pipe(
      switchMap((response: Pokemon) => {
        return this.request(response.species.url).pipe(
          map((data) => {
            response.gender =
              data['gender_rate'] == -1
                ? 'genderless'
                : data['gender_rate'] > 4
                ? 'female'
                : 'male';
            response.flavor_text = data['flavor_text_entries'].find((item) => {
              if (item['language']['name'] == 'en') {
                return item['flavor_text'];
              }
            });
            return response;
          })
        );
      })
    );
  }
}
