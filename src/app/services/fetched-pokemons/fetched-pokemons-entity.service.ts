import { Pokemon } from './../../models/pokemon';
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FetchedPokemonsEntityService extends EntityCollectionServiceBase<
  Pokemon
> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('FetchedPokemons', serviceElementsFactory);
  }
}
