import { PokemonsPage } from '../../models/pokemons-page';
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class FavoriteEntityService extends EntityCollectionServiceBase<
  PokemonsPage
> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('FavoritePokemons', serviceElementsFactory);
  }
}
