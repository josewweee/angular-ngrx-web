import { Pokemon } from '../../models/shared/pokemon';
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class FetchedPokemonsEntityService extends EntityCollectionServiceBase<
  Pokemon
> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('FetchedPokemons', serviceElementsFactory);
  }
}
