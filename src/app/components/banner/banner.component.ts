import { selectAllFavoritePokemons } from './../../ngrx/selectors/favorite-pokemons/favorite-pokemons.selector';
import { imagesPath } from '../../models/banner/images-path';
import { Subscription, Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { initialValues } from './banner.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';
import { addMultipleFavorite } from 'src/app/ngrx/actions/favorite-pokemons/favorite-pokemons.actions';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit, OnDestroy {
  images: imagesPath[] = [
    {
      path: `${environment.pokemonImage}1.png`,
    },
    {
      path: `${environment.pokemonImage}4.png`,
    },
    {
      path: `${environment.pokemonImage}7.png`,
    },
  ];

  favoritesLength: number;

  favoritePokemons: Subscription;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateFavoritePokemonsImages();
    this.initializeDefaultFavoritePokemons();
  }

  updateFavoritePokemonsImages() {
    this.favoritePokemons = this.store.pipe(
      select(selectAllFavoritePokemons),
      take(1)
    ).subscribe((data) => {
      this.favoritesLength = data.length;
      if (this.favoritesLength > 0) {
        this.images = [];
        this.images = data.map(item => ({path:item.photo}))
      }
    });
  }

  initializeDefaultFavoritePokemons() {
    if (this.favoritesLength === 0) {
      const newActionAddingMultipleFavorites = addMultipleFavorite({pokemons: initialValues})
      this.store.dispatch(newActionAddingMultipleFavorites)
    }
  }

  ngOnDestroy() {
    this.favoritePokemons.unsubscribe();
  }
}
