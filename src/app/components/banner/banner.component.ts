import { Component, OnInit } from '@angular/core';
import { FavoriteEntityService } from 'src/app/services/favorite-pokemons/favorite-entity.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  images: any = [
    {
      path:
        'https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/1.png',
    },
    {
      path:
        'https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/4.png',
    },
    {
      path:
        'https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/7.png',
    },
  ];

  favoritesLength: number = undefined;

  constructor(private favoriteEntityService: FavoriteEntityService) {}

  ngOnInit(): void {
    this.favoriteEntityService.entities$.subscribe((data) => {
      this.favoritesLength = data.length;
      if (this.favoritesLength > 0) {
        this.images = [];
        data.forEach((item) => {
          this.images.push({ path: item.photo });
        });
      }
    });

    if (this.favoritesLength === 0) {
      let initialValues = [
        {
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
          photo:
            'https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/1.png',
          isFavorite: true,
        },
        {
          name: 'charmander',
          url: 'https://pokeapi.co/api/v2/pokemon/4/',
          photo:
            'https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/4.png',
          isFavorite: true,
        },
        {
          name: 'squirtle',
          url: 'https://pokeapi.co/api/v2/pokemon/7/',
          photo:
            'https://raw.githubusercontent.com/PokeAPI/sprites/146c91287ad01f6e15315bbd733fd7442c91fe6d/sprites/pokemon/7.png',
          isFavorite: true,
        },
      ];
      this.favoriteEntityService.addManyToCache(initialValues);
    }
  }
}
