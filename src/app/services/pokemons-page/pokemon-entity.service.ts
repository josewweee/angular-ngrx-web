import { PokemonsPage } from '../../models/shared/pokemons-page';
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class PokemonEntityService extends EntityCollectionServiceBase<
  PokemonsPage
> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Pokemons', serviceElementsFactory);
  }
}
