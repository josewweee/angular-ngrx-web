import { Observable, Subscription } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FavoriteEntityService } from 'src/app/services/favorite-pokemons/favorite-entity.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit, OnDestroy {
  images = [
    {
      path: environment.initialFavoritePokemonImages[0],
    },
    {
      path: environment.initialFavoritePokemonImages[1],
    },
    {
      path: environment.initialFavoritePokemonImages[2],
    },
  ];

  favoritesLength: number;

  favoritePokemons$: Subscription;

  constructor(private favoriteEntityService: FavoriteEntityService) {}

  ngOnInit(): void {
    this.updateFavoritePokemonsImages();
    this.initializeDefaultFavoritePokemons();
  }

  updateFavoritePokemonsImages() {
    this.favoritePokemons$ = this.favoriteEntityService.entities$.subscribe(
      (data) => {
        this.favoritesLength = data.length;
        if (this.favoritesLength > 0) {
          this.images = [];
          data.map((item) => {
            this.images.push({ path: item.photo });
          });
        }
      }
    );
  }

  initializeDefaultFavoritePokemons() {
    if (this.favoritesLength === 0) {
      const initialValues = [
        {
          name: 'bulbasaur',
          url: environment.initialFavoritePokemonsBaseUrl[0],
          photo: environment.initialFavoritePokemonImages[0],
          isFavorite: true,
        },
        {
          name: 'charmander',
          url: environment.initialFavoritePokemonsBaseUrl[1],
          photo: environment.initialFavoritePokemonImages[1],
          isFavorite: true,
        },
        {
          name: 'squirtle',
          url: environment.initialFavoritePokemonsBaseUrl[2],
          photo: environment.initialFavoritePokemonImages[2],
          isFavorite: true,
        },
      ];
      this.favoriteEntityService.addManyToCache(initialValues);
    }
  }

  ngOnDestroy() {
    this.favoritePokemons$.unsubscribe();
  }
}
